import getType from "./getType";

const isNumber = (value: unknown): value is number => {
	return getType(value) === "number";
};

export default isNumber;
