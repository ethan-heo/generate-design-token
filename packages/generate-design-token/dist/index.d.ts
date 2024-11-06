type TokenObjValue = string | Record<string, string>;
interface TokenObj {
    [key: `$${string}`]: TokenObjValue;
}
interface TokenStructureObj {
    [key: string]: TokenStructureObj | TokenObj;
}
type Token = TokenObj | TokenStructureObj;

declare const generateDesignToken: (base: Token, raws: Token[]) => Token;

export { generateDesignToken as default };
