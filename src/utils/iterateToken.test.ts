import { expect, it } from "vitest";
import iterateToken from "./iterateToken";

it(`토큰을 순회한다.`, () => {
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
      yellow: {
        1: {
          $type: "color",
          $value: "#f0f000",
        },
      },
    },
  };
  const expected = {
    "color.red": {
      $type: "color",
      $value: "#ff0000",
    },
    "color.blue": {
      $type: "color",
      $value: "#0000ff",
    },
    "color.yellow.1": {
      $type: "color",
      $value: "#f0f000",
    },
  };
  const mapToToken = iterateToken({
    data: {},
    foundTokenObjCallback: (tokenNames, token, data) => {
      data[tokenNames.join(".")] = token;
    },
  });

  expect(mapToToken(TOKEN)).toStrictEqual(expected);
});
