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
type TokenTypes = TokenObj["$type"];
/**
 * @see https://tr.designtokens.org/format/#groups
 */
type TokenGroup = {
    [key: string | `$${string}`]: any | TokenGroup;
};

type TokenResult = [string[], TokenGroup | TokenObj];
type Iteratee = (props: string[], token: TokenGroup, self: Token) => boolean;
declare class Token {
    #private;
    constructor(token: TokenGroup);
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
    add(props: string[], token: TokenGroup | TokenObj): void;
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
    map(callback: (props: string[], token: TokenGroup) => TokenResult): TokenResult[];
    getToken(): TokenGroup;
    /**
     * @description 주어진 토큰을 순회하여 주어진 콜백을 실행합니다.
     * @param callback 토큰을 순회하는 콜백. 첫 번째 인자로 토큰의 경로를, 두 번째 인자로 토큰을 받는다.
     */
    forEach(callback: Iteratee): void;
}

declare const parse: (base: Token, refTokens: Token[]) => Token;

/**
 * @description
 * 주어진 기본 토큰과 참조 토큰을 통해 구조 변환 -> 파싱 과정을 거쳐 토큰를 반환한다.
 *
 * @param {TokenGroup} base - 기본 토큰
 * @param {TokenGroup[]} refTokens - 참조 토큰
 * @returns {TokenGroup} - 처리된 토큰
 */
declare const generateDesignToken: (base: TokenGroup, refTokens: TokenGroup[]) => TokenGroup;

interface Transformer<UC extends [string[], TokenGroup | TokenObj], Ref extends [string[], TokenGroup | TokenObj]> {
    findUseCases: (base: Token, refTokens: Token[]) => UC[];
    transform: (useCase: UC, referred: Ref) => [string[], TokenObj][];
}

declare const useCase1: Transformer<[string[], TokenObj], [string[], TokenObj]>;
declare const useCase2: Transformer<[
    string[],
    TokenObj
], [
    string[],
    TokenGroup
]>;
declare const useCase3: Transformer<[
    string[],
    TokenGroup
], [
    string[],
    TokenObj
]>;
declare const useCase4: Transformer<[
    string[],
    TokenGroup
], [
    string[],
    TokenGroup
]>;

/**
 * 주어진 토큰 객체가 dimension 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 dimension 타입인지 여부
 */
declare const isDimensionToken: (tokenObj: TokenObj) => tokenObj is Dimension;
/**
 * 주어진 토큰 객체가 Color 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Color 타입인지 여부
 */
declare const isColorToken: (tokenObj: TokenObj) => tokenObj is Color;
/**
 * 주어진 토큰 객체가 FontFamily 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 FontFamily 타입인지 여부
 */
declare const isFontFamilyToken: (tokenObj: TokenObj) => tokenObj is FontFamily;
/**
 * 주어진 토큰 객체가 FontWeight 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 FontWeight 타입인지 여부
 */
declare const isFontWeightToken: (tokenObj: TokenObj) => tokenObj is FontWeight;
/**
 * 주어진 토큰 객체가 Duration 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Duration 타입인지 여부
 */
declare const isDurationToken: (tokenObj: TokenObj) => tokenObj is Duration;
/**
 * 주어진 토큰 객체가 CubicBezier 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 CubicBezier 타입인지 여부
 */
declare const isCubicBezierToken: (tokenObj: TokenObj) => tokenObj is CubicBezier;
/**
 * 주어진 토큰 객체가 Number 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Number 타입인지 여부
 */
declare const isNumberToken: (tokenObj: TokenObj) => tokenObj is Number;
/**
 * 주어진 토큰 객체가 String 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 String 타입인지 여부
 */
declare const isStringToken: (tokenObj: TokenObj) => tokenObj is String;
/**
 * 주어진 토큰 객체가 Composite 타입인지 확인합니다.
 * Composite 타입은 key-value 형식의 토큰을 포함하는 토큰입니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Composite 타입인지 여부
 */
declare const isCompositeToken: (tokenObj: TokenObj) => tokenObj is Composite;
/**
 * 주어진 토큰 객체가 StrokeStyle 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 StrokeStyle 타입인지 여부
 */
declare const isStrokeStyleToken: (tokenObj: TokenObj) => tokenObj is StrokeStyle;
/**
 * 주어진 토큰 객체가 Border 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Border 타입인지 여부
 */
declare const isBorderToken: (tokenObj: TokenObj) => tokenObj is Border;
/**
 * 주어진 토큰 객체가 Transition 타입인지 확인합니다.
 * Transition 타입은 Duration, Delay, TimingFunction 세 가지 속성을 가지는 토큰입니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Transition 타입인지 여부
 */
declare const isTransitionToken: (tokenObj: TokenObj) => tokenObj is Transition;
/**
 * 주어진 토큰 객체가 Shadow 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Shadow 타입인지 여부
 */
