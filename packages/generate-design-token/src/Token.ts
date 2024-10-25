import * as Types from "./TokenGenerator.types";
import { validateRequiredTokenProperties } from "./validation";

type Iteratee = (tokenName: string, tokenValue: Types.Token) => boolean;

class Token {
	#token: Types.Token;

	constructor(token: Types.Token) {
		// 유효성 검사
		this.#token = token;
	}

	find(callback: Iteratee): Types.Token | undefined {
		let result: Types.Token | undefined;

		this.#iterator((tokenName, tokenValue) => {
			if (callback(tokenName, tokenValue)) {
				result = tokenValue;
			}
		});

		return result;
	}

	findAll(callback: Iteratee): Types.Token[] {
		const result: Types.Token[] = [];

		this.#iterator((tokenName, tokenValue) => {
			if (callback(tokenName, tokenValue)) {
				result.push(tokenValue);
			}
		});

		return result;
	}

	#iterator(callback: (tokenName: string, tokenValue: Types.Token) => void) {
		const token = this.#token;
		let stack: [string, Types.Token][][] = [Object.entries(token)];
		let currentCtx: [string, Types.Token][] = stack[0];

		while (stack.length) {
			const [tokenName, tokenValue] = currentCtx.shift()!;

			callback(tokenName, tokenValue);

			if (currentCtx.length === 0) {
				stack.shift();
				currentCtx = stack[0];
			}

			if (!this.#isTokenObj(tokenValue)) {
				const item = Object.entries(tokenValue);
				stack = [item, ...stack];
				currentCtx = item;
			}
		}
	}

	#isTokenObj(token: Types.Token): token is Types.TokenObj {
		return validateRequiredTokenProperties(token);
	}
}

export default Token;
