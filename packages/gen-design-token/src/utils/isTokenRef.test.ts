import { expect, it } from "vitest";
import isTokenRef from "./isTokenRef";

it.each([
  ["{color.white}", true],
  ["{color}", true],
  ["color}", false],
  ["{color", false],
  ["color", false],
  ["{{color.white}}", false],
  ["{}", false],
  ["{color. white}", false],
])(`isTokenRef(%s) => %b`, (value, expected) => {
  expect(isTokenRef(value)).toBe(expected);
});
