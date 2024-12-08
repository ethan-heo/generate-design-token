import { TokenGroup, TokenObj } from "../types/token.types";
import { isTokenObj } from "../utils/token-obj";
import { toTokenRef } from "../utils/token-ref";
import { isObject } from "../utils/type-checker";

export type TokenResult = [string[], TokenGroup | TokenObj];

type Iteratee = (props: string[], token: TokenGroup, self: Token) => boolean;

class Token {
	#token: TokenGroup;

	constructor(token: TokenGroup) {
		this.#token = token;
	}

	/**
	 *
	 * @description 주어진 참조값에 해당하는 토큰 객체 및 구조 객체를 반환한다.
	 * @returns
	 */
	find(callback: Iteratee): TokenResult | undefined {
		let result: TokenResult | undefined;

		this.#iterator(this.#token, (props, token) => {
			if (callback(props, token, this)) {
				// props, token을 그대로 할당하면 객체의 참조가 유지됨으로 얕은 복사가 필요한 상황.
				result = [...this.#clone<TokenResult>([props, token])];
			}
		});

		return result;
	}

	/**
	 * @description 주어진 참조값에 해당하는 모든 토큰 객체 및 구조 객체를 반환한다.
	 * @returns
	 */
	findAll(callback: Iteratee): TokenResult[] {
		const result: TokenResult[] = [];

		this.#iterator(this.#token, (props, token) => {
			callback(props, token, this) && result.push([props, token]);
		});

		return result;
	}

	/**
	 * @description 주어진 참조값에 해당하는 토큰을 삭제한다.
	 * @param props 참조값
	 * @throws {Error} parent token이 존재하지 않을 때
	 */
	delete(props: string[]) {
		let parentToken: TokenGroup = this.#token;
		const prop = props.pop()!;
		const tokenRef = toTokenRef(props);

		if (props.length > 0) {
			this.#iterator(this.#token, (props, token) => {
				if (toTokenRef(props) === tokenRef) {
					parentToken = token;
				}
			});
		}

		if (!parentToken) {
			throw new Error(`Cannot find parent token: ${tokenRef}`);
		}

		delete parentToken[prop];
	}

	/**
	 * @description 주어진 참조값에 토큰을 추가한다.
	 * @param props 토큰을 추가할 참조값
	 * @param token 추가할 토큰
	 */
	add(props: string[], token: TokenGroup | TokenObj) {
		const newProp = props.pop()!;
		let temp = this.#token;

		for (const prop of props) {
			if (!temp[prop]) {
				temp[prop] = {};
			}

			temp = temp[prop] as TokenGroup;
		}

		temp[newProp] = token;
	}

	/**
	 * @description 토큰의 복사본을 반환한다.
	 * @returns 복사된 토큰
	 */
	clone() {
		return new Token(this.#clone(this.#token));
	}

	/**
	 * @description 토큰을 순회하여 주어진 콜백을 적용하고, 그 결과를 반환한다.
	 * @param callback 토큰을 순회하는 콜백. 첫 번째 인자로 토큰의 경로를, 두 번째 인자로 토큰을 받는다.
	 * @returns 주어진 콜백을 적용한 결과를 반환한다.
	 */
	map<T extends (props: string[], token: TokenGroup | TokenObj) => any>(
		callback: T,
	) {
		const result: ReturnType<typeof callback>[] = [];

		this.#iterator(this.#clone(this.#token), (props, token) => {
			result.push(callback(props, token));
		});

		return result;
	}

	/**
	 * @description 주어진 콜백을 적용하여 필터링된 토큰을 반환합니다.
	 * @param callback 필터링을 위한 콜백. 첫 번째 인자로 토큰의 경로를, 두 번째 인자로 토큰을 받는다.
	 * @returns 필터링된 토큰을 반환합니다.
	 */
	filter<T extends (props: string[], token: TokenGroup | TokenObj) => any>(
		callback: T,
	) {
		const result: [string[], TokenGroup | TokenObj][] = [];

		this.#iterator(this.#clone(this.#token), (props, token) => {
			if (callback(props, token)) {
				result.push([props, token]);
			}
		});

		return result;
	}

	getToken() {
		return this.#token;
	}

	#iterator(
		token: TokenGroup,
		callback: (props: string[], token: TokenGroup) => void,
	) {
		let stack = [Object.entries(token)] as [string, TokenGroup][][];
		let currentCtx: [string, TokenGroup][] = stack[0]!;
		let props: string[] = [];

		while (currentCtx.length) {
			const [prop, token] = currentCtx.shift()!;

			props.push(prop);

			callback(this.#clone(props), token);

			if (isObject(token) && !isTokenObj(token)) {
				const item = Object.entries(token) as [string, TokenGroup][];

				stack = [item, ...stack];
				currentCtx = item;
			} else {
				props.pop();
			}

			if (currentCtx.length === 0) {
				while (stack.length > 0 && stack.at(0)!.length === 0) {
					stack.shift();
					props.pop();
				}

				currentCtx = stack[0] ?? [];
			}
		}
	}

	/**
	 * @description 주어진 토큰을 순회하여 주어진 콜백을 실행합니다.
	 * @param callback 토큰을 순회하는 콜백. 첫 번째 인자로 토큰의 경로를, 두 번째 인자로 토큰을 받는다.
	 */
	forEach(callback: Iteratee) {
		this.#iterator(this.#token, (props, token) => {
			callback(props, token, this);
		});
	}

	#clone<T>(value: T) {
		return structuredClone(value);
	}
}

export default Token;
