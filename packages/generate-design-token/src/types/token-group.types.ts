import { AnyTokenObj, TokenObjs } from "./token-objs.types";

export type TokenGroup = {
	[key: string]: TokenGroup | TokenObjs;
};

export type AnyTokenGroup = {
	[key: string]: AnyTokenGroup | AnyTokenObj;
};

export type TokenGroups = TokenGroup | AnyTokenGroup;
