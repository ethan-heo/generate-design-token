import { Validate } from "@utils";
import { expect, it } from "vitest";

const TOKEN = {
	color: {
		primary: {
			$type: "color",
			$value: "#ff0000",
		},
	},
};

it(`Validate.token.duplicate`, () => {
	expect(Validate.token.duplicate(TOKEN, "color.primary")).toBeTruthy();
	expect(Validate.token.duplicate(TOKEN, "color.secondary")).toBeFalsy();
});
