type TokenObjValue = string | Record<string, string>;
interface TokenObj {
    [key: `$${string}`]: TokenObjValue;
}
interface TokenStructureObj {
    [key: string]: TokenStructureObj | TokenObj;
}
type Token = TokenObj | TokenStructureObj;
type TokenRef = string;
type TokenResult = [string[], Token];

declare const generateDesignToken: (base: Token, raws: Token[]) => Token;

export { type Token, type TokenObj, type TokenRef, type TokenResult, type TokenStructureObj, generateDesignToken as default };
