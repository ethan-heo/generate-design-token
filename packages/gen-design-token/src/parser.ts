import { Token, TokenObj } from "./generateToken.token";
import findValueToToken from "./utils/findValueToToken";
import isTokenObj from "./utils/isTokenObj";
import transformTokenToArray from "./utils/transformTokenToArray";

const parser = (mappedToken: Record<string, TokenObj>, baseTokens: Token[]) => {
	const result = {};

	for (const [name, tokenObj] of transformTokenToArray(mappedToken)) {
		const matcher = (tokenObj as TokenObj).$value.match(/\{[^{}]*\}/g);

		if (matcher === null) {
			result[name] = tokenObj;
			continue;
		}

		for (const referredTokenValue of matcher) {
			const foundToken = findValueToToken(
				referredTokenValue.slice(1, referredTokenValue.length - 1).split("."),
				baseTokens,
			);

			if (foundToken === undefined) {
				throw new Error(
					`[parser] 토큰을 찾을 수 없습니다. [${referredTokenValue}]`,
				);
			}

			if (!isTokenObj(foundToken)) {
				throw new Error(
					`[parser] 토큰 객체가 아닌 토큰 구조 객체가 사용되었습니다. [${referredTokenValue}]`,
				);
			}

			tokenObj.$value = (tokenObj as TokenObj).$value.replace(
				referredTokenValue,
				foundToken.$value,
			);
		}

		result[name] = tokenObj;
	}

	return result;
};

export default parser;
