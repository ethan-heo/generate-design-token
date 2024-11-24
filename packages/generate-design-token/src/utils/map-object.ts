/**
 * 주어진 객체의 모든 값을 주어진 콜백을 적용하여 반환합니다.
 *
 * @param obj - 처리할 객체
 * @param callback - 처리할 콜백. 첫 번째 인자로 값, 두 번째 인자로 키를 받습니다.
 * @returns 주어진 콜백을 적용한 결과를 반환합니다.
 */
const mapObject = <Obj extends object, T extends (...args: any[]) => any>(
	obj: Obj,
	callback: T,
) => {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => [key, callback(value)]),
	);
};

export default mapObject;
