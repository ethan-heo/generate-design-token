import { expect, it } from "vitest";
import transformer from "./transformer";

const TOKEN = {
  BASE: {
    color: {
      white: {
        $type: "color",
        $value: "#ffffff",
      },
      black: {
        $type: "color",
        $value: "#000000",
      },
    },
  },
};

it(`구조를 변환한다.`, () => {
  const value = {
    border: {
      small: {
        $type: "dimension",
        $value: "1px solid #fff",
      },
      medium: {
        "{color}": {
          $type: "dimension",
          $value: "2px solid {$value}",
        },
      },
      large: {
        "1": {
          $type: "dimension",
          $value: "1px solid #000000",
        },
        "{color}": {
          1: {
            $type: "dimension",
            $value: "2px solid {$value}",
          },
        },
      },
      "extra-large": {
        "{color.white}": {
          1: {
            $type: "dimension",
            $value: "2px solid {$value}",
          },
        },
      },
      "2-extra-large": {
        "{color.white}": {
          $type: "dimension",
          $value: "2px solid {$value}",
        },
      },
    },
    "{color}": {
      1: {
        $type: "dimension",
        $value: "2px solid {$value}",
      },
    },
    // "{color}": {
    //   $type: "dimension",
    //   $value: "2px solid {$value}",
    // },
  };
  const expected = {
    border: {
      small: {
        $type: "dimension",
        $value: "1px solid #fff",
      },
      medium: {
        white: {
          $type: "dimension",
          $value: "2px solid {color.white}",
        },
        black: {
          $type: "dimension",
          $value: "2px solid {color.black}",
        },
      },
      large: {
        "1": {
          $type: "dimension",
          $value: "1px solid #000000",
        },
        white: {
          1: {
            $type: "dimension",
            $value: "2px solid {color.white}",
          },
        },
        black: {
          1: {
            $type: "dimension",
            $value: "2px solid {color.black}",
          },
        },
      },
      "extra-large": {
        white: {
          1: {
            $type: "dimension",
            $value: "2px solid {color.white}",
          },
        },
      },
      "2-extra-large": {
        white: {
          $type: "dimension",
          $value: "2px solid {color.white}",
        },
      },
    },
    white: {
      1: {
        $type: "dimension",
        $value: "2px solid {color.white}",
      },
    },
    black: {
      1: {
        $type: "dimension",
        $value: "2px solid {color.black}",
      },
    },
    // white: {
    //   $type: "dimension",
    //   $value: "2px solid {color.white}",
    // },
    // black: {
    //   $type: "dimension",
    //   $value: "2px solid {color.black}",
    // },
  };

  expect(transformer(value, [TOKEN.BASE])).toStrictEqual(expected);
});
