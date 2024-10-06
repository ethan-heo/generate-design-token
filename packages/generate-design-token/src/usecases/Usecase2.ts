import TokenProcessor from "../TokenProcessor";
import { TokenIterator } from "../types/token";
import { Usecase } from "../types/usecase";

/**
 * @description 이미 정의된 토큰 구조 객체 내 구조를 새로 정의하는 토큰 객체에서 그대로 사용하는 경우
 */
class Usecase2 implements Usecase {
	baseTokens: TokenProcessor[];
	validate(tokenIteratorItem: TokenIterator[number]): boolean {}
	transform(tokenIteratorItem: TokenIterator[number]): TokenIterator {}
}

export default Usecase2;
