import { Token } from "./types/token";
import { TokenIterator } from "./types/token";
import isTokenObj from "./utils/isTokenObj";
import validateTokenObj from "./validator/validateTokenObj";

/**
 * @description 토큰을 처리하기 위한 전반적인 역할을 담당한다
 */
class TokenProcessor {
	#tokenIterator: TokenIterator;
	#SEPERATOR = ".";

	constructor(token: Token) {
		this.#tokenIterator = this.transformTokenToIterator(token);
	}

	/**
	 * @description 토큰 이터레이터 객체를 반환한다.
	 * @returns
	 */
	public getToken() {
		return this.#tokenIterator;
	}

	/**
	 * @description 참조 토큰을 입력받아 토큰 객체를 찾아 반환한다.
	 * @param tokenRef
	 */
	public findTokenObj(tokenRef: string) {
		const foundToken = this.#tokenIterator.find(
			([_tokenRef]) => _tokenRef === tokenRef,
		);

		if (!foundToken) return null;

		return foundToken[1];
	}

	/**
	 * @description 참조 토큰을 입력받아 토큰 구조 객체를 찾아 반환한다.
	 * @param tokenRef
	 */
	public findTokenStructureObj(tokenRef: string) {
		const foundTokens: TokenIterator = [];

		for (const [_tokenRef, token] of this.#tokenIterator) {
			if (_tokenRef.includes(tokenRef)) {
				foundTokens.push([_tokenRef, token]);
			}
		}

		if (foundTokens.length === 0) return null;

		const result = {};

		for (const [_tokenRef, token] of foundTokens) {
			const slicedTokenRef = _tokenRef.slice(tokenRef.length + 1);

			Object.assign(
				slicedTokenRef.split(this.#SEPERATOR).reduce((acc, prop) => {
					return (acc[prop] = {});
				}, result),
				token,
			);
		}

		return result;
	}

	/**
	 * @description 토큰을 이터레이터 객체로 변환하는 메서드.
	 * @param token
	 */
	private transformTokenToIterator(token: Token) {
		const stack = Object.entries(token);
		const result: TokenIterator = [];
		const paths: string[] = [];
		let propCounts: number[] = [];
		const revertPaths = () => {
			const _propCounts = [...propCounts];

			for (const propCount of propCounts.reverse()) {
				paths.pop();

				if (propCount === 1) {
					_propCounts.pop();
				} else {
					_propCounts[_propCounts.length - 1] -= 1;
					break;
				}
			}

			propCounts = _propCounts;
		};

		while (stack.length > 0) {
			const [name, token] = stack.pop()!;

			paths.push(name);

			if (isTokenObj(token)) {
				validateTokenObj(token);
				result.push([paths.join(this.#SEPERATOR), token]);
				revertPaths();
			} else {
				const items = Object.entries(token);

				stack.push(...items);
				propCounts.push(items.length);
			}
		}

		return result;
	}
}

export default TokenProcessor;
