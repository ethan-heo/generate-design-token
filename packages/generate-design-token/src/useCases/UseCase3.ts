import UseCase from "./UseCase.abstract";
import * as Types from "../types";
import Token from "../Token";
import { TransformedToken } from "./UseCase.types";
import transformPropsToTokenRef from "../transformPropsToTokenRef";
import isTokenObj from "../isTokenObj";

type TransformedResult = [string[], Types.Token];

class UseCase3 extends UseCase<TransformedResult> {
	protected findCases(baseToken: Token): TransformedResult[] {
		return baseToken.findAll((props, token) => {
			return (
				this.hasTokenRef(transformPropsToTokenRef(props)) && !isTokenObj(token)
			);
		});
	}
	protected transformTokens(
		cases: TransformedResult[],
		referredTokens: Token[],
	): TransformedToken<TransformedResult>[] {
		const transformedTokens: TransformedToken<TransformedResult>[] = [];

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

			const transformedToken = new Token({});
			const [caseProps, caseToken] = _case;
			const [referredProps] = foundReferredToken;
			const firstProp = referredProps[referredProps.length - 1];
			const tokenObjsInCaseToken = new Token(caseToken).findAll((_, token) =>
				isTokenObj(token),
			) as [string[], Types.TokenObj][];

			for (const [props, token] of tokenObjsInCaseToken) {
				transformedToken.add([firstProp, ...props], {
					...token,
					$value: (token.$value as string).replace(
						`{$value}`,
						`{${transformPropsToTokenRef(referredProps)}}`,
					),
				});
			}

			const foundHasTokenRefIndex = caseProps.findIndex((prop) =>
				this.hasTokenRef(prop),
			);
			const transformedProps = caseProps.slice(0, foundHasTokenRefIndex);
			const originalProps = caseProps.slice(0, foundHasTokenRefIndex + 1);

			if (transformedProps.length > 0) {
				transformedTokens.push({
					original: [originalProps, caseToken],
					transformed: [transformedProps, transformedToken.getToken()],
				});
			} else {
				const token = transformedToken.getToken();

				for (const prop in token) {
					transformedTokens.push({
						original: [originalProps, caseToken],
						transformed: [[prop], token[prop]],
					});
				}
			}
		}

		return transformedTokens;
	}
}

export default UseCase3;
