import TokenProcessor from "../TokenProcessor";
import { Token, TokenIterator } from "../types/token";
import { Usecase } from "../types/usecase";

/**
 * @description 이미 정의된 토큰 구조 객체 내 구조를 새로 정의하는 토큰 객체에서 그대로 사용하는 경우
 */
class Usecase2 implements Usecase {
	baseTokens: TokenProcessor[];

	constructor(baseTokens: TokenProcessor[]) {
		this.baseTokens = baseTokens;
	}
	validate(tokenIteratorItem: TokenIterator[number]): boolean {
		const [tokenRef, token] = tokenIteratorItem;
		/**
		 * 1. 토큰 참조값이 정의되어 있는지 확인한다.
		 */
		const baseTokenRefMatcher = tokenRef.match(/\{([^{}]+)\}/);

		if (!baseTokenRefMatcher) return false;

		/**
		 * 2. 토큰 참조값에 해당되는 토큰 객체가 존재하는지 확인한다.
		 */
		const baseTokenRef = baseTokenRefMatcher[0].slice(1, -1);
		let foundTokenStructureObj: Token | null = null;

		for (const tokenProcessor of this.baseTokens) {
			foundTokenStructureObj =
				tokenProcessor.findTokenStructureObj(baseTokenRef);

			if (foundTokenStructureObj) {
				break;
			}
		}

		if (!foundTokenStructureObj) return false;

		/**
		 * 3. 토큰 객체에 {$value} 가 정확히 정의되어 있는지 확인한다.
		 */
		const tokenValue = token.$value;
		const valueMatcher = tokenValue.match(/\{\$value\}/);

		if (!valueMatcher) return false;

		return true;
	}
	transform(tokenIteratorItem: TokenIterator[number]): TokenIterator {}
}

export default Usecase2;
