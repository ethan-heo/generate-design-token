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
		| string
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
	$value: string | `#${string}`;
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
		| string
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
	$value:
		| string
		| {
				value: number;
				unit: `${"ms" | "s"}`;
		  };
}>;

/**
 * @see https://tr.designtokens.org/format/#cubic-bezier
 */
export type CubicBezier = CreateTokenObj<{
	$type: "cubicBezier";
	$value: string | [number, number, number, number];
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
	$value: string | number;
}>;

/**
 * @see https://tr.designtokens.org/format/#composite-types
 */
export type Composite = CreateTokenObj<{
	$type: "composite";
	$value: string | Record<string, any>;
}>;

/**
 * @see https://tr.designtokens.org/format/#stroke-style
 */
export type StrokeStyle = CreateTokenObj<{
	$type: "strokeStyle";
	$value:
		| string
		| "solid"
		| "dashed"
		| "dotted"
		| "double"
		| "groove"
		| "ridge"
		| "outset"
		| "inset"
		| {
				dashArray: (Dimension["$value"] | string)[];
				lineCap: "round" | "butt" | "square";
		  };
}>;

/**
 * @see https://tr.designtokens.org/format/#border
 */
export type Border = CreateTokenObj<{
	$type: "border";
	$value:
		| string
		| {
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
	$value:
		| string
		| {
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
	$value:
		| string
		| {
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
	$value:
		| string
		| {
				color: string | Color["$value"];
				position: number;
		  }[];
}>;

/**
 * @see https://tr.designtokens.org/format/#typography
 */
export type Typography = CreateTokenObj<{
	$type: "typography";
	$value:
		| string
		| {
				fontFamily: string | FontFamily["$value"];
				fontSize: string | Dimension["$value"];
				fontWeight: string | FontWeight["$value"];
				letterSpacing: string | Dimension["$value"];
				lineHeight: string | number;
		  };
}>;

export type TokenObj =
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
