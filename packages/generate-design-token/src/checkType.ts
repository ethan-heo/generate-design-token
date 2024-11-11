type Result =
	| "string"
	| "number"
	| "bigint"
	| "boolean"
	| "undefined"
	| "symbol"
	| "null"
	| "object"
	| "array"
	| "function";

const checkType = (value: any) => {
	return Object.prototype.toString
		.call(value)
		.slice(8, -1)
		.toLowerCase() as Result;
};

export default checkType;
