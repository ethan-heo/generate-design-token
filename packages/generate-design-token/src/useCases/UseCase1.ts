import UseCase from "./UseCase.abstract";
import * as Types from "../types";
import isTokenObj from "../isTokenObj";
import Token from "../Token";
import transformPropsToTokenRef from "../transformPropsToTokenRef";

type TransformedResult = [string[], Types.TokenObj];

class UseCase1 extends UseCase<TransformedResult> {
	protected transformToken(
		useCase: [string[], Types.TokenObj][],
		referred: [string[], Types.TokenObj][],
	): TransformedResult[] {
		const result: TransformedResult[] = [];

		for (const [useCaseProps, useCaseToken] of useCase) {
			for (const [referredProps] of referred) {
				result.push([
					[
						...useCaseProps.map((prop) => {
							if (this.hasTokenRef(prop)) {
								return referredProps[referredProps.length - 1];
							}

							return prop;
						}),
					],
					{
						...useCaseToken,
						$value: this.updateTokenObjValue(
							useCaseToken.$value as string,
							referredProps,
						),
					},
				]);
			}
		}

		return result;
	}
	protected findCases(baseToken: Token, referredTokens: Token[]) {
		return baseToken.findAll((props, token) => {
			const tokenRef = transformPropsToTokenRef(props);

			if (!this.hasTokenRef(tokenRef) || !isTokenObj(token)) {
				return false;
			}

			return this.isTokenObjByTokens(tokenRef, referredTokens);
		}) as TransformedResult[];
	}
}

export default UseCase1;
