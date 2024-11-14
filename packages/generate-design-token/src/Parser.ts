import isTokenObj from "./isTokenObj";
import { TOKEN_REF_REGEXP } from "./regexp";
import Token from "./Token";
import transformPropsToTokenRef from "./transformPropsToTokenRef";
import { isArray, isObject, isString } from "./typeCheckers";
import * as Types from "./types";

type TokenValue = [string[], Types.TokenObjs];

class Parser {
	parse(base: Token, raws: Token[]) {
		const clonedBase = base.clone();
		const tokenObjs = clonedBase.findAll((_, token) => isTokenObj(token));
		const transformTokenValue = (value: Types.TokenObjs["$value"]) => {
			if (isString(value)) {
				return this.findValueBy(value, raws);
			}

			if (isArray(value)) {
				const result: any[] = [];

				for (const v of value) {
					result.push(
						transformTokenValue(v as unknown as Types.TokenObjs["$value"]),
					);
				}

				return result as Types.TokenObjs["$value"];
			}

			if (isObject(value)) {
				const result = {};

				for (const prop in value) {
					result[prop] = transformTokenValue(value[prop]);
				}

				return result;
			}

			return value;
		};

		for (const [_, tokenObj] of tokenObjs) {
			tokenObj.$value = transformTokenValue(tokenObj.$value);
		}

		return clonedBase;
	}

	/**
	 * 참조된 토큰값을 재귀적으로 찾아 값을 반환한다.
	 * @param tokenRef 참조값 ex) {color.primary}
	 * @param raws 참조할 토큰
	 * @returns
	 */
	findValueBy(
		tokenRef: string,
		raws: Token[],
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
						raws,
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

		const [, tokenObj] = token;

		return recur(tokenRef, tokenObj.$value);
	}
}

export default Parser;
