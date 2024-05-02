const isTransformWord = (value: string) => {
	return /\{[^{}]*\}/.test(value);
};

export default isTransformWord;
