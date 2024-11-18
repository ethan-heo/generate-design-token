import * as Types from "@types";
import { Validators } from "@utils";

const isTokenObj = (
	token: Types.TokenGroup | Types.TokenObjs,
): token is Types.TokenObjs => {
	return Validators.format.shouldHaveRequiredProp(token);
};

export default isTokenObj;
