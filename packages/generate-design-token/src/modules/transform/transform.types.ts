import Token, { TokenResult } from "../../token";

export interface Transformer<UC extends TokenResult, Ref extends TokenResult> {
	findUseCases: (base: Token, refTokens: Token[]) => UC[];
	transform: (useCase: UC, referred: Ref) => TokenResult[];
}
