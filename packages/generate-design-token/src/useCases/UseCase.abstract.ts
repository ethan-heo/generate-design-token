import Token from "../Token";

const TOKEN_REF_REGEXP = /\{([^{}]+)\}/;

abstract class UseCase<T = any> {
	transform(baseToken: Token, referredToken: Token[]) {
		const cases = this.findCases(baseToken);

		if (cases.length === 0) return;

		const transformedTokens: {
			original: T[];
			transformed: T[];
		}[] = this.transformTokens(cases, referredToken);

		console.log(JSON.stringify(transformedTokens, null, 2));

		// replace base token to transformed tokens
	}

	protected abstract transformTokens(
		cases: T[],
		referredTokens: Token[],
	): {
		original: T[];
		transformed: T[];
	}[];

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
			const foundTokenRef = token.find(tokenRef) as T;

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
