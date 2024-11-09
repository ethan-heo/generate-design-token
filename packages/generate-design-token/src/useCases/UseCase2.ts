import UseCase from "./UseCase.abstract";
import * as Types from "../types";
import Token, { TokenResult } from "../Token";
import isTokenObj from "../isTokenObj";

type UseCaseType = [string[], Types.TokenObjs];
type ReferredType = [string[], Types.Token];

class UseCase2 extends UseCase<UseCaseType, ReferredType> {
	protected transformToken(
		useCase: UseCaseType,
		referred: ReferredType,
	): TokenResult[] {
		const result: TokenResult[] = [];
		const [useCaseProps, useCaseToken] = useCase;
		const [referredProps, referredToken] = referred;
		const referredTokenObjs = new Token(referredToken).findAll((_, token) =>
			isTokenObj(token),
		) as ReferredType[];

		const getNewProps = (useCaseProps: string[], referredProps: string[]) => {
			const result: string[] = [];

			for (const useCaseProp of useCaseProps) {
				if (this.hasTokenRef(useCaseProp)) {
					result.push(...referredProps);

					break;
				} else {
					result.push(useCaseProp);
				}
			}

			return result;
		};

		for (const [referredTokenProps] of referredTokenObjs) {
			result.push([
				getNewProps(useCaseProps, referredTokenProps),
				{
					...useCaseToken,
					$value: this.updateTokenObjValue(useCaseToken.$value as string, [
						...referredProps,
						...referredTokenProps,
					]),
				},
			]);
		}

		return result;
	}

	protected findUseCases(baseToken: Token, referredTokens: Token[]) {
		return baseToken.findAll((props, token) => {
			const lastProp = props.at(-1)!;

			if (!this.hasTokenRef(lastProp) || !isTokenObj(token)) {
				return false;
			}

			return !this.isTokenObjByTokens(lastProp, referredTokens);
		}) as UseCaseType[];
	}
}

export default UseCase2;
