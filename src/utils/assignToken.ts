import { Token, TokenObj } from "../generateToken.types";
import isTokenObj from "./isTokenObj";

const assignToken = (
	tokenNames: string[],
	data: Token,
	tokenObj: Token | TokenObj,
) => {
	if (tokenNames.length > 0) {
		const _tokenNames = [...tokenNames];
		let target = _tokenNames.pop()!;

		for (const tokenName of _tokenNames) {
			if (data[tokenName] === undefined) {
				data[tokenName] = {};
			}

			data = data[tokenName] as Token;
		}

		if (isTokenObj(tokenObj)) {
			data[target] = tokenObj;
		} else {
			data[target] = {
				...data[target],
				...tokenObj,
			};
		}
	} else {
		for (const [tokenName, token] of Object.entries(tokenObj as Token)) {
			data[tokenName] = token;
		}
	}
};

export default assignToken;
