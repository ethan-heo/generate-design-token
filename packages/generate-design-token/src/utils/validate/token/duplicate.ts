import * as Types from "@types";
import { Transformers } from "@utils";
import Token from "../../../token";

const duplicate = (token: Token | Types.TokenGroup, tokenRef: string) => {
	let _token = token;

	if (!(token instanceof Token)) {
		_token = new Token(token);
	}

	return !!_token.find((props) => Transformers.toTokenRef(props) === tokenRef);
};

export default duplicate;
