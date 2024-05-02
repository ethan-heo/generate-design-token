import { Token } from "../generateToken.token";

const transformTokenToArray = (token: Token) => {
	return Object.entries(token);
};

export default transformTokenToArray;
