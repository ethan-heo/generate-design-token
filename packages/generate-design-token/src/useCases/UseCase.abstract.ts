import { TransformedToken } from "./UseCase.types";
import * as Types from '../types'
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

		console.log(JSON.stringify(transformedTokens, null, 2))

		transformedTokens.forEach(({ original, transformed }) => {
			const [originalTokenName] = original
			const [transformedTokenName, transformedToken] = transformed

			console.log(transformedTokenName, transformedToken)
			baseToken.add(transformedTokenName, transformedToken);
			baseToken.delete(originalTokenName);
		})
		// replace base token to transformed tokens
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
			const foundTokenRef = token.find((props, _, self) => transformPropsToTokenRef(props) === tokenRef) as T;

			if (foundTokenRef) {
				result = foundTokenRef;
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
