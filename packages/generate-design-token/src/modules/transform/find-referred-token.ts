import { Transformers } from "@utils";
import Token from "../../token";
import { TokenGroup } from "@types";

/**
 * 주어진 토큰 참조 문자열에 해당하는 토큰을 참조 토큰 목록에서 찾아 반환합니다.
 *
 * @param tokenRef - 찾고자 하는 토큰의 참조 문자열
 * @param refTokens - 검색할 참조 토큰 목록
 * @returns 찾은 토큰이 있으면 [string[], Types.TokenGroup] 형식의 결과를 반환하고, 없으면 undefined를 반환합니다.
 */
const findByRefTokens = (tokenRef: string, refTokens: Token[]) => {
	let result: [string[], TokenGroup] | undefined;
	const _tokenRef = Transformers.takeOffBracketFromTokenRef(tokenRef);

	for (const refToken of refTokens) {
		const foundRef = refToken.find(
			(props) => Transformers.toTokenRef(props) === _tokenRef,
		);

		if (foundRef) {
			result = foundRef;
			break;
		}
	}

	return result;
};

export default findByRefTokens;
