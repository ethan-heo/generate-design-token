import { Token } from "@modules";
import { TokenGroup, TokenObj } from "@types";

export interface Transformer<
	UC extends [string[], TokenGroup],
	Ref extends [string[], TokenGroup],
> {
	findUseCases: (base: Token, refTokens: Token[]) => UC[];
	transform: (useCase: UC, referred: Ref) => [string[], TokenObj][];
}
