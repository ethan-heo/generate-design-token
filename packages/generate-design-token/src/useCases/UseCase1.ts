import UseCase from "./UseCase.abstract";
import * as Types from "../types";
import isTokenObj from "../isTokenObj";
import Token from "../Token";
import { TransformedToken } from "./UseCase.types";
import transformPropsToTokenRef from '../transformPropsToTokenRef'

type TransformedResult = [string[], Types.TokenObj]

class UseCase1 extends UseCase<TransformedResult> {
	protected findCases(baseToken: Token) {
		return baseToken.findAll((props, token, self) => {
			const tokenRef = transformPropsToTokenRef(props)
			return this.hasTokenRef(tokenRef) && isTokenObj(token);
		}) as TransformedResult[];
	}
	protected transformTokens(cases: TransformedResult[], referredTokens: Token[]) {
		const transformedTokens: TransformedToken<TransformedResult>[]  = [];

		for (const _case of cases) {
			const foundReferredToken = this.findReferredToken(
				transformPropsToTokenRef(_case[0]),
				referredTokens,
			);

			if (!foundReferredToken) {
				throw new Error(`Cannot find referred token: ${_case[0]}`);
			}

			if (!isTokenObj(foundReferredToken[1])) {
				throw new Error(`Not token object: ${foundReferredToken[0]}`);
			}

			const [referredProps, referredToken] = foundReferredToken
			const [caseProps, caseToken] = _case
			const replacingProp = referredProps.pop()!
			
			const transformedProps = caseProps.map(caseProp => caseProp.replace(
				this.getTokenRef(caseProp),
				replacingProp,
			));
			const transformedToken = {
				...caseToken,
				$value: (caseToken.$value as string).replace(
					`{$value}`,
					referredToken.$value as string,
				),
			};

			transformedTokens.push({
				original: _case,
				transformed: [transformedProps, transformedToken],
			});
		}

		return transformedTokens;
	}
}

export default UseCase1;
