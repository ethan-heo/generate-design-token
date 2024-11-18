import * as Types from "@types";
import { Validators } from "@utils";

const isTokenObj = (
	token: Types.TokenGroup | Types.TokenObj,
): token is Types.TokenObj => {
	return Validators.format.shouldHaveRequiredProp(token);
};

export default isTokenObj;
