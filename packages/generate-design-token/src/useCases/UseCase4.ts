import UseCase from "./UseCase.abstract";
import * as Types from "../types";
import Token from "../Token";
import isTokenObj from "../isTokenObj";

type UseCaseType = [string[], Types.Token];
type ReferredType = [string[], Types.Token];

class UseCase4 extends UseCase<UseCaseType, ReferredType> {
	protected transformToken(
		useCase: UseCaseType,
		referred: ReferredType,
	): Types.TokenResult[] {
		const result: Types.TokenResult[] = [];
		const [useCaseProps, useCaseToken] = useCase;
		const [referredProps, referredToken] = referred;
		const referredTokenObjs = new Token(referredToken).findAll((_, token) =>
			isTokenObj(token),
		) as [string[], Types.TokenObj][];
		const useCaseTokenObjs = new Token(useCaseToken).findAll((_, token) =>
			isTokenObj(token),
		) as [string[], Types.TokenObj][];

		for (const [useCaseTokenObjProps, useCaseTokenObj] of useCaseTokenObjs) {
			for (const [referredTokenObjProps] of referredTokenObjs) {
				result.push([
					[
						...useCaseProps.filter((prop) => !this.hasTokenRef(prop)),
						...referredTokenObjProps,
						...useCaseTokenObjProps,
					],
					{
						...useCaseTokenObj,
						$value: this.updateTokenObjValue(useCaseTokenObj.$value as string, [
							...referredProps,
							...referredTokenObjProps,
						]),
					},
				]);
			}
		}
		return result;
	}
	protected findUseCases(baseToken: Token, referredTokens: Token[]) {
		return baseToken.findAll((props, token) => {
			const lastProp = props.at(-1)!;

			if (!this.hasTokenRef(lastProp) || isTokenObj(token)) {
				return false;
			}

			return !this.isTokenObjByTokens(lastProp, referredTokens);
		}) as UseCaseType[];
	}
}

export default UseCase4;
