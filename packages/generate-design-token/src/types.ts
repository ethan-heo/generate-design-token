type TokenObjValue = string | Record<string, string>;

export interface TokenObj {
	[key: `$${string}`]: TokenObjValue;
}

export interface TokenStructureObj {
	[key: string]: TokenStructureObj | TokenObj;
}

export type Token = TokenObj | TokenStructureObj;

export type TokenRef = `{${string}}`;
