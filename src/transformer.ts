import { TOKEN_REF_SEPERATOR } from "./constants/seperator";
import { SequenceFunction, Token, TokenObj } from "./generateToken.types";
import assignToken from "./utils/assignToken";
import findToken from "./utils/findToken";
import isTokenObj from "./utils/isTokenObj";
import isTokenRef from "./utils/isTokenRef";
import iterateToken from "./utils/iterateToken";
import matchTokenRefs from "./utils/matchTokenRefs";

/**
 * TODO
 * - 리팩토링 필요
 */
const transformer: SequenceFunction = (token, baseTokens) => {
	const skipTokenNames: string[][] = [];

	return iterateToken<Token>({
		data: {},
		iterateCallback: (tokenNames, token, data) => {
			const _tokenNames = [...tokenNames];
			const _tokenName = _tokenNames.pop()!;

			if (isTokenRef(_tokenName)) {
				let _token = token;
				const matchedTokenRef = matchTokenRefs(_tokenName)[0];
				const foundToken = findToken(matchedTokenRef, baseTokens);

				if (foundToken === undefined) {
					throw new Error(`토큰을 찾을 수 없습니다. [${_tokenName}]`);
				}

				const splitedMatchedTokenRef =
					matchedTokenRef.split(TOKEN_REF_SEPERATOR);

				if (isTokenObj(foundToken) && isTokenObj(token)) {
					splitedMatchedTokenRef.shift();

					assignToken(
						splitedMatchedTokenRef,
						(_token = {}),
						replaceTokenValue(token, matchedTokenRef),
					);
				}
				if (isTokenObj(foundToken) && !isTokenObj(token)) {
					splitedMatchedTokenRef.shift();

					_token = iterateToken<Token>({
						data: {},
						foundTokenObjCallback: (__tokenNames, __token, __data) => {
							assignToken(
								[...splitedMatchedTokenRef, ...__tokenNames],
								__data,
								replaceTokenValue(__token, matchedTokenRef),
							);
						},
					})(token);
				}
				if (!isTokenObj(foundToken) && isTokenObj(token)) {
					_token = iterateToken<Token>({
						data: {},
						foundTokenObjCallback: (__tokenNames, __token, __data) => {
							assignToken(
								__tokenNames,
								__data,
								replaceTokenValue(
									token,
									[...splitedMatchedTokenRef, __tokenNames].join(
										TOKEN_REF_SEPERATOR,
									),
								),
							);
						},
					})(foundToken);
				}
				if (!isTokenObj(foundToken) && !isTokenObj(token)) {
					_token = iterateToken<Token>({
						data: {},
						foundTokenObjCallback: (__tokenNames, __token, __data) => {
							iterateToken<Token>({
								data: {},
								foundTokenObjCallback: (___tokenNames, ___token, ___data) => {
									assignToken(
										[...__tokenNames, ...___tokenNames],
										__data,
										replaceTokenValue(
											___token,
											[...splitedMatchedTokenRef, __tokenNames].join(
												TOKEN_REF_SEPERATOR,
											),
										),
									);
								},
							})(token);
						},
					})(foundToken);
				}

				if (_tokenName.length === 0 && isTokenObj(_token)) {
					throw new Error(
						`최상위 레벨에 토큰 객체를 정의할 수 없습니다. ${tokenNames.join(".")}`,
					);
				}

				deleteToken(tokenNames, data);
				assignToken(_tokenNames, data, _token);
				skipTokenNames.push([...tokenNames]);
			} else {
				if (!skipAssignToken(tokenNames)) {
					assignToken(tokenNames, data, token);
				}
			}
		},
	})(token);

	function deleteToken(tokenNames: string[], data: Token) {
		const _tokenNames = [...tokenNames];
		let target = _tokenNames.pop()!;

		for (const tokenName of _tokenNames) {
			if (data[tokenName] === undefined) {
				data[tokenName] = {};
			}

			data = data[tokenName] as Token;
		}

		delete data[target];
	}

	function skipAssignToken(tokenNames: string[]) {
		const tokenNamesStr = tokenNames.join(TOKEN_REF_SEPERATOR);

		return skipTokenNames.some((skipTokenName) =>
			tokenNamesStr.includes(skipTokenName.join(TOKEN_REF_SEPERATOR)),
		);
	}

	function replaceTokenValue(token: TokenObj, replacer: string) {
		return {
			...token,
			$value: token.$value.replace("$value", replacer),
		};
	}
};

export default transformer;
