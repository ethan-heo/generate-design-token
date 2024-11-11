import { TOKEN_REF_REGEXP } from "./regexp";
import Token from "./Token";
import transformPropsToTokenRef from "./transformPropsToTokenRef";
import { isArray, isObject, isString } from "./typeCheckers";
import * as Types from "./types";

class Parser {
	#base: Token;
	#raws: Token[];
	constructor(base: Token, raws: Token[]) {
		this.#base = base;
		this.#raws = raws;
	}

	parse() {}

	findValueByTokenRef<T>(value: T): T {}

	findTokenValue(
		tokenRef: string,
		raws: Token[] = this.#raws,
	): Types.TokenObjs["$value"] {
		if (raws.length === 0) {
			console.log(tokenRef, raws);
			throw new Error(`토큰을 찾을 수 없습니다: ${tokenRef}`);
		}

		let token: [string[], Types.TokenObjs] | null = null;
		const recur = (value: unknown, raws: Token[]) => {
			if (isString(value)) {
				const matchedTokenRef = value.match(TOKEN_REF_REGEXP);

				if (matchedTokenRef) {
					return this.findTokenValue(matchedTokenRef[1], raws);
				}

				return value;
			}

			if (isArray(value)) {
				return value.map((value) => recur(value, raws));
			}

			if (isObject(value)) {
				return Object.fromEntries(
					Object.entries(value).map(([key, value]) => [
						key,
						recur(value, raws),
					]),
				);
			}

			return value;
		};

		for (const raw of raws) {
			const foundTokenObj = raw.find(
				(props) => transformPropsToTokenRef(props) === tokenRef,
			) as [string[], Types.TokenObjs];

			if (foundTokenObj) {
				token = foundTokenObj!;
				break;
			}
		}

		if (!token) {
			throw new Error(`정의되지 않은 토큰입니다: ${tokenRef}`);
		}

		return recur(token[1].$value, raws.slice(1));
	}
}

export default Parser;
