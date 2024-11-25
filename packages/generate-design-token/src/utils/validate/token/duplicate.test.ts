import { expect, it } from "vitest";
import duplicateToken from "./duplicate";

const TOKEN = {
	color: {
		primary: {
			$type: "color",
			$value: "#ff0000",
		},
	},
};

it(`duplicateToken`, () => {
	expect(duplicateToken(TOKEN, "color.primary")).toBeTruthy();
	expect(duplicateToken(TOKEN, "color.secondary")).toBeFalsy();
});
