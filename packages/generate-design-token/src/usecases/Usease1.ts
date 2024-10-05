import TokenProcessor from "../TokenProcessor";
import { TokenIterator, TokenObj } from "../types/token";
import { Usecase } from "../types/usecase";

/**
 * @description 이미 정의된 토큰 객체값을 새로 정의하는 토큰 객체에서 사용하는 경우
 */
class Usecase1 implements Usecase {
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
		let foundTokenObj: TokenObj | null = null;

		for (const tokenProcessor of this.baseTokens) {
			foundTokenObj = tokenProcessor.findTokenObj(baseTokenRef);

			if (foundTokenObj) {
				break;
			}
		}

		if (!foundTokenObj) return false;

		/**
		 * 3. 토큰 객체에 {$value} 가 정확히 정의되어 있는지 확인한다.
		 */
		const tokenValue = token.$value;
		const valueMatcher = tokenValue.match(/\{\$value\}/);

		if (!valueMatcher) return false;

		return true;
	}
	transform(tokenIteratorItem: TokenIterator[number]): TokenIterator[number] {}
}

export default Usecase1;
