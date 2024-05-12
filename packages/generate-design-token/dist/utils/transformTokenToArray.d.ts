import { Token } from "../generateToken.types";
declare const transformTokenToArray: (token: Token) => [string, import("../generateToken.types").TokenObj | Token][];
export default transformTokenToArray;
