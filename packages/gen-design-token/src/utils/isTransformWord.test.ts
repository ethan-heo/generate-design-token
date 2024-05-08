import { expect, it } from "vitest";
import isTransformWord from "./isTransformWord";

it.each([
  ["{color}", true],
  ["{color.yello}", true],
  ["color", false],
  ["{color", false],
  ["color}", false],
])(`isTransformWord(%s) => %s`, (value, expected) => {
  expect(isTransformWord(value)).toBe(expected);
});
