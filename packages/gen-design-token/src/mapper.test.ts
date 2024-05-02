import { expect, it } from "vitest";
import mapper from "./mapper";

it(`토큰을 매핑한다`, () => {
	const value = {
		color: {
			white: {
				$type: "color",
				$value: "#ffffff",
			},
			black: {
				1: {
					$type: "color",
					$value: "#000000",
				},
				2: {
					$type: "color",
					$value: "#333333",
				},
			},
		},
	};
	const expected = {
		"color-white": {
			$type: "color",
			$value: "#ffffff",
		},
		"color-black-1": {
			$type: "color",
			$value: "#000000",
		},
		"color-black-2": {
			$type: "color",
			$value: "#333333",
		},
	};

	expect(mapper(value)).toStrictEqual(expected);
});
