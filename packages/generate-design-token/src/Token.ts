import * as Types from "./types";
import { validateRequiredTokenProperties } from "./validation";

type Iteratee = (tokenName: string, tokenValue: Types.Token) => boolean;

class Token {
	#token: Types.Token;

	constructor(token: Types.Token) {
		// 유효성 검사
		this.#token = token;
	}

	/**
	 *
	 * @description 주어진 참조값에 해당하는 토큰 객체 및 구조 객체를 반환한다.
	 * @returns
	 */
	find(arg: string): Types.Token | undefined;
	find(arg: Iteratee): Types.Token | undefined;
	find(arg: string | Iteratee): Types.Token | undefined {
		if (typeof arg === "string") {
			return this.#accessByPath(arg);
		}

		if (typeof arg === "function") {
			const callback = arg as Iteratee;
			let result: Types.Token | undefined;

			this.#iterator((name, token) => {
				if (callback(name, token)) {
					result = token;
				}
			});

			return result;
		}
	}

	/**
	 * @description 주어진 참조값에 해당하는 모든 토큰 객체 및 구조 객체를 반환한다.
	 * @returns
	 */
	findAll(arg: RegExp): Types.Token[];
	findAll(arg: Iteratee): Types.Token[];
	findAll(arg: RegExp | Iteratee): Types.Token[] {
		const result: Types.Token[] = [];

		this.#iterator((name, token) => {
			if (arg instanceof RegExp) {
				arg.test(name) && result.push(token);
			} else {
				arg(name, token) && result.push(token);
			}
		});

		return result;
	}

	#iterator(callback: (name: string, token: Types.Token) => void) {
		const token = this.#token;
		let stack: [string, Types.Token][][] = [Object.entries(token)];
		let currentCtx: [string, Types.Token][] = stack.pop()!;

		while (currentCtx.length) {
			const [name, token] = currentCtx.pop()!;

			callback(name, token);

			// 1. 토큰 구조 객체인 경우 Array<[속성 이름, 토큰]> 형태로 변경하여 stack에 추가한다
			if (!this.#isTokenObj(token)) {
				stack.push(Object.entries(token));
			}

			// 2. 컨텍스트(객체, 토큰)의 요소가 없으면 컨텍스트를 변경한다.
			if (currentCtx.length === 0) {
				currentCtx = stack.pop() ?? [];
			}
		}
	}

	#isTokenObj(token: Types.Token): token is Types.TokenObj {
		return validateRequiredTokenProperties(token);
	}

	#accessByPath(tokenRef: string): Types.Token | undefined {
		const paths = tokenRef.split(".");

		return paths.reduce((acc, path) => {
			if (!acc[path]) return undefined;

			return acc[path];
		}, this.#token);
	}
}

export default Token;
