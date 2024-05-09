import { Token, TokenObj } from "../generateToken.types";
declare const assignToken: (
	tokenNames: string[],
	data: Token,
	tokenObj: Token | TokenObj,
) => void;
export default assignToken;
