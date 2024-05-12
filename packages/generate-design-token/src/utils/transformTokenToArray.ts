import { Token } from "../generateToken.types";

const transformTokenToArray = (token: Token) => {
	return Object.entries(token);
};

export default transformTokenToArray;
