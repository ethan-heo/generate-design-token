import { expect, it } from "vitest";
import validateTokenObj from "./validateTokenObj";

it.each([
	[
		{
			$type: "color",
			$value: "#ff0000",
		},
		{
			$type: "color",
			$description: "Primary color",
			$value: "#ff0000",
		},
	],
])(`유효한 토큰 객체`, (actual) => {
	expect(() => {
		validateTokenObj(actual);
	}).not.toThrowError();
});

it.each([
	[
		{},
		{
			$type: "color",
		},
		{
			$value: "#ff0000",
		},
		{
			$type: 1,
			$value: "#ff0000",
		},
		{
			$type: "color",
			$value: 2,
		},
		[],
		1,
		"hello",
		Symbol("hello"),
		null,
		undefined,
	],
])(`유효하지 않은 토큰 객체에 대해 유효성 검사를 진행한다`, (actual) => {
	expect(() => {
		validateTokenObj(actual);
	}).toThrowError();
});
