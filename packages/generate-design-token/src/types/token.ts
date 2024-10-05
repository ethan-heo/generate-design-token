export interface TokenObj {
	$type: "composition" | string;
	$value: string;
}

export interface Token {
	[key: string]: Token | TokenObj;
}

export type TokenIterator = [string, TokenObj][];
