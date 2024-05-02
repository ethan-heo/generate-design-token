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
	[TOKEN, ["color", "red"], TOKEN.color.red],
	[TOKEN, ["color"], TOKEN.color],
])(`findToken(%o, %a) => %o`, (token, ref, expected) => {
	expect(findToken(token, ref)).toStrictEqual(expected);
});
