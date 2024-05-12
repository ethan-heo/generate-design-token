import { Token, TokenObj } from "../generateToken.types";
declare const isTokenObj: (token: Token | TokenObj) => token is TokenObj;
export default isTokenObj;
