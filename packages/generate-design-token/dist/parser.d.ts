import { Token } from "./generateToken.types";
declare const parser: (token: Token, baseTokens: Token[]) => Token;
export default parser;
