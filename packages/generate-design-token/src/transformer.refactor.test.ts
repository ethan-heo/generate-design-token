import { Token } from "./generateToken.types";
import { expect, it } from "vitest";
import tranformerRefactor from "./transformer.refactor";

// 테스트 사전 정보
// 1. 목 데이터는 검증이 완료된 데이터라고 가정하여 정확한 토큰 형식을 가지는 것을 전제로 만들어진다.

const BASE_TOKEN: Token = {
	color: {
		primary: {
			$type: "color",
			$value: "#ff0000",
		},
		secondary: {
			$type: "color",
			$value: "#00ff00",
		},
	},
};

it(`Use case 1`, () => {
	expect(tranformerRefactor()).toBe({});
});
it(`Use case 2`, () => {
	expect(tranformerRefactor()).toBe({});
});
it(`Use case 3`, () => {
	expect(tranformerRefactor()).toBe({});
});
it(`Use case 4`, () => {
	expect(tranformerRefactor()).toBe({});
});
