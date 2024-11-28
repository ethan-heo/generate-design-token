import { TokenObj } from "../types/token.types";
import { shouldHaveRequiredProp } from "./validate/format";

/**
 * 주어진 객체가 TokenObj 타입인지 확인합니다.
 * TokenObj는 `value` 속성을 가져야 합니다.
 * @param token - 확인할 객체
 * @returns 주어진 객체가 TokenObj 타입인지 여부
 */
export const isTokenObj = (token: object): token is TokenObj => {
	return shouldHaveRequiredProp(token);
};
