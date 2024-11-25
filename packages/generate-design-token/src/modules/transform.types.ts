import { TokenGroup, TokenObj } from "../types/token.types";
import Token from "./token";

export interface Transformer<
	UC extends [string[], TokenGroup | TokenObj],
	Ref extends [string[], TokenGroup | TokenObj],
> {
	findUseCases: (base: Token, refTokens: Token[]) => UC[];
	transform: (useCase: UC, referred: Ref) => [string[], TokenObj][];
}
