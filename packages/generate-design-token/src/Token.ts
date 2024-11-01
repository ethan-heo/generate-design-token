import * as Types from "./types";
import {
	shouldHaveDollarPrefix,
	shouldNotHaveDollarPrefix,
	shouldHaveRequiredProp,
} from "./validation";
import isTokenObj from "./isTokenObj";

type Iteratee = (
	props: string[],
	token: Types.Token,
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
	find(callback: Iteratee): Types.TokenResult | undefined {
		let result: Types.TokenResult | undefined;

		this.#iterator(this.#token, (props, token) => {
			if (callback(props, token, this)) {
				result = [props, token];
			}
		});

		return result;
	}

	/**
	 * @description 주어진 참조값에 해당하는 모든 토큰 객체 및 구조 객체를 반환한다.
	 * @returns
	 */
	findAll(callback: Iteratee): Types.TokenResult[] {
		const result: Types.TokenResult[] = [];

		this.#iterator(this.#token, (props, token) => {
			callback(props, token, this) && result.push([props, token]);
		});

		return result;
	}

	delete(tokenRef: string) {
		const props = this.#transformPropsTo(tokenRef);

		
	}

	add(tokenRef: string, token: Types.Token) {
		const props = tokenRef.split(".");
		const newProp = props.pop()!;
		let temp = this.#token;

		for (const prop of props) {
			if (!temp[prop]) {
				temp[prop] = {};
			}	

			temp = temp[prop] as Types.Token;
		}

		temp[newProp] = token;
	}

	#iterator(
		token: Types.Token,
		callback: (props: string[], token: Types.Token) => void,
	) {
		let stack: [string, Types.Token][][] = [Object.entries(token)];
		let currentCtx: [string, Types.Token][] = stack[stack.length - 1]!;
		let props: string[] = []

		while (currentCtx.length) {
			const [prop, token] = currentCtx.pop()!;

			props.push(prop)
			
			callback(props, token)

			if (!isTokenObj(token)) {
				const item = Object.entries(token);

				stack.push(item);
				currentCtx = item
			} else {
				props = props.slice(0, stack.length - 1)
			}

			if (currentCtx.length === 0) {
				stack.pop()
				currentCtx = stack[stack.length - 1] ?? []
				props = props.slice(0, stack.length - 1)
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

	#transformPropsTo(tokenRef: Types.TokenRef) {
		return tokenRef.split(".");
	}
}

export default Token;
