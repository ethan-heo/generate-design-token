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
		// "{color}": {
		// 	1: {
		// 		$type: "dimension",
		// 		$value: "2px solid {$value}",
		// 	},
		// },
		"{color}": {
			$type: "dimension",
			$value: "2px solid {$value}",
		},
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
					$value: "2px solid #ffffff",
				},
				black: {
					$type: "dimension",
					$value: "2px solid #000000",
				},
			},
			large: {
				white: {
					1: {
						$type: "dimension",
						$value: "2px solid #ffffff",
					},
				},
				black: {
					1: {
						$type: "dimension",
						$value: "2px solid #000000",
					},
				},
			},
			"extra-large": {
				white: {
					1: {
						$type: "dimension",
						$value: "2px solid #ffffff",
					},
				},
			},
			"2-extra-large": {
				white: {
					$type: "dimension",
					$value: "2px solid #ffffff",
				},
			},
		},
		// white: {
		// 	1: {
		// 		$type: "dimension",
		// 		$value: "2px solid #ffffff",
		// 	},
		// },
		// black: {
		// 	1: {
		// 		$type: "dimension",
		// 		$value: "2px solid #000000",
		// 	},
		// },
		white: {
			$type: "dimension",
			$value: "2px solid #ffffff",
		},
		black: {
			$type: "dimension",
			$value: "2px solid #000000",
		},
	};

	expect(transformer(value, [TOKEN.BASE])).toStrictEqual(expected);
});