declare const isShadowToken: (tokenObj: TokenObj) => tokenObj is Shadow;
/**
 * 주어진 토큰 객체가 Gradient 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Gradient 타입인지 여부
 */
declare const isGradientToken: (tokenObj: TokenObj) => tokenObj is Gradient;
/**
 * 주어진 토큰 객체가 Typography 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Typography 타입인지 여부
 */
declare const isTypographyToken: (tokenObj: TokenObj) => tokenObj is Typography;
/**
 * Dimension의 유효성을 확인합니다.
 * @param tokenObj - Dimension TokenObj
 * @returns Dimension TokenObj의 유효성 여부
 * @throws "Dimension"에 대한 에러 메시지를 throw합니다.
 */
declare const validateDimensionToken: (tokenObj: Dimension) => true;
/**
 * Color의 유효성을 확인합니다.
 * @param tokenObj - Color TokenObj
 * @returns Color TokenObj의 유효성 여부
 * @throws "Color"에 대한 에러 메시지를 throw합니다.
 */
declare const validateColorToken: (tokenObj: Color) => true;
/**
 * FontFamily의 유효성을 확인합니다.
 * @param tokenObj - FontFamily TokenObj
 * @returns FontFamily TokenObj의 유효성 여부
 * @throws "FontFamily"에 대한 에러 메시지를 throw합니다.
 */
declare const validateFontFamilyToken: (tokenObj: FontFamily) => true;
/**
 * FontWeight의 유효성을 확인합니다.
 * @param tokenObj - FontWeight TokenObj
 * @returns FontWeight TokenObj의 유효성 여부
 * @throws "FontWeight"에 대한 에러 메시지를 throw합니다.
 */
declare const validateFontWeightToken: (tokenObj: FontWeight) => true;
/**
 * Duration의 유효성을 확인합니다.
 * @param tokenObj - Duration TokenObj
 * @returns Duration TokenObj의 유효성 여부
 * @throws "Duration"에 대한 에러 메시지를 throw합니다.
 */
declare const validateDurationToken: (tokenObj: Duration) => true;
/**
 * CubicBezier의 유효성을 확인합니다.
 * @param tokenObj - CubicBezier TokenObj
 * @returns CubicBezier TokenObj의 유효성 여부
 * @throws "CubicBezier"에 대한 에러 메시지를 throw합니다.
 */
declare const validateCubicBezierToken: (tokenObj: CubicBezier) => true;
/**
 * String의 유효성을 확인합니다.
 * @param tokenObj - String TokenObj
 * @returns String TokenObj의 유효성 여부
 * @throws "String"에 대한 에러 메시지를 throw합니다.
 */
declare const validateStringToken: (tokenObj: String) => true;
/**
 * Number의 유효성을 확인합니다.
 * @param tokenObj - Number TokenObj
 * @returns Number TokenObj의 유효성 여부
 * @throws "Number"에 대한 에러 메시지를 throw합니다.
 */
declare const validateNumberToken: (tokenObj: Number) => true;
/**
 * Composite의 유효성을 확인합니다.
 * @param tokenObj - Composite TokenObj
 * @returns Composite TokenObj의 유효성 여부
 * @throws "Composite"에 대한 에러 메시지를 throw합니다.
 */
declare const validateCompositeToken: (tokenObj: Composite) => true;
/**
 * StrokeStyle의 유효성을 확인합니다.
 * @param tokenObj - StrokeStyle TokenObj
 * @returns StrokeStyle TokenObj의 유효성 여부
 * @throws "StrokeStyle"에 대한 에러 메시지를 throw합니다.
 */
declare const validateStrokeStyleToken: (tokenObj: StrokeStyle) => true;
/**
 * 주어진 토큰 객체가 Border 타입인지 확인합니다.
 * Border 타입은 'width', 'style', 'color' 속성을 포함해야 합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Border 타입인지 여부
 * @throws "Border"에 대한 에러 메시지를 throw합니다.
 */
declare const validateBorderToken: (tokenObj: Border) => true;
/**
 * 주어진 토큰 객체가 Transition 타입인지 확인합니다.
 * Transition 타입은 'duration', 'timingFunction', 'delay' 속성을 포함해야 합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Transition 타입인지 여부
 * @throws "Transition"에 대한 에러 메시지를 throw합니다.
 */
declare const validateTransitionToken: (tokenObj: Transition) => true;
/**
 * 주어진 토큰 객체가 Shadow 타입인지 확인합니다.
 * Shadow 타입은 'offsetX', 'offsetY', 'blur', 'spread', 'color' 속성을 포함해야 합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Shadow 타입인지 여부
 * @throws "Shadow"에 대한 에러 메시지를 throw합니다.
 */
