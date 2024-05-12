import { expect, it } from "vitest";
import findToken from "./findToken";

const TOKEN = {
	color: {
		red: {
			$type: "color",
			$value: "#ff0000",
		},
		blue: {
			$type: "color",
			$value: "#0000ff",
		},
	},
};

it.each([
	["color.red", TOKEN.color.red],
	["color.blue", TOKEN.color.blue],
	["color", TOKEN.color],
	["color.blue.1", undefined],
])(`findToken(%o, %a) => %o`, (token, expected) => {
	expect(findToken(token, [TOKEN])).toStrictEqual(expected);
});
