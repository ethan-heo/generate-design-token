import * as Types from "@types";
import { Validate } from "@utils";

const isTokenObj = (
	token: Types.TokenGroup | Types.TokenObj,
): token is Types.TokenObj => {
	return Validate.format.shouldHaveRequiredProp(token);
};

export default isTokenObj;
