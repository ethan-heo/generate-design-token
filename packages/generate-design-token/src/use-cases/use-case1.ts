import UseCase from "./use-case.abstract";
import * as Types from "@types";
import { isTokenObj } from "@utils";
import Token, { TokenResult } from "../token";

type UseCaseType = [string[], Types.TokenObj];
type ReferredType = [string[], Types.TokenObj];

class UseCase1 extends UseCase<UseCaseType, ReferredType> {
	protected transformToken(
		useCase: UseCaseType,
		referred: ReferredType,
	): TokenResult[] {
		const result: [string[], Types.TokenObj][] = [];
		const [_, useCaseToken] = useCase;
		const [referredProps] = referred;

		result.push([
			[referredProps.at(-1)!],
			{
				...useCaseToken,
				$value: this.updateTokenObjValue(useCaseToken.$value, referredProps),
			},
		]);

		return result;
	}
	protected findUseCases(baseToken: Token, referredTokens: Token[]) {
		return baseToken.findAll((props, token) => {
			const lastProp = props.at(-1)!;

			if (!this.hasTokenRef(lastProp) || !isTokenObj(token)) {
				return false;
			}

			return this.isTokenObjByTokens(lastProp, referredTokens);
		}) as UseCaseType[];
	}
}

export default UseCase1;