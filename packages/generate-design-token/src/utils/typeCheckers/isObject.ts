import getType from "./getType";

const isObject = (value: unknown): value is object => {
	return getType(value) === "object";
};

export default isObject;
