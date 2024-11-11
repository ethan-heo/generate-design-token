import * as Types from "./types";
import { shouldHaveRequiredProp } from "./validation";

const isTokenObj = (
	token: Types.TokenGroup | Types.TokenObjs,
): token is Types.TokenObjs => {
	return shouldHaveRequiredProp(token);
};

export default isTokenObj;
