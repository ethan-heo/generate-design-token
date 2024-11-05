import UseCase from "./UseCase.abstract";
import * as Types from "../types";
import Token from "../Token";
import transformPropsToTokenRef from "../transformPropsToTokenRef";
import isTokenObj from "../isTokenObj";
import { TransformedToken } from "./UseCase.types";

type TransformedResult = [string[], Types.Token];

class UseCase2 extends UseCase<TransformedResult> {
	protected transformToken(
		useCase: [string[], Types.TokenObj][],
		referred: [string[], Types.TokenObj][],
	): TransformedResult[] {
		const result: TransformedResult[] = [];
		const getPropCountByTokenRef = (prop: string) => {
			return this.getTokenRef(prop).replace(/[^.]/g, "").length + 1;
		};

		for (const [useCaseProps, useCaseToken] of useCase) {
			for (const [referredProps] of referred) {
				const firstProps = useCaseProps.slice(
					0,
					useCaseProps.findIndex(this.hasTokenRef),
				);
				const lastProps = referredProps.slice(
					getPropCountByTokenRef(useCaseProps[useCaseProps.length - 1]),
				);

				result.push([
					[...firstProps, ...lastProps],
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
			const tokenRef = props.find(this.hasTokenRef);

			if (!tokenRef) return false;

			// 속성명에 토큰 참조값만 포함되어 있고 속성값이 토큰 객체일 때
			return this.getTokenRef(tokenRef) === tokenRef && isTokenObj(token);
		});
	}
}

export default UseCase2;
