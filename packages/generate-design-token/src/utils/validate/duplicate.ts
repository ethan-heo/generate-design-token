import Token from "../../modules/token";
import { TokenGroup } from "../../types/token.types";
import { toTokenRef } from "../token-ref";

/**
 * 주어진 토큰 경로가 토큰 내부에 중복으로 존재하는지 확인합니다.
 *
 * @param {Token | TokenGroup} token
 * @param {string} tokenRef
 * @returns {boolean}
 */
const duplicateToken = (token: Token | TokenGroup, tokenRef: string) => {
	let _token = token;

	if (!(token instanceof Token)) {
		_token = new Token(token);
	}

	return !!_token.find((props) => toTokenRef(props) === tokenRef);
};

export default duplicateToken;
