import getType from "./getType";

const isString = (value: unknown): value is string => {
	return getType(value) === "string";
};

export default isString;
