import * as Types from "@types";
import { Validate } from "@utils";

const isTokenObj = (token: object): token is Types.TokenObj => {
	return Validate.format.shouldHaveRequiredProp(token);
};

export default isTokenObj;
