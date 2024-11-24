import { TokenGroup as TokenGroup$1, TokenObj as TokenObj$1, Dimension as Dimension$1, Color as Color$1, FontFamily as FontFamily$1, FontWeight as FontWeight$1, Duration as Duration$1, CubicBezier as CubicBezier$1, Number as Number$1, String as String$1, Composite as Composite$1, StrokeStyle as StrokeStyle$1, Border as Border$1, Transition as Transition$1, Shadow as Shadow$1, Gradient as Gradient$1, Typography as Typography$1 } from '@types';

type TokenRef = string;

/**
 * @see https://tr.designtokens.org/format/#groups
 */
type TokenGroup = {
    [key: string | `$${string}`]: any | TokenGroup;
};

type CreateTokenObj<T> = T extends {
    $value: any;
} ? {
    [key: `$${string}`]: any;
    $type?: string;
    $description?: string;
    $extensions?: Record<string, any>;
} & T : never;
/**
 *	Dimension
 * @see https://tr.designtokens.org/format/#dimension
 */
type Dimension = CreateTokenObj<{
    $type: "dimension";
    $value: string | `${number}${"px" | "rem"}` | {
        value: number;
        unit: "px" | "rem";
    };
}>;
/**
 * Color
 * @see https://tr.designtokens.org/format/#color
 */
type Color = CreateTokenObj<{
    $type: "color";
    $value: string | `#${string}`;
}>;
/**
 * @see https://tr.designtokens.org/format/#font-family
 */
type FontFamily = CreateTokenObj<{
    $type: "fontFamily";
    $value: string | string[];
}>;
/**
 * @see https://tr.designtokens.org/format/#font-weight
 */
type FontWeight = CreateTokenObj<{
    $type: "fontWeight";
    $value: string | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | "thin" | "hairline" | "extra-light" | "ultra-light" | "light" | "normal" | "regular" | "book" | "medium" | "semi-bold" | "demi-bold" | "bold" | "extra-bold" | "ultra-bold" | "black" | "heavy" | "extra-black" | "ultra-black";
}>;
/**
 * @see https://tr.designtokens.org/format/#duration
 */
type Duration = CreateTokenObj<{
    $type: "duration";
    $value: string | {
        value: number;
        unit: `${"ms" | "s"}`;
    };
}>;
/**
 * @see https://tr.designtokens.org/format/#cubic-bezier
 */
type CubicBezier = CreateTokenObj<{
    $type: "cubicBezier";
    $value: string | [number, number, number, number];
}>;
/**
 * @description Customized CreateTokenObj
 */
type String = CreateTokenObj<{
    $type: "string";
    $value: string;
}>;
/**
 * @see https://tr.designtokens.org/format/#number
 */
type Number = CreateTokenObj<{
    $type: "number";
    $value: string | number;
}>;
/**
 * @see https://tr.designtokens.org/format/#composite-types
 */
type Composite = CreateTokenObj<{
    $type: "composite";
    $value: string | Record<string, any>;
}>;
/**
 * @see https://tr.designtokens.org/format/#stroke-style
 */
type StrokeStyle = CreateTokenObj<{
    $type: "strokeStyle";
    $value: string | "solid" | "dashed" | "dotted" | "double" | "groove" | "ridge" | "outset" | "inset" | {
        dashArray: (Dimension["$value"] | string)[];
        lineCap: "round" | "butt" | "square";
    };
}>;
/**
 * @see https://tr.designtokens.org/format/#border
 */
type Border = CreateTokenObj<{
    $type: "border";
    $value: string | {
        width: string | Dimension["$value"];
        style: string | "none" | "hidden" | "dotted" | "dashed" | "solid" | "double" | "groove" | "ridge" | "inset" | "outset";
        color: string | Color["$value"];
    };
}>;
/**
 * @see https://tr.designtokens.org/format/#transition
 */
type Transition = CreateTokenObj<{
    $type: "transition";
    $value: string | {
        duration: string | Duration["$value"];
        delay: string | Duration["$value"];
        timingFunction: string | CubicBezier["$value"];
    };
}>;
/**
 * @see https://tr.designtokens.org/format/#shadow
 */
