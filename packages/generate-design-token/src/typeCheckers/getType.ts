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

const getType = (value: any) => {
	return Object.prototype.toString
		.call(value)
		.slice(8, -1)
		.toLowerCase() as Result;
};

export default getType;
