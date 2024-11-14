import isTokenObj from "./isTokenObj";
import { TOKEN_REF_REGEXP } from "./regexp";
import Token from "./Token";
import transformPropsToTokenRef from "./transformPropsToTokenRef";
import { isArray, isObject, isString } from "./typeCheckers";
import * as Types from "./types";

type TokenValue = [string[], Types.TokenObjs];

class Parser {
	#base: Token;
	#raws: Token[];
	constructor(base: Token, raws: Token[]) {
		this.#base = base;
		this.#raws = raws;
	}

	parse() {}

	/**
	 * 참조된 토큰값을 재귀적으로 찾아 값을 반환한다.
	 * @param tokenRef 참조값 ex) {color.primary}
	 * @param raws 참조할 토큰
	 * @returns
	 */
	findValueBy(
		tokenRef: string,
		circularReferenceMap = new Map<string, string>(),
	): Types.TokenObjs["$value"] {
		if (!tokenRef.match(TOKEN_REF_REGEXP)) {
			return tokenRef;
		}

		let token: TokenValue | null = null;
		const checkCircularReference = (
			referringTokenRef: string,
			referredTokenRef: string,
		) => {
			let temp: string | undefined = referredTokenRef;

			while (temp && temp !== referringTokenRef) {
				temp = circularReferenceMap.get(temp!);
			}

			return temp === referringTokenRef;
		};
		const recur = (referringTokenRef: string, value: unknown) => {
			if (isString(value)) {
				const matchedTokenRef = value.match(TOKEN_REF_REGEXP);

				if (matchedTokenRef) {
					const referredTokenRef = matchedTokenRef[0];

					circularReferenceMap.set(referringTokenRef, referredTokenRef);

					if (checkCircularReference(referringTokenRef, referredTokenRef)) {
						throw new Error(
							`${referringTokenRef}와 ${referredTokenRef}가 서로 순환 참조하고 있습니다`,
						);
					}

					return this.findValueBy(
						referredTokenRef,
						circularReferenceMap,
					) as string;
				} else {
					return value;
				}
			}

			if (isArray(value)) {
				return value.map((value) => recur(referringTokenRef, value));
			}

			if (isObject(value)) {
				return Object.fromEntries(
					Object.entries(value).map(([key, value]) => [
						key,
						recur(referringTokenRef, value),
					]),
				);
			}

			return value;
		};

		const raws = this.#raws;

		for (const raw of raws) {
			const foundTokenObj = raw.find(
				(props) => transformPropsToTokenRef(props) === tokenRef.slice(1, -1),
			) as TokenValue;

			if (foundTokenObj) {
				token = foundTokenObj!;
				break;
			}
		}

		if (!token) {
			throw new Error(`정의되지 않은 토큰입니다: ${tokenRef}`);
		}

		return recur(tokenRef, token[1].$value);
	}
}

export default Parser;
