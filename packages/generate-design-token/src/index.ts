import { Token } from "./generateToken.types";
import parser from "./parser";
import transformer from "./transformer";

const generateDesignToken = (token: Token, baseTokens: Token[] = [token]) => {
	return parser(transformer(token, baseTokens), baseTokens);
};

export default generateDesignToken;
