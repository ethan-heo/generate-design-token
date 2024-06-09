import { Token, TokenObj } from "../generateToken.types";
export type UseCase = "Case1" | "Case2" | "Case3" | "Case4";
export type NormalizedTransformerData = {
    case: UseCase;
    value: Token | TokenObj;
    token: Token | TokenObj;
};
export declare const USE_CASES: Record<Uppercase<UseCase>, UseCase>;
