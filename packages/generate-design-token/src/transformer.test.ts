import { expect, it } from "vitest";
import transformer, {
	transformCase1,
	transformCase2,
	transformCase3,
	transformCase4,
} from "./transformer";
import { USE_CASES } from "./constants/use-cases";
import { TOKEN_KEY_SEPERATOR } from "./constants/seperator";

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
			vintage: {
				white: {
					$type: "color",
					$value: "#eeeeee",
				},
				black: {
					$type: "color",
					$value: "#3d3d3d",
				},
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

it(`case1. 키값의 참조값이 가리키는 값이 토큰 객체이고 값이 토큰 객체일 때`, () => {
	const originalToken = {
		border: {
			"{color.white}": {
				$type: "dimension",
				$value: "2px solid {$value}",
			},
		},
	};
	const data = {
		token: TOKEN.BASE.color.white,
		value: {
			$type: "dimension",
			$value: "2px solid {$value}",
		},
		case: USE_CASES.CASE1,
	};
	const objPath = ["border", "{color.white}"].join(TOKEN_KEY_SEPERATOR);
	const expected = {
		border: {
			color: {
				white: {
					$type: "dimension",
					$value: "2px solid {color.white}",
				},
			},
		},
	};

	transformCase1(originalToken, objPath, data);

	expect(originalToken).toStrictEqual(expected);
});
it.each([
	[
		{
			border: {
				"{color}": {
					$type: "dimension",
					$value: "2px solid {$value}",
				},
			},
		},
		{
			token: TOKEN.BASE.color,
			value: {
				$type: "dimension",
				$value: "2px solid {$value}",
			},
			case: USE_CASES.CASE2,
		},
		["border", "{color}"].join(TOKEN_KEY_SEPERATOR),
		{
			border: {
				color: {
					white: {
						$type: "dimension",
						$value: "2px solid {color.white}",
					},
					black: {
						$type: "dimension",
						$value: "2px solid {color.black}",
					},
					vintage: {
						white: {
							$type: "dimension",
							$value: "2px solid {color.vintage.white}",
						},
						black: {
							$type: "dimension",
							$value: "2px solid {color.vintage.black}",
						},
					},
				},
			},
		},
	],
	[
		{
			border: {
				"{color.vintage}": {
					$type: "dimension",
					$value: "2px solid {$value}",
				},
			},
		},
		{
			token: TOKEN.BASE.color.vintage,
			value: {
				$type: "dimension",
				$value: "2px solid {$value}",
			},
			case: USE_CASES.CASE2,
		},
		["border", "{color.vintage}"].join(TOKEN_KEY_SEPERATOR),
		{
			border: {
				color: {
					vintage: {
						white: {
							$type: "dimension",
							$value: "2px solid {color.vintage.white}",
						},
						black: {
							$type: "dimension",
							$value: "2px solid {color.vintage.black}",
						},
					},
				},
			},
		},
	],
])(
	`case2. 키값의 참조값이 가리키는 값이 토큰 구조 객체이고 값이 토큰 객체일 때`,
	(originalToken, data, objPath, expected) => {
		transformCase2(originalToken, objPath, data);

		expect(originalToken).toStrictEqual(expected);
	},
);

it(`case3. 키값의 참조값이 가리키는 값이 토큰 객체이고 값이 토큰 구조 객체일 때`, () => {
	const originalToken = {
		border: {
			"{color.white}": {
				thin: {
					$type: "dimension",
					$value: "2px solid {$value}",
				},
			},
		},
	};
	const data = {
		token: TOKEN.BASE.color.white,
		value: {
			thin: {
				$type: "dimension",
				$value: "2px solid {$value}",
			},
		},
		case: USE_CASES.CASE1,
	};
	const objPath = ["border", "{color.white}", "thin"].join(TOKEN_KEY_SEPERATOR);
	const expected = {
		border: {
			color: {
				white: {
					thin: {
						$type: "dimension",
						$value: "2px solid {color.white}",
					},
				},
			},
		},
	};
	transformCase3(originalToken, objPath, data);

	expect(originalToken).toStrictEqual(expected);
});

it(`case4. 키값의 참조값이 가리키는 값이 토큰 구조 객체이고 값이 토큰 구조 객체일 때`, () => {
	const originalToken = {
		border: {
			"{color}": {
				thin: {
					$type: "dimension",
					$value: "2px solid {$value}",
				},
			},
		},
	};
	const data = {
		token: TOKEN.BASE.color.white,
		value: {
			thin: {
				$type: "dimension",
				$value: "2px solid {$value}",
			},
		},
		case: USE_CASES.CASE1,
	};
	const objPath = ["border", "{color}", "thin"].join(TOKEN_KEY_SEPERATOR);
	const expected = {
		border: {
			color: {
				white: {
					thin: {
						$type: "dimension",
						$value: "2px solid {color.white.thin}",
					},
				},
				black: {
					thin: {
						$type: "dimension",
						$value: "2px solid {color.white.thin}",
					},
				},
				vintage: {
					white: {
						thin: {
							$type: "dimension",
							$value: "2px solid {color.white.thin}",
						},
					},
					black: {
						thin: {
							$type: "dimension",
							$value: "2px solid {color.white.thin}",
						},
					},
				},
			},
		},
	};
	transformCase4(originalToken, objPath, data);

	expect(originalToken).toStrictEqual(expected);
});
