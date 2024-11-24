import { isTokenObj, isTokenRef, Transformers } from "@utils";
import { Token } from "@modules";
import { Transformer } from "./transform.types";
import findByRefTokens from "./find-referred-token";
import transformTokenResult from "./transform-token-value";
import { TokenGroup, TokenObj } from "@types";

type UseCaseType = [string[], TokenGroup];
type ReferredType = [string[], TokenGroup];

export default {
	findUseCases: (base: Token, refTokens: Token[]) => {
		return base.findAll((props, token) => {
			const lastProp = props.at(-1)!;

			if (!isTokenRef(lastProp) || isTokenObj(token)) {
				return false;
			}

			const foundRef = findByRefTokens(lastProp, [base, ...refTokens]);

			if (!foundRef) {
				return false;
			}

			const [, refToken] = foundRef;

			return !isTokenObj(refToken);
		});
	},
	transform: (useCase: UseCaseType, referred: ReferredType) => {
		const result: [string[], TokenObj][] = [];
		const [useCaseProps, useCaseToken] = useCase;
		const [referredProps, referredToken] = referred;
		const referredTokenObjs = new Token(referredToken).findAll((_, token) =>
			isTokenObj(token),
		) as [string[], TokenObj][];
		const useCaseTokenObjs = new Token(useCaseToken).findAll((_, token) =>
			isTokenObj(token),
		) as [string[], TokenObj][];

		for (const [referredTokenObjProps] of referredTokenObjs) {
			/**
			 * 가장 앞에 위치해야할 속성명
			 * - 참조값으로 명명된 속성명을 참조된 토큰을 가리키는 속성명으로 대체한다.
			 */
			const firstProp: string[] = [];

			for (const useCaseProp of useCaseProps) {
				if (isTokenRef(useCaseProp)) {
					firstProp.push(...referredTokenObjProps);
				} else {
					firstProp.push(useCaseProp);
				}
			}

			for (const [useCaseTokenObjProps, useCaseTokenObj] of useCaseTokenObjs) {
				result.push(
					transformTokenResult(useCaseTokenObj, {
						props: [...firstProp, ...useCaseTokenObjProps],
						replaceValue: Transformers.toTokenRef([
							...referredProps,
							...referredTokenObjProps,
						]),
					}),
				);
			}
		}

		return result;
	},
} as Transformer<UseCaseType, ReferredType>;
