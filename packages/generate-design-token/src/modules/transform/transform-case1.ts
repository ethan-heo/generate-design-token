import { isTokenObj, isTokenRef, Transformers } from "@utils";
import Token from "../../token";
import { Transformer } from "./transform.types";
import * as Types from "@types";
import findByRefTokens from "./find-referred-token";
import transformTokenResult from "./transform-token-value";

type UseCaseType = [string[], Types.TokenObj];
type ReferredType = [string[], Types.TokenObj];

const replaceTokenObj = (
	useCaseToken: Types.TokenObj | Types.TokenGroup,
	referredToken: Types.TokenObj | Types.TokenGroup,
) => {};

export default {
	findUseCases: (base: Token, refTokens: Token[]) => {
		return base.findAll((props, token) => {
			const lastProp = props.at(-1)!;

			if (!isTokenRef(lastProp) || !isTokenObj(token)) {
				return false;
			}

			const foundRef = findByRefTokens(lastProp, refTokens);

			if (!foundRef) {
				return false;
			}

			const [, refToken] = foundRef;

			return isTokenObj(refToken);
		});
	},
	transform: (useCase: UseCaseType, referred: ReferredType) => {
		return [
			transformTokenResult(useCase[1], {
				props: [referred[0].at(-1)!],
				replaceValue: Transformers.toTokenRef(referred[0]),
			}),
		];
	},
} as Transformer<UseCaseType, ReferredType>;
