import { Token } from "./generateToken.token";
import iterateToken from "./utils/iterateToken";

const mapper = (token: Token) => {
	return iterateToken({
		data: {},
		foundTokenObjCallback: (tokenNames, token, data) => {
			data[tokenNames.join("-")] = token;
		},
	})(token);
};

export default mapper;
