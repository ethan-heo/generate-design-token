import * as Types from "./TokenGenerator.types";
import { validateRequiredTokenProperties } from "./validation";

type Iteratee = (tokenRef: string, tokenValue: Types.Token) => boolean;

class Token {
	#token: Types.Token;
	constructor(token: Types.Token) {
		// 유효성 검사
		this.#token = token;
	}

	find(callback: Iteratee): Types.Token | undefined {
		const token = this.#token;
		let stack: [string, Types.Token][][] = [Object.entries(token)];
		let currentCtx: [string, Types.Token][] = stack[0];
		let result: Types.Token | undefined;

		while (stack.length) {
			const [tokenName, tokenValue] = currentCtx.shift()!;

			if (callback(tokenName, tokenValue)) {
				result = tokenValue;
				break;
			}

			if (currentCtx.length === 0) {
				stack.shift();
				currentCtx = stack[stack.length - 1];
			}

			if (!this.#isTokenObj(tokenValue)) {
				const item = Object.entries(tokenValue);
				stack = [item, ...stack];
				currentCtx = item;
			}
		}

		return result;
	}

	findAll(callback: Iteratee): Types.Token[] {
		const token = this.#token;
		let stack: [string, Types.Token][][] = [Object.entries(token)];
		let currentCtx: [string, Types.Token][] = stack[0];
		let result: Types.Token[] = [];

		while (stack.length) {
			const [tokenName, tokenValue] = currentCtx.shift()!;

			if (callback(tokenName, tokenValue)) {
				result.push(tokenValue);
			}

			if (currentCtx.length === 0) {
				stack.shift();
				currentCtx = stack[stack.length - 1];
			}

			if (!this.#isTokenObj(tokenValue)) {
				const item = Object.entries(tokenValue);
				stack = [item, ...stack];
				currentCtx = item;
			}
		}

		return result;
	}

	#isTokenObj(token: Types.Token): token is Types.TokenObj {
		return validateRequiredTokenProperties(token);
	}
}

export default Token;
