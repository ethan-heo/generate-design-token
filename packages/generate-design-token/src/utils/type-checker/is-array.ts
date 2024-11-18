import getType from "./get-type";

const isArray = (value: unknown): value is [] => {
	return getType(value) === "array";
};

export default isArray;
