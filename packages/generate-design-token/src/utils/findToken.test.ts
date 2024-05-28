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
		primary: {
			$type: "color",
			$value: "{color.red}",
		},
	},
	border: {
		thin: {
			$type: "string",
			$value: "{color.primary}",
		},
	},
	"box-shadow": {
		$type: "string",
		$value: "{color.white}",
	},
};

it.each([
	["color.red", TOKEN.color.red],
	["color.blue", TOKEN.color.blue],
	["color", TOKEN.color],
	["color.blue.1", undefined],
	["border.thin", TOKEN.color.red],
	["box-shadow", undefined],
])(`findToken(%o, %a) => %o`, (token, expected) => {
	expect(findToken(token, [TOKEN])).toStrictEqual(expected);
});
