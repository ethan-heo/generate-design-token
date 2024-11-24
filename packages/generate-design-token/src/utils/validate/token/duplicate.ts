import { Transformers } from "@utils";
import Token from "../../../token";
import { TokenGroup } from "@types";

/**
 * 주어진 토큰 경로가 토큰 내부에 중복으로 존재하는지 확인합니다.
 *
 * @param {Token | TokenGroup} token
 * @param {string} tokenRef
 * @returns {boolean}
 */
const duplicate = (token: Token | TokenGroup, tokenRef: string) => {
	let _token = token;

	if (!(token instanceof Token)) {
		_token = new Token(token);
	}

	return !!_token.find((props) => Transformers.toTokenRef(props) === tokenRef);
};

export default duplicate;
