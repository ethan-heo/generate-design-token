import * as Types from "./types";
import { shouldHaveRequiredProp } from "./validation";

const isTokenObj = (token: Types.Token): token is Types.TokenObj => {
	return shouldHaveRequiredProp(token);
};

export default isTokenObj;
