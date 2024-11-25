import { expect, it } from "vitest";
import {
	isBorderToken,
	isColorToken,
	isCompositeToken,
	isCubicBezierToken,
	isDurationToken,
	isFontFamilyToken,
	isFontWeightToken,
	isGradientToken,
	isNumberToken,
	isShadowToken,
	isStringToken,
	isStrokeStyleToken,
	isTransitionToken,
	isTypographyToken,
} from "./is";
import { TokenObj } from "../../../types/token.types";

const TOKEN_OBJS: Record<TokenObj["$type"], TokenObj> = {
	dimension: {
		$type: "dimension",
		$value: {
			value: 10,
			unit: "px",
		},
	},
	color: {
		$type: "color",
		$value: "#ff0000",
	},
	fontFamily: {
		$type: "fontFamily",
		$value: "Arial",
	},
	fontWeight: {
		$type: "fontWeight",
		$value: 700,
	},
	gradient: {
		$type: "gradient",
		$value: [
			{
				color: "#ff0000",
				position: 0,
			},
			{
				color: "#00ff00",
				position: 100,
			},
		],
	},
	duration: {
		$type: "duration",
		$value: {
			value: 1000,
			unit: "ms",
		},
	},
	cubicBezier: {
		$type: "cubicBezier",
		$value: [1, 1, 1, 1],
	},
	typography: {
		$type: "typography",
		$value: {
			fontFamily: "Arial",
			fontSize: "16px",
			fontWeight: 700,
			letterSpacing: "0.1em",
			lineHeight: 1.5,
		},
	},
	shadow: {
		$type: "shadow",
		$value: {
			offsetX: "2px",
			offsetY: "2px",
			blur: "4px",
			spread: "2px",
			color: "#000000",
		},
	},
	string: {
		$type: "string",
		$value: "Hello, World!",
	},
	number: {
		$type: "number",
		$value: 42,
	},
	composite: {
		$type: "composite",
		$value: {
			"aa.bb.cc": 43,
		},
	},
	border: {
		$type: "border",
		$value: {
			width: {
				value: 1,
				unit: "px",
			},
			style: "solid",
			color: "#000000",
		},
	},
	strokeStyle: {
		$type: "strokeStyle",
		$value: {
			dashArray: ["2px", "4px"],
			lineCap: "round",
		},
	},
	transition: {
		$type: "transition",
		$value: {
			duration: {
				value: 1000,
				unit: "ms",
			},
			timingFunction: [1, 1, 1, 1],
			delay: {
				value: 0,
				unit: "ms",
			},
		},
	},
};

it(`is`, () => {
	expect(isBorderToken(TOKEN_OBJS.border)).toBeTruthy();
	expect(isColorToken(TOKEN_OBJS.color)).toBeTruthy();
	expect(isFontFamilyToken(TOKEN_OBJS.fontFamily)).toBeTruthy();
	expect(isFontWeightToken(TOKEN_OBJS.fontWeight)).toBeTruthy();
	expect(isDurationToken(TOKEN_OBJS.duration)).toBeTruthy();
	expect(isCubicBezierToken(TOKEN_OBJS.cubicBezier)).toBeTruthy();
	expect(isNumberToken(TOKEN_OBJS.number)).toBeTruthy();
	expect(isStringToken(TOKEN_OBJS.string)).toBeTruthy();
	expect(isCompositeToken(TOKEN_OBJS.composite)).toBeTruthy();
	expect(isStrokeStyleToken(TOKEN_OBJS.strokeStyle)).toBeTruthy();
	expect(isTransitionToken(TOKEN_OBJS.transition)).toBeTruthy();
	expect(isShadowToken(TOKEN_OBJS.shadow)).toBeTruthy();
	expect(isGradientToken(TOKEN_OBJS.gradient)).toBeTruthy();
	expect(isTypographyToken(TOKEN_OBJS.typography)).toBeTruthy();
});
