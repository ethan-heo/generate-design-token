import getType from "./get-type";

const isString = (value: unknown): value is string => {
	return getType(value) === "string";
};

export default isString;
