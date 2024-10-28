import * as Types from "./types";
import {
	shouldHaveDollarPrefix,
	shouldNotHaveDollarPrefix,
	shouldHaveRequiredProp,
} from "./validation";

type Iteratee = (
	tokenName: string,
	tokenValue: Types.Token,
	self: Token,
) => boolean;

class Token {
	#token: Types.Token;

	constructor(token: Types.Token) {
		// 유효성 검사
		this.#validate(token);
		this.#token = token;
	}

	/**
	 *
	 * @description 주어진 참조값에 해당하는 토큰 객체 및 구조 객체를 반환한다.
	 * @returns
	 */
	find(arg: string): [string, Types.Token] | undefined;
	find(arg: Iteratee): [string, Types.Token] | undefined;
	find(arg: string | Iteratee): [string, Types.Token] | undefined {
		if (typeof arg === "string") {
			return this.#accessByPath(arg);
		}

		if (typeof arg === "function") {
			const callback = arg as Iteratee;
			let result: [string, Types.Token] | undefined;

			this.#iterator(this.#token, (name, token) => {
				if (callback(name, token, this)) {
					result = [name, token];
				}
			});

			return result;
		}
	}

	/**
	 * @description 주어진 참조값에 해당하는 모든 토큰 객체 및 구조 객체를 반환한다.
	 * @returns
	 */
	findAll(arg: RegExp): [string, Types.Token][];
	findAll(arg: Iteratee): [string, Types.Token][];
	findAll(arg: RegExp | Iteratee): [string, Types.Token][] {
		const result: [string, Types.Token][] = [];

		this.#iterator(this.#token, (name, token) => {
			if (arg instanceof RegExp) {
				arg.test(name) && result.push([name, token]);
			} else {
				arg(name, token, this) && result.push([name, token]);
			}
		});

		return result;
	}

	isTokenObj(token: Types.Token): token is Types.TokenObj {
		return shouldHaveRequiredProp(token);
	}

	#iterator(
		token: Types.Token,
		callback: (name: string, token: Types.Token) => void,
	) {
		let stack: [string, Types.Token][][] = [Object.entries(token)];
		let currentCtx: [string, Types.Token][] = stack.pop()!;

		while (currentCtx.length) {
			const [name, token] = currentCtx.pop()!;

			callback(name, token);

			// 1. 토큰 구조 객체인 경우 Array<[속성 이름, 토큰]> 형태로 변경하여 stack에 추가한다
			if (!this.isTokenObj(token)) {
				stack.push(Object.entries(token));
			}

			// 2. 컨텍스트(객체, 토큰)의 요소가 없으면 컨텍스트를 변경한다.
			if (currentCtx.length === 0) {
				currentCtx = stack.pop() ?? [];
			}
		}
	}

	#validate(token: Types.Token) {
		this.#iterator(token, (_, token) => {
			if (shouldHaveRequiredProp(token)) {
				if (shouldNotHaveDollarPrefix(token)) {
					throw new Error(
						`토큰 객체의 속성값의 이름은 $가 prefix로 시작해야합니다.`,
					);
				}
			} else {
				if (shouldHaveDollarPrefix(token)) {
					throw new Error(
						`토큰 구조 객체의 속성값의 이름은 $가 prefix로 시작되어서는 안됩니다. ${JSON.stringify(token, null, 2)}`,
					);
				}
			}
		});
	}

	#accessByPath(tokenRef: string): [string, Types.Token] | undefined {
		const paths = tokenRef.split(".");
		let token: Types.Token = this.#token;
		let name: string = "";

		for (const path of paths) {
			token = token[path];
			name = path;

			if (!token) return undefined;
		}

		return [name, token];
	}
}

export default Token;
