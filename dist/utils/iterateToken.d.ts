import { Token, TokenObj } from "../generateToken.types";
type IterateTokenOptions<Data> = {
    data: Data;
    foundTokenObjCallback?: (tokenNames: string[], token: TokenObj, data: IterateTokenOptions<Data>["data"]) => void;
    iterateCallback?: (tokenNames: string[], token: Token | TokenObj, data: IterateTokenOptions<Data>["data"]) => void;
};
declare const iterateToken: <Data>(options: IterateTokenOptions<Data>) => (token: Token) => Data;
export default iterateToken;
