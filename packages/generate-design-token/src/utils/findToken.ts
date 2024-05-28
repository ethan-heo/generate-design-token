import { TOKEN_REF_SEPERATOR } from "../constants/seperator";
import { Token, TokenObj } from "../generateToken.types";
import isTokenObj from "./isTokenObj";
import isTokenRef from "./isTokenRef";
import matchTokenRefs from "./matchTokenRefs";

const findToken = (tokenRef: string, tokens: Token[]) => {
	let _tokenRef = tokenRef;
	let result: Token | TokenObj | undefined;
	const _tokens = [...tokens];

	while (true) {
		const tokenKeys = _tokenRef.split(TOKEN_REF_SEPERATOR);
		let token;

		for (const _token of _tokens) {
			let result = _token;

			for (const tokenKey of tokenKeys) {
				result = result?.[tokenKey] as any;
			}

			if (result !== undefined) {
				token = result;
				break;
			}
		}

		if (token === undefined) {
			break;
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
