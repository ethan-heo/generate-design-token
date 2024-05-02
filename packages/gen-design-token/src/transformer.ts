import { SequenceFunction, Token, TokenObj } from "./generateToken.token";
import findToken from "./utils/findToken";
import isTokenObj from "./utils/isTokenObj";
import iterateToken from "./utils/iterateToken";
import parseTokenRef from "./utils/parseTokenRef";

const findTokenToBaseTokens = (baseTokens: Token[], tokenRef: string[]) => {
	for (const baseToken of baseTokens) {
		const foundToken = findToken(baseToken, tokenRef);

		if (foundToken) {
			return foundToken;
		}
	}
};

/**
 * TODO
 * - 리팩토링 필요
 */
const transformer: SequenceFunction = (token, baseTokens) => {
	const normalizeToken = iterateToken<Map<string, TokenObj>>({
		data: new Map(),
		foundTokenObjCallback: (tokenNames, token, data) => {
			data.set(tokenNames.join("/"), token);
		},
	});

	// 1. 데이터를 일반화 한다.
	const normalizedToken = normalizeToken(token);
	const referredTokens = new Map();

	// 2. 참조할 토큰을 찾는다.
	for (const [key] of normalizedToken[Symbol.iterator]()) {
		const matcher = key.match(/\{[^{}]*\}/);

		if (matcher !== null) {
			const [referredTokenName] = matcher;
			const tokenRef = parseTokenRef(referredTokenName);

			referredTokens.set(
				referredTokenName,
				findTokenToBaseTokens(baseTokens, tokenRef),
			);
		}
	}

	// 3. 일반화된 토큰 데이터를 참조 토큰을 통해 값을 파싱한다.
	for (const [referredTokenName, referredToken] of referredTokens[
		Symbol.iterator
	]()) {
		for (const [tokenName, token] of normalizedToken[Symbol.iterator]()) {
			if (!tokenName.includes(referredTokenName)) {
				continue;
			}

			if (isTokenObj(referredToken)) {
				const tokenRef = parseTokenRef(referredTokenName);
				normalizedToken.set(
					tokenName.replace(referredTokenName, tokenRef.pop()!),
					{
						...token,
						$value: token.$value.replace("{$value}", referredToken.$value),
					},
				);
			} else {
				iterateToken({
					data: null,
					foundTokenObjCallback: (_tokenNames, _token) => {
						normalizedToken.set(
							tokenName.replace(referredTokenName, _tokenNames.join("/")),
							{
								...token,
								$value: token.$value.replace("{$value}", _token.$value),
							},
						);
					},
				})(referredToken);
			}

			normalizedToken.delete(tokenName);
		}
	}

	const result = {};

	// 4. 일반화된 토큰을 다시 토큰 형태로 변경합니다.
	for (const [tokenNames, tokenObj] of normalizedToken[Symbol.iterator]()) {
		let target = result;
		const _splitTokenNames = tokenNames.split("/");
		const targetName = _splitTokenNames.pop()!;

		for (const tokenName of _splitTokenNames) {
			target = target[tokenName] ??= {};
		}

		target[targetName] = tokenObj;
	}

	return result;
};

export default transformer;
