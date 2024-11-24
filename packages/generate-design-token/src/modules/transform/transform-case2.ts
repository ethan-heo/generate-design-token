import { isTokenObj, isTokenRef, Transformers } from "@utils";
import Token from "../../token";
import { Transformer } from "./transform.types";
import findByRefTokens from "./find-referred-token";
import transformTokenResult from "./transform-token-value";
import { TokenGroup, TokenObj } from "@types";

type UseCaseType = [string[], TokenObj];
type ReferredType = [string[], TokenGroup];

export default {
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
		});
	},
	transform: (useCase: UseCaseType, referred: ReferredType) => {
		const result: [string[], TokenObj][] = [];
		const [useCaseProps, useCaseToken] = useCase;
		const [referredProps, referredToken] = referred;
		const referredTokenObjs = new Token(referredToken).findAll((_, token) =>
			isTokenObj(token),
		) as ReferredType[];

		for (const [referredTokenProps] of referredTokenObjs) {
			result.push(
				transformTokenResult(useCaseToken, {
					props: [...useCaseProps.slice(0, -1), ...referredTokenProps],
					replaceValue: Transformers.toTokenRef([
						...referredProps,
						...referredTokenProps,
					]),
				}),
			);
		}

		return result;
	},
} as Transformer<UseCaseType, ReferredType>;
