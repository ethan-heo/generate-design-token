/**
 * 주어진 토큰 참조 문자열을 토큰 경로의 배열로 변환합니다.
 *
 * @param tokenRef - 토큰 참조 문자열
 * @returns 토큰 경로의 배열
 */
const fromTokenRef = (tokenRef: string) => {
	return tokenRef.split(".");
};

export default fromTokenRef;
