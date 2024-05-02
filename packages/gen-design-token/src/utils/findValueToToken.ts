import { Token, TokenObj } from "../generateToken.token";
import findToken from "./findToken";
import isTokenObj from "./isTokenObj";

const findValueToToken = (
	tokenKeys: string[],
	tokens: Token[],
): Token | TokenObj | undefined => {
	for (const token of tokens) {
		const foundToken = findToken(token, tokenKeys);

		if (foundToken === undefined) {
			continue;
		}

		if (!isTokenObj(foundToken)) {
			throw new Error(
				`tokenKeys는 반드시 토큰 객체를 참조해야 합니다. [${tokenKeys.join(".")}]`,
			);
		}

		const TOKEN_REF_REGEXP = /\{[^{}]*\}/g;

		if (TOKEN_REF_REGEXP.test(foundToken.$value)) {
			const tokenKeys = foundToken.$value
				.slice(1, foundToken.$value.length - 1)
				.split(".");
			return findValueToToken(tokenKeys, tokens);
		}

		return foundToken;
	}
};

export default findValueToToken;
