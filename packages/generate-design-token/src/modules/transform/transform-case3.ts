import { isTokenObj, isTokenRef, Transformers } from "@utils";
import Token from "../../token";
import { Transformer } from "./transform.types";
import * as Types from "@types";
import findByRefTokens from "./find-referred-token";
import transformTokenResult from "./transform-token-value";

type UseCaseType = [string[], Types.TokenGroup];
type ReferredType = [string[], Types.TokenObj];

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

			return isTokenObj(refToken);
		});
	},
	transform: (useCase: UseCaseType, referred: ReferredType) => {
		const result: ReferredType[] = [];
		const [useCaseProps, useCaseToken] = useCase;
		const [referredProps] = referred;
		const useCaseTokenObjs = new Token(useCaseToken).findAll((_, token) =>
			isTokenObj(token),
		) as [string[], Types.TokenObj][];

		/**
		 * 가장 앞에 위치해야할 속성명
		 * - 참조값으로 명명된 속성명을 참조된 토큰을 가리키는 속성명으로 대체한다.
		 */
		const firstProp = useCaseProps.map((useCaseProp) =>
			isTokenRef(useCaseProp) ? referredProps.at(-1)! : useCaseProp,
		);

		for (const [useCaseTokenObjProps, useCaseTokenObj] of useCaseTokenObjs) {
			result.push(
				transformTokenResult(useCaseTokenObj, {
					props: [...firstProp, ...useCaseTokenObjProps],
					replaceValue: Transformers.toTokenRef(referredProps),
				}),
			);
		}

		return result;
	},
} as Transformer<UseCaseType, ReferredType>;
