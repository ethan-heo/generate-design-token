import UseCase from "./UseCase.abstract";
import * as Types from "../types";
import Token, { TokenResult } from "../Token";
import isTokenObj from "../isTokenObj";

type UseCaseType = [string[], Types.TokenGroup];
type ReferredType = [string[], Types.TokenObjs];

class UseCase3 extends UseCase<UseCaseType, ReferredType> {
	protected transformToken(
		useCase: UseCaseType,
		referred: ReferredType,
	): TokenResult[] {
		const result: ReferredType[] = [];
		const [useCaseProps, useCaseToken] = useCase;
		const [referredProps] = referred;
		const useCaseTokenObjs = new Token(useCaseToken).findAll((_, token) =>
			isTokenObj(token),
		) as [string[], Types.TokenObjs][];

		for (const [useCaseTokenObjProps, useCaseTokenObj] of useCaseTokenObjs) {
			result.push([
				[
					...useCaseProps.filter((prop) => !this.hasTokenRef(prop)),
					referredProps.at(-1)!,
					...useCaseTokenObjProps,
				],
				{
					...useCaseTokenObj,
					$value: this.updateTokenObjValue(
						useCaseTokenObj.$value as string,
						referredProps,
					),
				},
			]);
		}

		return result;
	}
	protected findUseCases(baseToken: Token, referredTokens: Token[]) {
		return baseToken.findAll((props, token) => {
			const lastProp = props.at(-1)!;

			if (!this.hasTokenRef(lastProp) || isTokenObj(token)) {
				return false;
			}

			return this.isTokenObjByTokens(lastProp, referredTokens);
		}) as UseCaseType[];
	}
}

export default UseCase3;