declare const validateShadowToken: (tokenObj: Shadow) => true;
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
declare const validateGradientToken: (tokenObj: Gradient) => true;
/**
 * Typography 타입의 토큰을 확인합니다.
 * Typography 타입은 "fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing" 속성을 포함해야 합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Typography 타입인지 여부
 * @throws "Typography"에 대한 에러 메시지를 throw합니다.
 */
declare const validateTypographyToken: (tokenObj: Typography) => true;
type Validator<T extends string> = {
    [key in T]: {
        is: (token: TokenObj) => token is TokenObj & {
            $type: key;
        };
        validate: <P extends TokenObj & {
            $type: key;
        }>(token: P) => true;
    };
};
declare const validate: <T extends TokenTypes & string>(token: Token | TokenGroup, customValidators?: Validator<T>) => void;

/**
 * 주어진 객체가 TokenObj 타입인지 확인합니다.
 * TokenObj는 `value` 속성을 가져야 합니다.
 * @param token - 확인할 객체
 * @returns 주어진 객체가 TokenObj 타입인지 여부
 */
declare const isTokenObj: (token: object) => token is TokenObj;

/**
 * 주어진 문자열에 토큰 참조가 포함되어 있는지 확인하고
 * 토큰 참조를 추출하여 반환합니다.
 *
 * @param value - 확인할 문자열
 * @returns 토큰 참조를 추출하여 반환합니다. 없으면 null을 반환합니다.
 */
declare const findTokenRef: (value: string) => RegExpMatchArray | null;
/**
 * 주어진 문자열에 토큰 참조값이 포함되어 있는지 확인합니다.
 *
 * @param tokenRef - 확인할 문자열
 * @returns 토큰 참조 문자열이 포함되어 있으면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
declare const hasTokenRef: (str: string) => boolean;
/**
 * 주어진 문자열이 토큰 참조값인지 확인합니다.
 *
 * @param {string} tokenRef - 토큰 참조 문자열
 * @returns {boolean} 토큰 참조 문자열이면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
declare const isTokenRef: (tokenRef: string) => boolean;
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
/**
 * 주어진 토큰 참조 문자열에 포함된 중괄호를 삭제하여 반환합니다.
 * @param tokenRef - 토큰 참조 문자열
 * @returns 중괄호를 삭제한 토큰 참조 문자열
 */
declare const takeOffBracketFromTokenRef: (tokenRef: string) => string;

/**
 * 주어진 객체가 토큰 객체의 필수 속성을 모두 포함하고 있는지 확인합니다.
 * @param {object} value - 확인할 객체
 * @returns 주어진 객체가 토큰 객체의 필수 속성을 모두 포함하고 있으면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
declare const shouldHaveRequiredProp: (value: {}) => boolean;
/**
 * @description 주어진 객체의 속성명이 모두 $로 시작하는지 확인합니다.
 * @param {object} value - 확인할 객체
 * @returns 주어진 객체의 모든 속성명이 $로 시작하면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
declare const shouldHaveDollarPrefix: (value: {}) => boolean;
/**
 * @description 주어진 객체의 속셩명 중 하나라도 $를 prefix로 가지고 있지 않은 속성명이 있는지 확인합니다.
 * @param {object} value - 확인할 객체
 * @returns 주어진 객체의 속셩명 중 하나라도 $를 prefix로 가지고 있지 않으면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
declare const shouldNotHaveDollarPrefix: (value: {}) => boolean;
/**
 * @description 주어진 문자열이 토큰 참조값만 포함되어 있는지 확인한다.
 * @param {string} tokenRef
 * @returns {boolean} 토큰 참조가 포함된 문자열이면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
declare const shouldBeOnlyTokenRef: (tokenRef: string) => boolean;

export { type Border, type Color, type Composite, type CubicBezier, type Dimension, type Duration, type FontFamily, type FontWeight, type Gradient, type Number, type Shadow, type String, type StrokeStyle, Token, type TokenGroup, type TokenObj, type TokenTypes, type Transition, type Typography, findTokenRef, fromTokenRef, generateDesignToken, hasTokenRef, isBorderToken, isColorToken, isCompositeToken, isCubicBezierToken, isDimensionToken, isDurationToken, isFontFamilyToken, isFontWeightToken, isGradientToken, isNumberToken, isShadowToken, isStringToken, isStrokeStyleToken, isTokenObj, isTokenRef, isTransitionToken, isTypographyToken, parse, shouldBeOnlyTokenRef, shouldHaveDollarPrefix, shouldHaveRequiredProp, shouldNotHaveDollarPrefix, takeOffBracketFromTokenRef, toTokenRef, useCase1, useCase2, useCase3, useCase4, validate, validateBorderToken, validateColorToken, validateCompositeToken, validateCubicBezierToken, validateDimensionToken, validateDurationToken, validateFontFamilyToken, validateFontWeightToken, validateGradientToken, validateNumberToken, validateShadowToken, validateStringToken, validateStrokeStyleToken, validateTransitionToken, validateTypographyToken };
