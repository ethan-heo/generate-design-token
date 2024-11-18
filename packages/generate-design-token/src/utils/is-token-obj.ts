import * as Types from "@types";
import { TokenValidators } from "@utils";

const isTokenObj = (
	token: Types.TokenGroup | Types.TokenObjs,
): token is Types.TokenObjs => {
	return TokenValidators.shouldHaveRequiredProp(token);
};

export default isTokenObj;
