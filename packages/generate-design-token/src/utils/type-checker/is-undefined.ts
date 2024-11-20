import getType from "./get-type";

const isUndefined = (value: unknown): value is undefined => {
	return getType(value) === "undefined";
};

export default isUndefined;
