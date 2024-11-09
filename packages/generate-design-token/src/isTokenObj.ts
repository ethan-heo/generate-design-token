import * as Types from "./types";
import { shouldHaveRequiredProp } from "./validation";

const isTokenObj = (
	token: Types.Token | Types.AnyToken | Types.TokenObjs | Types.AnyTokenObj,
): token is Types.TokenObjs | Types.AnyTokenObj => {
	return shouldHaveRequiredProp(token);
};

export default isTokenObj;
