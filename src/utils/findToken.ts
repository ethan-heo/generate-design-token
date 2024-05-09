import { TOKEN_REF_SEPERATOR } from "../constants/seperator";
import { Token, TokenObj } from "../generateToken.types";
import isTokenObj from "./isTokenObj";
import isTokenRef from "./isTokenRef";
import matchTokenRefs from "./matchTokenRefs";

const findToken = (tokenRef: string, tokens: Token[]) => {
	let _tokenRef = tokenRef;
	let result: Token | TokenObj | undefined;
	const _tokens = [...tokens];

	while (_tokens.length) {
		const tokenKeys = _tokenRef.split(TOKEN_REF_SEPERATOR);
		const token = tokenKeys.reduce(
			(result, tokenKey) => result?.[tokenKey] as any,
			_tokens.shift(),
		);

		if (token === undefined) {
			continue;
		}

		if (!isTokenObj(token)) {
			result = token;
			break;
		}

		if (isTokenRef(token.$value)) {
			_tokenRef = matchTokenRefs(token.$value)[0];

			continue;
		}

		result = token;
		break;
	}

	return result;
};

export default findToken;
