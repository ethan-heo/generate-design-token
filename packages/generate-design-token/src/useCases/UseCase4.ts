import UseCase from "./UseCase.abstract";
import * as Types from "../types";
import Token from "../Token";
import transformPropsToTokenRef from "../transformPropsToTokenRef";
import isTokenObj from "../isTokenObj";

type TransformedResult = [string[], Types.Token];

class UseCase4 extends UseCase<TransformedResult> {
	protected transformToken(
		useCase: [string[], Types.TokenObj][],
		referred: [string[], Types.TokenObj][],
	): TransformedResult[] {
		const result: TransformedResult[] = [];

		for (const [useCaseProps, useCaseToken] of useCase) {
			for (const [referredProps] of referred) {
				result.push([
					useCaseProps.map((prop) => {
						if (this.hasTokenRef(prop)) {
							return prop.replace(
								this.getTokenRef(prop),
								referredProps[referredProps.length - 1],
							);
						}

						return prop;
					}),
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
	protected findCases(baseToken: Token): TransformedResult[] {
		return baseToken.findAll((props, token) => {
			return (
				this.hasTokenRef(transformPropsToTokenRef(props)) && !isTokenObj(token)
			);
		});
	}
}

export default UseCase4;
