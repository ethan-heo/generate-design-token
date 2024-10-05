import TokenProcessor from "../TokenProcessor";
import { TokenIterator } from "./token";

export interface Usecase {
	readonly baseTokens: TokenProcessor[];

	/**
	 *
	 * @param tokenIteratorItem
	 * @description 입력된 토큰 이터레이터 아이템이 use case에 유효한지 검사한다
	 * @returns
	 */
	validate(tokenIteratorItem: TokenIterator[number]): boolean;
	/**
	 *
	 * @param tokenIteratorItem
	 * @description 베이스 토큰을 참조하여 입력된 토큰 이터레이터 아이템을 변환한다
	 * @returns
	 */
	transform(tokenIteratorItem: TokenIterator[number]): TokenIterator;
}
