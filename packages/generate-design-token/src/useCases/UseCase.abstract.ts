import { TransformedToken } from "./UseCase.types";
import * as Types from "../types";
import Token from "../Token";
import { TOKEN_REF_REGEXP } from "../regexp";
import transformPropsToTokenRef from "../transformPropsToTokenRef";
import isTokenObj from "../isTokenObj";

abstract class UseCase<T extends Types.TokenResult> {
	transform(baseToken: Token, referredTokens: Token[]) {
		const cases = this.findCases(baseToken);

		if (cases.length === 0) return;

		const transformedTokens: {
			original: T;
			transformed: T[];
		}[] = [];
		const findTokenObjs = (tokenResult: Types.TokenResult) => {
			const [resultProps, resultToken] = tokenResult;

			if (isTokenObj(resultToken))
				return [[resultProps, resultToken]] as [string[], Types.TokenObj][];

			return new Token(resultToken)
				.findAll((_, token) => isTokenObj(token))
				.map(([props, token]) => [[...resultProps, ...props], token]) as [
				string[],
				Types.TokenObj,
			][];
		};

		for (const _case of cases) {
			const foundReferredToken = this.findReferredToken(
				transformPropsToTokenRef(_case[0]),
				referredTokens,
			);

			if (!foundReferredToken) {
				throw new Error(`Cannot find referred token: ${_case[0]}`);
			}

			transformedTokens.push({
				original: _case,
				transformed: this.transformToken(
					findTokenObjs(_case),
					findTokenObjs(foundReferredToken),
				),
			});
		}

		for (const { original, transformed } of transformedTokens) {
			const [originalProps] = original;

			baseToken.delete(originalProps);

			for (const [transformedProps, transformedToken] of transformed as T[]) {
				baseToken.add(transformedProps, transformedToken);
			}
		}
	}

	protected abstract transformToken(
		useCase: [string[], Types.TokenObj][],
		referred: [string[], Types.TokenObj][],
	): T[];

	protected abstract findCases(baseToken: Token): T[];

	protected hasTokenRef(value: string) {
		return TOKEN_REF_REGEXP.test(value);
	}

	protected findReferredToken(
		tokenName: string,
		tokens: Token[],
	): T | undefined {
		const tokenRef = this.getTokenRef(tokenName).slice(1, -1);
		let result: T | undefined;

		for (const token of tokens) {
			const foundToken = token.find(
				(props) => transformPropsToTokenRef(props) === tokenRef,
			) as T;

			if (foundToken) {
				result = foundToken;
				break;
			}
		}

		return result;
	}

	protected getTokenRef(tokenName: string) {
		return tokenName.match(TOKEN_REF_REGEXP)![0];
	}

	protected updateTokenObjValue(value: string, props: string[]) {
		return value.replace(`{$value}`, `{${transformPropsToTokenRef(props)}}`);
	}
}

export default UseCase;
