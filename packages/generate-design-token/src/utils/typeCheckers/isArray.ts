import getType from "./getType";

const isArray = (value: unknown): value is [] => {
	return getType(value) === "array";
};

export default isArray;
