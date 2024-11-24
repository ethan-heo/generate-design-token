import { TokenObj } from "@types";
import { Validate } from "@utils";

const isTokenObj = (token: object): token is TokenObj => {
	return Validate.format.shouldHaveRequiredProp(token);
};

export default isTokenObj;
