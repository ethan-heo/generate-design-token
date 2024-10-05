import { TOKEN_REF_SEPERATOR } from "../constants/seperator";
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
	transform(tokenIteratorItem: TokenIterator[number]): TokenIterator {
		const [tokenRef, token] = tokenIteratorItem;
		const matchedBaseTokenRef = tokenRef.match(/\{([^{}]+)\}/)![0];
		const baseTokenRef = matchedBaseTokenRef.slice(1, -1);
		/**
		 * 1. 토큰 참조값을 통해 베이스 토큰에서 토큰 참조 객체를 찾는다.
		 */
		let baseTokenObj: TokenObj;

		for (const tokenProcessor of this.baseTokens) {
			const foundTokenObj = tokenProcessor.findTokenObj(baseTokenRef);

			if (foundTokenObj) {
				baseTokenObj = foundTokenObj;
				break;
			}
		}

		/**
		 * 2. 유즈 케이스 형태의 참조값을 변환한다.
		 */
		const transformedTokenRef = tokenRef.replace(
			matchedBaseTokenRef,
			baseTokenRef.split(TOKEN_REF_SEPERATOR).pop()!,
		);
		/**
		 * 3. 입력된 토큰 객체의 값에 주어진 유즈 케이스 형태의 문자열을 베이스 토큰의 참조값으로 변환한다.
		 */
		const transformedToken = {
			...token,
			$value: token.$value.replace(/\{\$value\}/, `{${baseTokenRef}}`),
		};

		return [[transformedTokenRef, transformedToken]];
	}
}

export default Usecase1;
