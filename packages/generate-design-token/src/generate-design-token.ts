import Token from "./modules/token";
import { TokenGroup } from "./types/token.types";
import transform from "./modules/transform";
import {
	useCase1,
	useCase2,
	useCase3,
	useCase4,
} from "./modules/transform-use-cases";
import parse from "./modules/parse";
import { validate } from "./modules/validate";

/**
 * @description
 * 주어진 기본 토큰과 참조 토큰을 통해 구조 변환 -> 파싱 과정을 거쳐 토큰를 반환한다.
 *
 * @param {TokenGroup} base - 기본 토큰
 * @param {TokenGroup[]} refTokens - 참조 토큰
 * @returns {TokenGroup} - 처리된 토큰
 */
const generateDesignToken = (base: TokenGroup, refTokens: TokenGroup[]) => {
	[base, ...refTokens].forEach((token) => validate(token));

	const _refTokens = refTokens.map((token) => new Token(token));
	const result = parse(
		transform(new Token(base), _refTokens, [
			useCase1,
			useCase2,
			useCase3,
			useCase4,
		]),
		_refTokens,
	);

	validate(result);

	return result.getToken();
};

export default generateDesignToken;
