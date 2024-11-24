const takeOffBracketFromTokenRef = (tokenRef: string): string => {
	return tokenRef.replace(/[\{\}]/g, "");
};

export default takeOffBracketFromTokenRef;
