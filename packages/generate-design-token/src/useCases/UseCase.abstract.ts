import * as Types from "../types";
import Token from "../Token";
import { TOKEN_REF_REGEXP } from "../regexp";
import transformPropsToTokenRef from "../transformPropsToTokenRef";
import isTokenObj from "../isTokenObj";

abstract class UseCase<T extends Types.TokenResult> {
	/**
	 * 참조 토큰에서 기본 토큰과 동일한 이름을 가진 토큰으로 대체합니다.
	 *
	 * @param baseToken 변환할 토큰
	 * @param referredTokens 기본 토큰에서 참조하는 토큰
	 */
	transform(baseToken: Token, referredTokens: Token[]) {
		const cases = this.findCases(baseToken, referredTokens);

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

	protected abstract findCases(baseToken: Token, referredTokens: Token[]): T[];

	/**
	 * 주어진 문자열에 토큰 참조가 포함되어 있는지 확인합니다.
	 *
	 * @param value - 확인할 문자열
	 * @returns 토큰 참조가 포함되어 있으면 true를 반환하고, 그렇지 않으면 false를 반환합니다.
	 */
	protected hasTokenRef(value: string) {
		return TOKEN_REF_REGEXP.test(value);
	}

	/**
	 * 주어진 토큰 이름에서 토큰 참조를 추출하고 제공된 토큰 목록에서 검색하여 참조된 토큰을 찾습니다.
	 *
	 * @param tokenName - 참조를 추출할 토큰 이름
	 * @param tokens - 검색할 토큰 목록
	 * @returns 참조된 토큰을 찾으면 T 타입의 토큰을 반환하고, 그렇지 않으면 undefined를 반환합니다.
	 */
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

	/**
	 * 정규식을 사용하여 주어진 토큰 이름에서 토큰 참조를 추출하고 반환합니다.
	 *
	 * @param tokenName 참조를 추출할 토큰 이름
	 * @returns 추출된 토큰 참조를 문자열로 반환합니다.
	 */
	protected getTokenRef(tokenName: string) {
		return tokenName.match(TOKEN_REF_REGEXP)![0];
	}

	/**
	 * 토큰 객체 값을 업데이트합니다.
	 *
	 * 주어진 문자열에서 {$value} 플레이스홀더를 props 배열을 기반으로 생성된 토큰 객체 참조로 대체합니다.
	 *
	 * @param value 업데이트할 토큰 객체 값
	 * @param props 토큰 객체 참조를 생성하기 위한 속성 배열
	 * @returns 업데이트된 토큰 객체 값
	 */
	protected updateTokenObjValue(value: string, props: string[]) {
		return value.replace(`{$value}`, `{${transformPropsToTokenRef(props)}}`);
	}

	protected isTokenObjByTokens(prop: string, tokens: Token[]) {
		const tokenRef = this.getTokenRef(prop);
		const referredToken = this.findReferredToken(tokenRef, tokens);

		if (referredToken && isTokenObj(referredToken[1])) {
			return true;
		}

		return false;
	}
}

export default UseCase;
