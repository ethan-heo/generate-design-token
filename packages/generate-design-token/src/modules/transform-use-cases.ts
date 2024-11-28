import findByRefTokens from "./find-referred-token";
import transformTokenResult from "./transform-token-value";
import { TokenGroup, TokenObj } from "../types/token.types";
import { isTokenRef, toTokenRef } from "../utils/token-ref";
import { isTokenObj } from "../utils/token-obj";
import { Transformer } from "./transform.types";
import Token from "./token";

export const useCase1: Transformer<[string[], TokenObj], [string[], TokenObj]> =
	{
		findUseCases: (base, refTokens) => {
			return base.findAll((props, token) => {
				const lastProp = props.at(-1)!;

				if (!isTokenRef(lastProp) || !isTokenObj(token)) {
					return false;
				}

				const foundRef = findByRefTokens(lastProp, [base, ...refTokens]);

				if (!foundRef) {
					return false;
				}

				const [, refToken] = foundRef;

				return isTokenObj(refToken);
			}) as [string[], TokenObj][];
		},
		transform: (useCase, referred) => {
			return [
				transformTokenResult(useCase[1], {
					props: [referred[0].at(-1)!],
					replaceValue: toTokenRef(referred[0]),
				}),
			];
		},
	};

export const useCase2: Transformer<
	[string[], TokenObj],
	[string[], TokenGroup]
> = {
	findUseCases: (base: Token, refTokens: Token[]) => {
		return base.findAll((props, token) => {
			const lastProp = props.at(-1)!;

			if (!isTokenRef(lastProp) || !isTokenObj(token)) {
				return false;
			}

			const foundRef = findByRefTokens(lastProp, [base, ...refTokens]);

			if (!foundRef) {
				return false;
			}

			const [, refToken] = foundRef;

			return !isTokenObj(refToken);
		}) as [string[], TokenObj][];
	},
	transform: (useCase, referred) => {
		const result: [string[], TokenObj][] = [];
		const [useCaseProps, useCaseToken] = useCase;
		const [referredProps, referredToken] = referred;
		const referredTokenObjs = new Token(referredToken).findAll((_, token) =>
			isTokenObj(token),
		) as [string[], TokenObj][];

		for (const [referredTokenProps] of referredTokenObjs) {
			result.push(
				transformTokenResult(useCaseToken, {
					props: [...useCaseProps.slice(0, -1), ...referredTokenProps],
					replaceValue: toTokenRef([...referredProps, ...referredTokenProps]),
				}),
			);
		}

		return result;
	},
};

export const useCase3: Transformer<
	[string[], TokenGroup],
	[string[], TokenObj]
> = {
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
	transform: (useCase, referred) => {
		const result: [string[], TokenObj][] = [];
		const [useCaseProps, useCaseToken] = useCase;
		const [referredProps] = referred;
		const useCaseTokenObjs = new Token(useCaseToken).findAll((_, token) =>
			isTokenObj(token),
		) as [string[], TokenObj][];

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
					replaceValue: toTokenRef(referredProps),
				}),
			);
		}

		return result;
	},
};

export const useCase4: Transformer<
	[string[], TokenGroup],
	[string[], TokenGroup]
> = {
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
	transform: (useCase, referred) => {
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
						replaceValue: toTokenRef([
							...referredProps,
							...referredTokenObjProps,
						]),
					}),
				);
			}
		}

		return result;
	},
};
