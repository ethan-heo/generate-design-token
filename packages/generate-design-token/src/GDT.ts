import * as Types from "@types";
import * as Modules from "@modules";
import Token from "./token";
import { Transformer } from "@modules/transform/transform.types";

/**
 * GDT (Generate Design Token) 클래스
 *
 * @class GDT
 */
class GDT {
	#base: Token;

	constructor(token: Types.TokenGroup | Token) {
		if (token instanceof Token) {
			this.#base = token;
		} else {
			this.#base = new Token(token);
		}
	}

	/**
	 * 주어진 참조 토큰(refTokens)과 트랜스포머(cases)를 사용하여 현재 토큰을 트랜스폼합니다.
	 *
	 * @param refTokens 트랜스폼에 사용할 참조 토큰의 배열입니다.
	 * @param cases 추가적으로 사용할 트랜스포머의 배열입니다. 기본적으로 useCase1, useCase2, useCase3, useCase4가 사용됩니다.
	 * @returns 트랜스폼된 결과를 포함하는 새로운 GDT 인스턴스를 반환합니다.
	 */
	transform(refTokens: Token[], cases: Transformer<any, any>[] = []) {
		return new GDT(
			Modules.transform(this.#base, refTokens, [
				Modules.useCase1,
				Modules.useCase2,
				Modules.useCase3,
				Modules.useCase4,
				...cases,
			]),
		);
	}

	/**
	 * 주어진 참조 토큰 배열을 사용하여 현재 토큰을 파싱합니다.
	 *
	 * @param refTokens 파싱에 사용할 참조 토큰의 배열입니다.
	 * @returns 파싱된 결과를 포함하는 새로운 GDT 인스턴스를 반환합니다.
	 */
	parse(refTokens: Token[]): GDT {
		return new GDT(Modules.parse(this.#base, refTokens));
	}

	generate() {
		return this;
	}

	/**
	 * 현재 토큰을 JSON 형식으로 변환하여 반환합니다.
	 *
	 * @returns JSON 형식의 토큰 객체를 반환합니다.
	 */
	toJSON() {
		return this.#base.getToken();
	}
}

export default GDT;
