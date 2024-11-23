import getType from "./get-type";

const isObject = (value: unknown): value is object => {
	return getType(value) === "object";
};

export default isObject;
