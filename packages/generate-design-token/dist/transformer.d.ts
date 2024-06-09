import { NormalizedTransformerData } from "./constants/use-cases";
import { SequenceFunction, Token } from "./generateToken.types";
/**
 * TODO
 * - 리팩토링 필요
 */
declare const transformer: SequenceFunction;
export default transformer;
export declare function transformCase1(originalToken: Token, objPath: string, data: NormalizedTransformerData): void;
export declare function transformCase2(originalToken: Token, objPath: string, data: NormalizedTransformerData): void;
export declare function transformCase3(originalToken: Token, objPath: string, data: NormalizedTransformerData): void;
export declare function transformCase4(originalToken: Token, objPath: string, data: NormalizedTransformerData): void;
