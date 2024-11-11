import { TokenObjs } from "./token-objs.types";

type CommonTokenGroupProps = {
	$type?: string;
	$description?: string;
	$extensions?: Record<string, any>;
};

/**
 * @see https://tr.designtokens.org/format/#groups
 */
export type TokenGroup = {
	[key: string]: TokenGroup | TokenObjs;
} & CommonTokenGroupProps;
