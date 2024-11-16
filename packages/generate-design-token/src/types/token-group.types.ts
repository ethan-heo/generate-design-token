/**
 * @see https://tr.designtokens.org/format/#groups
 */
export type TokenGroup = {
	[key: string | `$${string}`]: any | TokenGroup;
};
