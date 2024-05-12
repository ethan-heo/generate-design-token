const matchTokenRefs = (tokenRef: string) => {
	const result: string[] = [];
	let matchedResult;
	let input = tokenRef;
	const sliceTokenRef = (matchedResult: RegExpMatchArray, tokenRef: string) =>
		tokenRef.slice(matchedResult[0].length);

	while (true) {
		matchedResult = input.match(/\{([^{}]+)\}/);

		if (matchedResult === null) {
			break;
		}

		result.push(matchedResult[1]);
		input = sliceTokenRef(matchedResult, input);
	}

	return result;
};

export default matchTokenRefs;
