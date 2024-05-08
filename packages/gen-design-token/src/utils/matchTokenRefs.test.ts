import { expect, it } from "vitest";
import matchTokenRef from "./matchTokenRefs";

it.each([
  [`{color.yellow}`, ["color.yellow"]],
  [`{color.yellow} {color.red}`, ["color.yellow", "color.red"]],
  [`{{color.yellow}}`, ["color.yellow"]],
  [`color.yellow}`, []],
  [`{color.yellow`, []],
  [`color.yellow`, []],
])(`matchTokenRef($s) => %s`, (value, expected) => {
  expect(matchTokenRef(value)).toStrictEqual(expected);
});
