import Token from "../token";
import UseCase from "./use-case.abstract";
import UseCase1 from "./use-case1";
import UseCase2 from "./use-case2";
import UseCase3 from "./use-case3";
import UseCase4 from "./use-case4";

class UseCases {
	#useCases: UseCase<any, any>[];
	constructor() {
		this.#useCases = [UseCase1, UseCase2, UseCase3, UseCase4].map(
			(UseCase) => new UseCase(),
		);
	}

	/**
	 * 생성자에 등록된 사용 사례에 따라 기본 토큰과 토큰이 변환됩니다.
	 * @param baseToken 변환할 기본 토큰입니다.
	 * @param tokens 기본 토큰에서 참조할 수 있는 토큰입니다.
	 * @returns 변환된 토큰을 반환합니다.
	 **/
	transform(baseToken: Token, tokens: Token[]) {
		return this.#useCases.reduce(
			(base, useCase) => useCase.transform(base, tokens),
			baseToken.clone(),
		);
	}
}

export default UseCases;