type Shadow = CreateTokenObj<{
    $type: "shadow";
    $value: string | {
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
type Gradient = CreateTokenObj<{
    $type: "gradient";
    $value: string | {
        color: string | Color["$value"];
        position: number;
    }[];
}>;
/**
 * @see https://tr.designtokens.org/format/#typography
 */
type Typography = CreateTokenObj<{
    $type: "typography";
    $value: string | {
        fontFamily: string | FontFamily["$value"];
        fontSize: string | Dimension["$value"];
        fontWeight: string | FontWeight["$value"];
        letterSpacing: string | Dimension["$value"];
        lineHeight: string | number;
    };
}>;
type TokenObj = Dimension | Color | FontFamily | FontWeight | Duration | CubicBezier | Number | String | Composite | StrokeStyle | Border | Transition | Shadow | Gradient | Typography;

type TokenResult = [string[], TokenGroup$1 | TokenObj$1];
type Iteratee = (props: string[], token: TokenGroup$1, self: Token) => boolean;
declare class Token {
    #private;
    constructor(token: TokenGroup$1);
    /**
     *
     * @description 주어진 참조값에 해당하는 토큰 객체 및 구조 객체를 반환한다.
     * @returns
     */
    find(callback: Iteratee): TokenResult | undefined;
    /**
     * @description 주어진 참조값에 해당하는 모든 토큰 객체 및 구조 객체를 반환한다.
     * @returns
     */
    findAll(callback: Iteratee): TokenResult[];
    /**
     * @description 주어진 참조값에 해당하는 토큰을 삭제한다.
     * @param props 참조값
     * @throws {Error} parent token이 존재하지 않을 때
     */
    delete(props: string[]): void;
    /**
     * @description 주어진 참조값에 토큰을 추가한다.
     * @param props 토큰을 추가할 참조값
     * @param token 추가할 토큰
     */
    add(props: string[], token: TokenGroup$1 | TokenObj$1): void;
    /**
     * @description 토큰의 복사본을 반환한다.
     * @returns 복사된 토큰
     */
    clone(): Token;
    /**
     * @description 토큰을 순회하여 주어진 콜백을 적용하고, 그 결과를 반환한다.
     * @param callback 토큰을 순회하는 콜백. 첫 번째 인자로 토큰의 경로를, 두 번째 인자로 토큰을 받는다.
     * @returns 주어진 콜백을 적용한 결과를 반환한다.
     */
    map(callback: (props: string[], token: TokenGroup$1) => TokenResult): TokenResult[];
    getToken(): TokenGroup$1;
}

declare const generateDesignToken: (base: TokenGroup$1, refTokens: TokenGroup$1[]) => TokenGroup$1;

declare const isTokenObj: (token: object) => token is TokenObj$1;

/**
 * 주어진 문자열이 토큰 참조값인지 확인합니다.
 *
 * @param {string} tokenRef - 토큰 참조 문자열
 * @returns {boolean} 토큰 참조 문자열이면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
declare const isTokenRef: (tokenRef: string) => boolean;

declare const hasTokenRef: (tokenRef: string) => boolean;

/**
 * 주어진 객체의 모든 값을 주어진 콜백을 적용하여 반환합니다.
 *
 * @param obj - 처리할 객체
 * @param callback - 처리할 콜백. 첫 번째 인자로 값, 두 번째 인자로 키를 받습니다.
 * @returns 주어진 콜백을 적용한 결과를 반환합니다.
 */
declare const mapObject: <Obj extends object, T extends (...args: any[]) => any>(obj: Obj, callback: T) => {
    [k: string]: any;
};

/**
 * 주어진 배열을 순회하여 주어진 콜백을 적용하고, 그 결과를 반환하는 함수.
 *
 * @param arr - 순회할 배열.
 * @param callback - 순회할 때 적용할 콜백. 첫 번째 인자로 배열의 요소를 받는다.
 * @returns 주어진 콜백을 적용한 결과를 반환하는 배열.
 */
declare const mapArray: <Arr extends any[], T extends (...args: any[]) => any>(arr: Arr, callback: T) => any[];

/**
 * 주어진 문자열에 토큰 참조가 포함되어 있는지 확인하고
 * 토큰 참조를 추출하여 반환합니다.
 *
 * @param value - 확인할 문자열
 * @returns 토큰 참조를 추출하여 반환합니다. 없으면 null을 반환합니다.
 */
declare const findTokenRef: (value: string) => RegExpMatchArray | null;

/**
 * 주어진 토큰 경로를 문자열로 변환하여 반환합니다.
 * @param props - 토큰 경로
 * @returns 토큰 경로를 문자열로 변환한 결과
 */
declare const toTokenRef: (props: string[]) => string;

/**
 * 주어진 토큰 참조 문자열을 토큰 경로의 배열로 변환합니다.
 *
 * @param tokenRef - 토큰 참조 문자열
 * @returns 토큰 경로의 배열
 */
declare const fromTokenRef: (tokenRef: string) => string[];

declare const takeOffBracketFromTokenRef: (tokenRef: string) => string;

declare const index$4_fromTokenRef: typeof fromTokenRef;
declare const index$4_takeOffBracketFromTokenRef: typeof takeOffBracketFromTokenRef;
declare const index$4_toTokenRef: typeof toTokenRef;
declare namespace index$4 {
  export { index$4_fromTokenRef as fromTokenRef, index$4_takeOffBracketFromTokenRef as takeOffBracketFromTokenRef, index$4_toTokenRef as toTokenRef };
}

type Result = "string" | "number" | "bigint" | "boolean" | "undefined" | "symbol" | "null" | "object" | "array" | "function";
declare const getType: (value: any) => Result;

declare const isObject: (value: unknown) => value is object;

declare const isArray: (value: unknown) => value is [];

declare const isString: (value: unknown) => value is string;

declare const isNumber: (value: unknown) => value is number;

declare const isUndefined: (value: unknown) => value is undefined;

declare const index$3_getType: typeof getType;
declare const index$3_isArray: typeof isArray;
declare const index$3_isNumber: typeof isNumber;
declare const index$3_isObject: typeof isObject;
declare const index$3_isString: typeof isString;
declare const index$3_isUndefined: typeof isUndefined;
declare namespace index$3 {
  export { index$3_getType as getType, index$3_isArray as isArray, index$3_isNumber as isNumber, index$3_isObject as isObject, index$3_isString as isString, index$3_isUndefined as isUndefined };
}

/**
 * @description 토큰 객체의 필수 속성이 포함되어 있는지 확인한다
 * @returns
 */
declare const shouldHaveRequiredProp: (value: {}) => boolean;
/**
 * @description 객체 속성 모두 이름에 $를 prefix로 가지고 있는지 확인한다
 * @returns
 */
declare const shouldHaveDollarPrefix: (value: {}) => boolean;
/**
 * @description 객체 속성 모두 이름에 $를 prefix로 가지고 있지 않은지 확인한다
 * @returns
 */
declare const shouldNotHaveDollarPrefix: (value: {}) => boolean;
/**
 * @description 주어진 문자열이 토큰 참조값만 포함되어 있는지 확인한다.
 * @param {string} tokenRef
 * @returns {boolean} 토큰 참조가 포함된 문자열이면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
declare const shouldBeOnlyTokenRef: (tokenRef: string) => boolean;

declare const index$2_shouldBeOnlyTokenRef: typeof shouldBeOnlyTokenRef;
declare const index$2_shouldHaveDollarPrefix: typeof shouldHaveDollarPrefix;
declare const index$2_shouldHaveRequiredProp: typeof shouldHaveRequiredProp;
declare const index$2_shouldNotHaveDollarPrefix: typeof shouldNotHaveDollarPrefix;
declare namespace index$2 {
  export { index$2_shouldBeOnlyTokenRef as shouldBeOnlyTokenRef, index$2_shouldHaveDollarPrefix as shouldHaveDollarPrefix, index$2_shouldHaveRequiredProp as shouldHaveRequiredProp, index$2_shouldNotHaveDollarPrefix as shouldNotHaveDollarPrefix };
}

/**
 * 주어진 토큰 객체가 dimension 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 dimension 타입인지 여부
 */
declare const dimension$1: (tokenObj: TokenObj$1) => tokenObj is Dimension$1;
/**
 * 주어진 토큰 객체가 Color 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Color 타입인지 여부
 */
declare const color$1: (tokenObj: TokenObj$1) => tokenObj is Color$1;
/**
 * 주어진 토큰 객체가 FontFamily 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 FontFamily 타입인지 여부
 */
declare const fontFamily$1: (tokenObj: TokenObj$1) => tokenObj is FontFamily$1;
/**
 * 주어진 토큰 객체가 FontWeight 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 FontWeight 타입인지 여부
 */
declare const fontWeight$1: (tokenObj: TokenObj$1) => tokenObj is FontWeight$1;
/**
 * 주어진 토큰 객체가 Duration 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Duration 타입인지 여부
 */
declare const duration$1: (tokenObj: TokenObj$1) => tokenObj is Duration$1;
/**
 * 주어진 토큰 객체가 CubicBezier 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 CubicBezier 타입인지 여부
 */
declare const cubicBezier$1: (tokenObj: TokenObj$1) => tokenObj is CubicBezier$1;
/**
 * 주어진 토큰 객체가 Number 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Number 타입인지 여부
 */
declare const number$1: (tokenObj: TokenObj$1) => tokenObj is Number$1;
/**
 * 주어진 토큰 객체가 String 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 String 타입인지 여부
 */
declare const string$1: (tokenObj: TokenObj$1) => tokenObj is String$1;
/**
 * 주어진 토큰 객체가 Composite 타입인지 확인합니다.
 * Composite 타입은 key-value 형식의 토큰을 포함하는 토큰입니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Composite 타입인지 여부
 */
declare const composite$1: (tokenObj: TokenObj$1) => tokenObj is Composite$1;
/**
 * 주어진 토큰 객체가 StrokeStyle 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 StrokeStyle 타입인지 여부
 */
declare const strokeStyle$1: (tokenObj: TokenObj$1) => tokenObj is StrokeStyle$1;
/**
 * 주어진 토큰 객체가 Border 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Border 타입인지 여부
 */
declare const border$1: (tokenObj: TokenObj$1) => tokenObj is Border$1;
/**
 * 주어진 토큰 객체가 Transition 타입인지 확인합니다.
 * Transition 타입은 Duration, Delay, TimingFunction 세 가지 속성을 가지는 토큰입니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Transition 타입인지 여부
 */
declare const transition$1: (tokenObj: TokenObj$1) => tokenObj is Transition$1;
/**
 * 주어진 토큰 객체가 Shadow 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Shadow 타입인지 여부
 */
declare const shadow$1: (tokenObj: TokenObj$1) => tokenObj is Shadow$1;
/**
 * 주어진 토큰 객체가 Gradient 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Gradient 타입인지 여부
 */
declare const gradient$1: (tokenObj: TokenObj$1) => tokenObj is Gradient$1;
/**
 * 주어진 토큰 객체가 Typography 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Typography 타입인지 여부
 */
declare const typography$1: (tokenObj: TokenObj$1) => tokenObj is Typography$1;

declare namespace is {
  export { border$1 as border, color$1 as color, composite$1 as composite, cubicBezier$1 as cubicBezier, dimension$1 as dimension, duration$1 as duration, fontFamily$1 as fontFamily, fontWeight$1 as fontWeight, gradient$1 as gradient, number$1 as number, shadow$1 as shadow, string$1 as string, strokeStyle$1 as strokeStyle, transition$1 as transition, typography$1 as typography };
}

/**
 * Dimension의 유효성을 확인합니다.
 * @param tokenObj - Dimension TokenObj
 * @returns Dimension TokenObj의 유효성 여부
 * @throws "Dimension"에 대한 에러 메시지를 throw합니다.
 */
declare const dimension: (tokenObj: Dimension$1) => true;
/**
 * Color의 유효성을 확인합니다.
 * @param tokenObj - Color TokenObj
 * @returns Color TokenObj의 유효성 여부
 * @throws "Color"에 대한 에러 메시지를 throw합니다.
 */
declare const color: (tokenObj: Color$1) => true;
/**
 * FontFamily의 유효성을 확인합니다.
 * @param tokenObj - FontFamily TokenObj
 * @returns FontFamily TokenObj의 유효성 여부
 * @throws "FontFamily"에 대한 에러 메시지를 throw합니다.
 */
declare const fontFamily: (tokenObj: FontFamily$1) => true;
/**
 * FontWeight의 유효성을 확인합니다.
 * @param tokenObj - FontWeight TokenObj
 * @returns FontWeight TokenObj의 유효성 여부
 * @throws "FontWeight"에 대한 에러 메시지를 throw합니다.
 */
declare const fontWeight: (tokenObj: FontWeight$1) => true;
/**
 * Duration의 유효성을 확인합니다.
 * @param tokenObj - Duration TokenObj
 * @returns Duration TokenObj의 유효성 여부
 * @throws "Duration"에 대한 에러 메시지를 throw합니다.
 */
declare const duration: (tokenObj: Duration$1) => true;
/**
 * CubicBezier의 유효성을 확인합니다.
 * @param tokenObj - CubicBezier TokenObj
 * @returns CubicBezier TokenObj의 유효성 여부
 * @throws "CubicBezier"에 대한 에러 메시지를 throw합니다.
 */
declare const cubicBezier: (tokenObj: CubicBezier$1) => true;
/**
 * String의 유효성을 확인합니다.
 * @param tokenObj - String TokenObj
 * @returns String TokenObj의 유효성 여부
 * @throws "String"에 대한 에러 메시지를 throw합니다.
 */
declare const string: (tokenObj: String$1) => true;
/**
 * Number의 유효성을 확인합니다.
 * @param tokenObj - Number TokenObj
 * @returns Number TokenObj의 유효성 여부
 * @throws "Number"에 대한 에러 메시지를 throw합니다.
 */
declare const number: (tokenObj: Number$1) => true;
/**
 * Composite의 유효성을 확인합니다.
 * @param tokenObj - Composite TokenObj
 * @returns Composite TokenObj의 유효성 여부
 * @throws "Composite"에 대한 에러 메시지를 throw합니다.
 */
declare const composite: (tokenObj: Composite$1) => true;
/**
 * StrokeStyle의 유효성을 확인합니다.
 * @param tokenObj - StrokeStyle TokenObj
 * @returns StrokeStyle TokenObj의 유효성 여부
 * @throws "StrokeStyle"에 대한 에러 메시지를 throw합니다.
 */
declare const strokeStyle: (tokenObj: StrokeStyle$1) => true;
/**
 * 주어진 토큰 객체가 Border 타입인지 확인합니다.
 * Border 타입은 'width', 'style', 'color' 속성을 포함해야 합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Border 타입인지 여부
 * @throws "Border"에 대한 에러 메시지를 throw합니다.
 */
declare const border: (tokenObj: Border$1) => true;
/**
 * 주어진 토큰 객체가 Transition 타입인지 확인합니다.
 * Transition 타입은 'duration', 'timingFunction', 'delay' 속성을 포함해야 합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Transition 타입인지 여부
 * @throws "Transition"에 대한 에러 메시지를 throw합니다.
 */
declare const transition: (tokenObj: Transition$1) => true;
/**
 * 주어진 토큰 객체가 Shadow 타입인지 확인합니다.
 * Shadow 타입은 'offsetX', 'offsetY', 'blur', 'spread', 'color' 속성을 포함해야 합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Shadow 타입인지 여부
 * @throws "Shadow"에 대한 에러 메시지를 throw합니다.
 */
declare const shadow: (tokenObj: Shadow$1) => true;
/**
 * 주어진 토큰 객체가 Gradient 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Gradient 타입인지 여부
 * @example
 * {
 *   $type: "gradient",
 *   $value: [
 *     {
 *       color: "#ff0000",
 *       position: 0,
 *     },
 *     {
 *       color: "#00ff00",
 *       position: 100,
 *     },
 *   ],
 * }
 */
declare const gradient: (tokenObj: Gradient$1) => true;
/**
 * Typography 타입의 토큰을 확인합니다.
 * Typography 타입은 "fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing" 속성을 포함해야 합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Typography 타입인지 여부
 * @throws "Typography"에 대한 에러 메시지를 throw합니다.
 */
declare const typography: (tokenObj: Typography$1) => true;

/**
 * 주어진 토큰 경로가 토큰 내부에 중복으로 존재하는지 확인합니다.
 *
 * @param {Token | TokenGroup} token
 * @param {string} tokenRef
 * @returns {boolean}
 */
declare const duplicate: (token: Token | TokenGroup$1, tokenRef: string) => boolean;

declare const index$1_border: typeof border;
declare const index$1_color: typeof color;
declare const index$1_composite: typeof composite;
declare const index$1_cubicBezier: typeof cubicBezier;
declare const index$1_dimension: typeof dimension;
declare const index$1_duplicate: typeof duplicate;
declare const index$1_duration: typeof duration;
declare const index$1_fontFamily: typeof fontFamily;
declare const index$1_fontWeight: typeof fontWeight;
declare const index$1_gradient: typeof gradient;
declare const index$1_is: typeof is;
declare const index$1_number: typeof number;
declare const index$1_shadow: typeof shadow;
declare const index$1_string: typeof string;
declare const index$1_strokeStyle: typeof strokeStyle;
declare const index$1_transition: typeof transition;
declare const index$1_typography: typeof typography;
declare namespace index$1 {
  export { index$1_border as border, index$1_color as color, index$1_composite as composite, index$1_cubicBezier as cubicBezier, index$1_dimension as dimension, index$1_duplicate as duplicate, index$1_duration as duration, index$1_fontFamily as fontFamily, index$1_fontWeight as fontWeight, index$1_gradient as gradient, index$1_is as is, index$1_number as number, index$1_shadow as shadow, index$1_string as string, index$1_strokeStyle as strokeStyle, index$1_transition as transition, index$1_typography as typography };
}

declare namespace index {
  export { index$2 as format, index$1 as token };
}

declare const parse: (base: Token, refTokens: Token[]) => Token;

interface Transformer<UC extends TokenResult, Ref extends TokenResult> {
    findUseCases: (base: Token, refTokens: Token[]) => UC[];
    transform: (useCase: UC, referred: Ref) => TokenResult[];
}

/**
 * 주어진 토큰(base)에 대한 참조 토큰(refTokens)을 찾아 대체합니다.
 *
 * @param base - 대체할 토큰
 * @param refTokens - 참조 토큰을 찾을 토큰 목록
 * @returns 대체된 토큰
 */
declare const transform: <T extends Transformer<any, any>>(base: Token, refTokens: Token[], transformers?: T[]) => Token;

type UseCaseType$3 = [string[], TokenObj$1];
type ReferredType$3 = [string[], TokenObj$1];
declare const _default$3: Transformer<UseCaseType$3, ReferredType$3>;

type UseCaseType$2 = [string[], TokenObj$1];
type ReferredType$2 = [string[], TokenGroup$1];
declare const _default$2: Transformer<UseCaseType$2, ReferredType$2>;

type UseCaseType$1 = [string[], TokenGroup$1];
type ReferredType$1 = [string[], TokenObj$1];
declare const _default$1: Transformer<UseCaseType$1, ReferredType$1>;

type UseCaseType = [string[], TokenGroup$1];
type ReferredType = [string[], TokenGroup$1];
declare const _default: Transformer<UseCaseType, ReferredType>;

export { type Border, type Color, type Composite, type CubicBezier, type Dimension, type Duration, type FontFamily, type FontWeight, type Gradient, type Number, type Shadow, type String, type StrokeStyle, Token, type TokenGroup, type TokenObj, type TokenRef, index$4 as Transformers, type Transition, index$3 as TypeCheckers, type Typography, index as Validate, findTokenRef, generateDesignToken, hasTokenRef, isTokenObj, isTokenRef, mapArray, mapObject, parse, transform, _default$3 as useCase1, _default$2 as useCase2, _default$1 as useCase3, _default as useCase4 };
