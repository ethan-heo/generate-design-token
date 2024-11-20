import * as Types from "@types";
import { Validate } from "@utils";
import { expect, it } from "vitest";

const TOKEN_OBJS: Record<Types.TokenObj["$type"], Types.TokenObj> = {
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

it(`Validator.tokenObj.is`, () => {
	expect(Validate.token.is.border(TOKEN_OBJS.border)).toBeTruthy();
	expect(Validate.token.is.color(TOKEN_OBJS.color)).toBeTruthy();
	expect(Validate.token.is.fontFamily(TOKEN_OBJS.fontFamily)).toBeTruthy();
	expect(Validate.token.is.fontWeight(TOKEN_OBJS.fontWeight)).toBeTruthy();
	expect(Validate.token.is.duration(TOKEN_OBJS.duration)).toBeTruthy();
	expect(Validate.token.is.cubicBezier(TOKEN_OBJS.cubicBezier)).toBeTruthy();
	expect(Validate.token.is.number(TOKEN_OBJS.number)).toBeTruthy();
	expect(Validate.token.is.string(TOKEN_OBJS.string)).toBeTruthy();
	expect(Validate.token.is.composite(TOKEN_OBJS.composite)).toBeTruthy();
	expect(Validate.token.is.strokeStyle(TOKEN_OBJS.strokeStyle)).toBeTruthy();
	expect(Validate.token.is.transition(TOKEN_OBJS.transition)).toBeTruthy();
	expect(Validate.token.is.shadow(TOKEN_OBJS.shadow)).toBeTruthy();
	expect(Validate.token.is.gradient(TOKEN_OBJS.gradient)).toBeTruthy();
	expect(Validate.token.is.typography(TOKEN_OBJS.typography)).toBeTruthy();
});
