import { Token, TokenObj } from "./generateToken.types";
import isTokenObj from "./utils/isTokenObj";

type TokenIterator = [string, TokenObj][];

class TokenProcessor {
	#tokenIterator: TokenIterator;

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
	public findTokenStructureObj(tokenRef: string) {}

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
				result.push([paths.join("."), token]);
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
