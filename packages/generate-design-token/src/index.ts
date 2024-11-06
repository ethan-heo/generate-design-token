import * as Types from "./types";
import Token from "./Token";
import UseCases from "./useCases";
import isTokenObj from "./isTokenObj";
import { TOKEN_REF_REGEXP } from "./regexp";
import transformPropsToTokenRef from "./transformPropsToTokenRef";

const generateDesignToken = (base: Types.Token, raws: Types.Token[]) => {
	const baseToken = new Token(base);
	const useCases = new UseCases();
	const tokens = raws.map((raw) => new Token(raw));

	useCases.transform(baseToken, tokens);
	// parse token

	const tokenObjs = baseToken.findAll((_, token) => isTokenObj(token)) as [
		string[],
		Types.TokenObj,
	][];

	for (const [_, tokenObj] of tokenObjs) {
		const matchedTokenRef = (tokenObj.$value as string).match(TOKEN_REF_REGEXP);

		if (!matchedTokenRef) {
			continue;
		}

		const tokenRef = matchedTokenRef[0].slice(1, -1);
		let referred: [string[], Types.TokenObj] | undefined;

		for (const token of tokens) {
			referred = token.find(
				(props) => transformPropsToTokenRef(props) === tokenRef,
			) as [string[], Types.TokenObj];

			if (referred) {
				break;
			}
		}

		if (!referred) {
			continue;
		}

		const [_, referredToken] = referred;

		tokenObj.$value = (tokenObj.$value as string).replace(
			matchedTokenRef[0],
			referredToken.$value as string,
		);
	}

	return baseToken.getToken();
};

export default generateDesignToken;

export * from "./types";
