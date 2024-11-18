type CreateTokenObj<T> = T extends { $value: any }
	? {
			[key: `$${string}`]: any;
			$type?: string;
			$description?: string;
			$extensions?: Record<string, any>;
		} & T
	: never;

/**
 *	Dimension
 * @see https://tr.designtokens.org/format/#dimension
 */
export type Dimension = CreateTokenObj<{
	$type: "dimension";
	$value:
		| `${number}${"px" | "rem"}`
		| {
				value: number;
				unit: "px" | "rem";
		  };
}>;

/**
 * Color
 * @see https://tr.designtokens.org/format/#color
 */
export type Color = CreateTokenObj<{
	$type: "color";
	$value: `#${string}`;
}>;

/**
 * @see https://tr.designtokens.org/format/#font-family
 */
export type FontFamily = CreateTokenObj<{
	$type: "fontFamily";
	$value: string | string[];
}>;

/**
 * @see https://tr.designtokens.org/format/#font-weight
 */
export type FontWeight = CreateTokenObj<{
	$type: "fontWeight";
	$value:
		| 100
		| 200
		| 300
		| 400
		| 500
		| 600
		| 700
		| 800
		| 900
		| 1000
		| "thin"
		| "hairline"
		| "extra-light"
		| "ultra-light"
		| "light"
		| "normal"
		| "regular"
		| "book"
		| "medium"
		| "semi-bold"
		| "demi-bold"
		| "bold"
		| "extra-bold"
		| "ultra-bold"
		| "black"
		| "heavy"
		| "extra-black"
		| "ultra-black";
}>;

/**
 * @see https://tr.designtokens.org/format/#duration
 */
export type Duration = CreateTokenObj<{
	$type: "duration";
	$value: {
		value: number;
		unit: `${"ms" | "s"}`;
	};
}>;

/**
 * @see https://tr.designtokens.org/format/#cubic-bezier
 */
export type CubicBezier = CreateTokenObj<{
	$type: "cubicBezier";
	$value: [number, number, number, number];
}>;

/**
 * @description Customized CreateTokenObj
 */
export type String = CreateTokenObj<{
	$type: "string";
	$value: string;
}>;

/**
 * @see https://tr.designtokens.org/format/#number
 */
export type Number = CreateTokenObj<{
	$type: "number";
	$value: number;
}>;

/**
 * @see https://tr.designtokens.org/format/#composite-types
 */
export type Composite = CreateTokenObj<{
	$type: "composite";
	$value: Record<string, any>;
}>;

/**
 * @see https://tr.designtokens.org/format/#stroke-style
 */
export type StrokeStyle = CreateTokenObj<{
	$type: "strokeStyle";
	$value:
		| "solid"
		| "dashed"
		| "dotted"
		| "double"
		| "groove"
		| "ridge"
		| "outset"
		| "inset"
		| {
				dashArray: ({ value: number; unit: "px" | "rem" } | string)[];
				lineCap: "round" | "butt" | "square";
		  };
}>;

/**
 * @see https://tr.designtokens.org/format/#border
 */
export type Border = CreateTokenObj<{
	$type: "border";
	$value: {
		width: string | Dimension["$value"];
		style:
			| string
			| "none"
			| "hidden"
			| "dotted"
			| "dashed"
			| "solid"
			| "double"
			| "groove"
			| "ridge"
			| "inset"
			| "outset";
		color: string | Color["$value"];
	};
}>;

/**
 * @see https://tr.designtokens.org/format/#transition
 */
export type Transition = CreateTokenObj<{
	$type: "transition";
	$value: {
		duration: string | Duration["$value"];
		delay: string | Duration["$value"];
		timingFunction: string | CubicBezier["$value"];
	};
}>;

/**
 * @see https://tr.designtokens.org/format/#shadow
 */
export type Shadow = CreateTokenObj<{
	$type: "shadow";
	$value: {
		offsetX: string | Dimension["$value"];
		offsetY: string | Dimension["$value"];
		blur: string | Dimension["$value"];
		spread: string | Dimension["$value"];
		color: string | Color["$value"];
	};
}>;

/**
 * @see https://tr.designtokens.org/format/#gradient
 */
export type Gradient = CreateTokenObj<{
	$type: "gradient";
	$value: {
		color: string | Color["$value"];
		position: number;
	}[];
}>;

/**
 * @see https://tr.designtokens.org/format/#typography
 */
export type Typography = CreateTokenObj<{
	$type: "typography";
	$value: {
		fontFamily: FontFamily["$value"];
		fontSize: string | Dimension["$value"];
		fontWeight: number;
		letterSpacing: string | Dimension["$value"];
		lineHeight: number;
	};
}>;

type TokenObj =
	| Dimension
	| Color
	| FontFamily
	| FontWeight
	| Duration
	| CubicBezier
	| Number
	| String
	| Composite
	| StrokeStyle
	| Border
	| Transition
	| Shadow
	| Gradient
	| Typography;

export default TokenObj;
