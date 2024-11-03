import UseCase from "./UseCase.abstract";
import * as Types from "../types";
import Token from "../Token";
import transformPropsToTokenRef from "../transformPropsToTokenRef";
import isTokenObj from "../isTokenObj";
import { TransformedToken } from "./UseCase.types";

type TransformedResult = [string[], Types.Token];

class UseCase2 extends UseCase<TransformedResult> {
	protected findCases(baseToken: Token): TransformedResult[] {
		return baseToken.findAll((props, token) => {
			return (
				this.hasTokenRef(transformPropsToTokenRef(props)) && isTokenObj(token)
			);
		});
	}

	protected transformTokens(
		cases: TransformedResult[],
		referredTokens: Token[],
	): TransformedToken<TransformedResult>[] {
		const transformedTokens: TransformedToken<TransformedResult>[] = [];
		const combineProps = (referredProps: string[], tokenObjProps: string[]) => {
			return transformPropsToTokenRef([
				...(referredProps.length > 1
					? referredProps.slice(0, -1)
					: [referredProps[0]]),
				...tokenObjProps,
			]);
		};

		for (const _case of cases) {
			const foundReferredToken = this.findReferredToken(
				transformPropsToTokenRef(_case[0]),
				referredTokens,
			);

			if (!foundReferredToken) {
				throw new Error(`Cannot find referred token: ${_case[0]}`);
			}

			if (isTokenObj(foundReferredToken[1])) {
				throw new Error(`Not token structure object: ${foundReferredToken[0]}`);
			}

			const transformedToken = new Token({});
			const [caseProps, caseToken] = _case;
			const [referredProps, referredToken] = foundReferredToken;
			const tokenObjsInReferredToken = new Token(referredToken).findAll(
				(_, token) => isTokenObj(token),
			);
			const { $value, $type, ...anything } = caseToken as Types.TokenObj;

			for (const [props] of tokenObjsInReferredToken) {
				transformedToken.add(props, {
					...anything,
					$type,
					$value: ($value as string).replace(
						`{$value}`,
						`{${combineProps(referredProps, props)}}`,
					),
				});
			}

			transformedTokens.push({
				original: _case,
				transformed: [caseProps.slice(0, -1), transformedToken.getToken()],
			});
		}

		return transformedTokens;
	}
}

export default UseCase2;
