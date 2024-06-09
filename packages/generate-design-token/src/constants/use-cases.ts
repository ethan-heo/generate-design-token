import { Token, TokenObj } from "../generateToken.types";

export type UseCase = "Case1" | "Case2" | "Case3" | "Case4";

export type NormalizedTransformerData = {
	case: UseCase;
	value: Token | TokenObj;
	token: Token | TokenObj;
};

export const USE_CASES: Record<Uppercase<UseCase>, UseCase> = {
	CASE1: "Case1",
	CASE2: "Case2",
	CASE3: "Case3",
	CASE4: "Case4",
};
