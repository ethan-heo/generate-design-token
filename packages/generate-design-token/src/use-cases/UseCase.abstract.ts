import Token, { TokenResult } from "../Token";
import { TOKEN_REF_REGEXP } from "@constants";
import { isTokenObj, transformPropsToTokenRef } from "@utils";

abstract class UseCase<UC extends TokenResult, Ref extends TokenResult> {
	/**
	 * 참조 토큰에서 기본 토큰과 동일한 이름을 가진 토큰으로 대체합니다.
	 *
	 * @param baseToken 변환할 토큰
	 * @param referredTokens 기본 토큰에서 참조하는 토큰
	 */
	transform(baseToken: Token, referredTokens: Token[]) {
		const useCases = this.findUseCases(baseToken.clone(), referredTokens);

		if (useCases.length === 0) return baseToken;

		const transformedTokens: {
			useCase: UC;
			transformed: TokenResult[];
		}[] = [];

		for (const useCase of useCases) {
			const foundReferredToken = this.findReferredToken(
				transformPropsToTokenRef(useCase[0]),
				referredTokens,
			);

			if (!foundReferredToken) {
				throw new Error(`정의되지 않은 토큰입니다: ${useCase[0]}`);
			}

			transformedTokens.push({
				useCase,
				transformed: this.transformToken(useCase, foundReferredToken),
			});
		}

		for (const { useCase, transformed } of transformedTokens) {
			const [useCaseProps] = useCase;

			baseToken.delete(useCaseProps);

			for (const [transformedProps, transformedToken] of transformed as Ref[]) {
				baseToken.add(transformedProps, transformedToken);
			}
		}

		return baseToken;
	}

	protected abstract transformToken(useCase: UC, referred: Ref): TokenResult[];

	protected abstract findUseCases(
		baseToken: Token,
		referredTokens: Token[],
	): UC[];

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
	 * @param prop - 참조를 추출할 토큰 이름
	 * @param tokens - 검색할 토큰 목록
	 * @returns 참조된 토큰을 찾으면 T 타입의 토큰을 반환하고, 그렇지 않으면 undefined를 반환합니다.
	 */
	protected findReferredToken(prop: string, tokens: Token[]): Ref | undefined {
		const tokenRef = this.getTokenRef(prop).slice(1, -1);
		let result: Ref | undefined;

		for (const token of tokens) {
			const foundToken = token.find(
				(props) => transformPropsToTokenRef(props) === tokenRef,
			) as Ref;

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
	 * @param prop 참조를 추출할 토큰 이름
	 * @returns 추출된 토큰 참조를 문자열로 반환합니다. ex) {color.primary}
	 */
	protected getTokenRef(prop: string) {
		return prop.match(TOKEN_REF_REGEXP)![0];
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
	protected updateTokenObjValue(value: any, props: string[]) {
		if (typeof value === "string") {
			return value.replace(`{$value}`, `{${transformPropsToTokenRef(props)}}`);
		}

		if (Array.isArray(value)) {
			const result: unknown[] = [];

			for (const v of value) {
				result.push(this.updateTokenObjValue(v, props));
			}

			return result;
		}

		if (value && typeof value === "object") {
			const result = {};

			for (const prop in value) {
				result[prop] = this.updateTokenObjValue(value[prop] as any, props);
			}

			return result;
		}

		return value;
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
