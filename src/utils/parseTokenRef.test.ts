import { expect, it } from "vitest";
import parseTokenRef from "./parseTokenRef";

it.each([
	["{color}", ["color"]],
	["{color.yellow}", ["color", "yellow"]],
])(`parseTokenRef(%s) => %a`, (refTokenName, expected) => {
	expect(parseTokenRef(refTokenName)).toStrictEqual(expected);
});
