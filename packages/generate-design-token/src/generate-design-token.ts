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
	const parser = (matcher: string) => {
		let referred: [string[], Types.TokenObj] | undefined;
		const tokenRef = matcher.slice(1, -1);

		for (const token of tokens) {
			referred = token.find(
				(props) => transformPropsToTokenRef(props) === tokenRef,
			) as [string[], Types.TokenObj];

			if (referred) {
				break;
			}
		}

		return referred ? (referred[1].$value as string) : tokenRef;
	};

	const tokenObjs = baseToken.findAll((_, token) => isTokenObj(token)) as [
		string[],
		Types.TokenObj,
	][];

	for (const [_, tokenObj] of tokenObjs) {
		tokenObj.$value = (tokenObj.$value as string).replace(
			new RegExp(TOKEN_REF_REGEXP, "g"),
			parser,
		);
	}

	return baseToken.getToken();
};

export default generateDesignToken;
