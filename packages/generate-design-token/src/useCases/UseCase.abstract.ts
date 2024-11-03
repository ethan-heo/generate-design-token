import { TransformedToken } from "./UseCase.types";
import * as Types from "../types";
import Token from "../Token";
import { TOKEN_REF_REGEXP } from "../regexp";
import transformPropsToTokenRef from "../transformPropsToTokenRef";

abstract class UseCase<T extends Types.TokenResult> {
	transform(baseToken: Token, referredToken: Token[]) {
		const cases = this.findCases(baseToken);

		if (cases.length === 0) return;

		const transformedTokens: {
			original: T;
			transformed: T;
		}[] = this.transformTokens(cases, referredToken);

		transformedTokens.forEach(({ original, transformed }) => {
			const [originalProps] = original;
			const [transformedProps, transformedToken] = transformed;

			baseToken.add(transformedProps, transformedToken);
			baseToken.delete(originalProps);
		});
	}

	protected abstract transformTokens(
		cases: T[],
		referredTokens: Token[],
	): TransformedToken<T>[];

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
}

export default UseCase;
