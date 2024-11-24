/**
 * 주어진 배열을 순회하여 주어진 콜백을 적용하고, 그 결과를 반환하는 함수.
 *
 * @param arr - 순회할 배열.
 * @param callback - 순회할 때 적용할 콜백. 첫 번째 인자로 배열의 요소를 받는다.
 * @returns 주어진 콜백을 적용한 결과를 반환하는 배열.
 */
const mapArray = <Arr extends any[], T extends (...args: any[]) => any>(
	arr: Arr,
	callback: T,
) => {
	return arr.map(callback);
};

export default mapArray;
