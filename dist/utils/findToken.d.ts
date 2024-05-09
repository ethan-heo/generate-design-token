import { Token, TokenObj } from "../generateToken.types";
declare const findToken: (
	tokenRef: string,
	tokens: Token[],
) => TokenObj | Token | undefined;
export default findToken;
