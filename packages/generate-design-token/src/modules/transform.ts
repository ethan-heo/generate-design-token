import { TokenObj } from "../types/token.types";
import {
	findTokenRef,
	takeOffBracketFromTokenRef,
	toTokenRef,
} from "../utils/token-ref";
import Token from "./token";
import { Transformer } from "./transform.types";

/**
 * 주어진 토큰 이름에서 토큰 참조를 추출하고, 제공된 토큰 목록에서 검색하여 참조된 토큰을 찾습니다.
 *
 * @param tokenRef - 참조를 추출할 토큰 이름
 * @param tokens - 검색할 토큰 목록
 * @returns 참조된 토큰을 찾으면 T 타입의 토큰을 반환하고, 그렇지 않으면 undefined를 반환합니다.
 */
const findReferredToken = (tokenRef: string, tokens: Token[]) => {
	const _tokenRef = takeOffBracketFromTokenRef(findTokenRef(tokenRef)![0]);
	let result: [string[], TokenObj] | undefined;

	for (const token of tokens) {
		const foundToken = token.find(
			(props) => toTokenRef(props) === _tokenRef,
		) as [string[], TokenObj];

		if (foundToken) {
			result = foundToken;
			break;
		}
	}

	return result;
};

/**
 * 주어진 토큰(base)에 대한 참조 토큰(refTokens)을 찾아 대체합니다.
 *
 * @param base - 대체할 토큰
 * @param refTokens - 참조 토큰을 찾을 토큰 목록
 * @returns 대체된 토큰
 */
const transform = <T extends Transformer<any, any>>(
	base: Token,
	refTokens: Token[],
	transformers: T[] = [],
) => {
	return transformers.reduce((base, transformer) => {
		const useCases = transformer.findUseCases(base, refTokens);

		if (useCases.length === 0) return base;

		const transformedTokens: {
			useCase: [string[], TokenObj];
			transformed: [string[], TokenObj][];
		}[] = [];

		for (const useCase of useCases) {
			const foundReferredToken = findReferredToken(toTokenRef(useCase[0]), [
				base,
				...refTokens,
			]);

			if (!foundReferredToken) {
				throw new Error(`정의되지 않은 토큰입니다: ${useCase[0]}`);
			}

			transformedTokens.push({
				useCase,
				transformed: transformer.transform(useCase, foundReferredToken),
			});
		}

		for (const { useCase, transformed } of transformedTokens) {
			const [useCaseProps] = useCase;

			base.delete(useCaseProps);

			for (const [transformedProps, transformedToken] of transformed as [
				string[],
				TokenObj,
			][]) {
				base.add(transformedProps, transformedToken);
			}
		}

		return base;
	}, base.clone());
};

export default transform;
