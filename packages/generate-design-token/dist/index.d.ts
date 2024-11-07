type TokenObjValue = string | Record<string, string>;
interface TokenObj {
    [key: `$${string}`]: TokenObjValue;
}
interface TokenStructureObj {
    [key: string]: TokenStructureObj | TokenObj;
}
type Token$1 = TokenObj | TokenStructureObj;
type TokenRef = string;
type TokenResult = [string[], Token$1];

type types_TokenObj = TokenObj;
type types_TokenRef = TokenRef;
type types_TokenResult = TokenResult;
type types_TokenStructureObj = TokenStructureObj;
declare namespace types {
  export type { Token$1 as Token, types_TokenObj as TokenObj, types_TokenRef as TokenRef, types_TokenResult as TokenResult, types_TokenStructureObj as TokenStructureObj };
}

type Iteratee = (props: string[], token: Token$1, self: Token) => boolean;
/**
 * token 필드를 업데이트하는 메서드와 복제하여 사용하는 메서드를 사용하고 있어 예상치 못한 이슈가 발생할 케이스가 있음.
 * 개선이 필요한 상황.
 * - 복사가 필요한 메서드에서는 부분적으로 deepClone을 통해 해결하고 있음.
 * - 예) map 메서드에서 props가 참조값이 유지되어 반환값이 동일하게 처리되는 경우
 */
declare class Token {
    #private;
    constructor(token: Token$1);
    /**
     *
     * @description 주어진 참조값에 해당하는 토큰 객체 및 구조 객체를 반환한다.
     * @returns
     */
    find(callback: Iteratee): TokenResult | undefined;
    /**
     * @description 주어진 참조값에 해당하는 모든 토큰 객체 및 구조 객체를 반환한다.
     * @returns
     */
    findAll(callback: Iteratee): TokenResult[];
    /**
     * @description 주어진 참조값에 해당하는 토큰을 삭제한다.
     * @param props 참조값
     * @throws {Error} parent token이 존재하지 않을 때
     */
    delete(props: string[]): void;
    /**
     * @description 주어진 참조값에 토큰을 추가한다.
     * @param props 토큰을 추가할 참조값
     * @param token 추가할 토큰
     */
    add(props: string[], token: Token$1): void;
    /**
     * @description 토큰의 복사본을 반환한다.
     * @returns 복사된 토큰
     */
    clone(): Token;
    /**
     * @description 토큰을 순회하여 주어진 콜백을 적용하고, 그 결과를 반환한다.
     * @param callback 토큰을 순회하는 콜백. 첫 번째 인자로 토큰의 경로를, 두 번째 인자로 토큰을 받는다.
     * @returns 주어진 콜백을 적용한 결과를 반환한다.
     */
    map(callback: (props: string[], token: Token$1) => TokenResult): TokenResult[];
    getToken(): Token$1;
}

declare const generateDesignToken: (base: Token$1, raws: Token$1[]) => Token$1;

export { types as GDTTypes, Token, generateDesignToken as default };
