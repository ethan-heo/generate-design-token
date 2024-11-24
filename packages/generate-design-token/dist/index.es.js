const isTokenObj = (token) => {
    return shouldHaveRequiredProp(token);
};

/**
 * 주어진 문자열이 토큰 참조값인지 확인합니다.
 *
 * @param {string} tokenRef - 토큰 참조 문자열
 * @returns {boolean} 토큰 참조 문자열이면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
const isTokenRef = (tokenRef) => {
    if (tokenRef.includes("{$value}")) {
        return false;
    }
    return shouldBeOnlyTokenRef(tokenRef);
};

const TOKEN_REF_REGEXP = /\{([^{}]+)\}/;

const hasTokenRef = (tokenRef) => {
    return !!tokenRef.match(TOKEN_REF_REGEXP);
};

/**
 * 주어진 객체의 모든 값을 주어진 콜백을 적용하여 반환합니다.
 *
 * @param obj - 처리할 객체
 * @param callback - 처리할 콜백. 첫 번째 인자로 값, 두 번째 인자로 키를 받습니다.
 * @returns 주어진 콜백을 적용한 결과를 반환합니다.
 */
const mapObject = (obj, callback) => {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, callback(value)]));
};

/**
 * 주어진 배열을 순회하여 주어진 콜백을 적용하고, 그 결과를 반환하는 함수.
 *
 * @param arr - 순회할 배열.
 * @param callback - 순회할 때 적용할 콜백. 첫 번째 인자로 배열의 요소를 받는다.
 * @returns 주어진 콜백을 적용한 결과를 반환하는 배열.
 */
const mapArray = (arr, callback) => {
    return arr.map(callback);
};

/**
 * 주어진 문자열에 토큰 참조가 포함되어 있는지 확인하고
 * 토큰 참조를 추출하여 반환합니다.
 *
 * @param value - 확인할 문자열
 * @returns 토큰 참조를 추출하여 반환합니다. 없으면 null을 반환합니다.
 */
const findTokenRef = (value) => {
    return value.match(TOKEN_REF_REGEXP);
};

/**
 * 주어진 토큰 경로를 문자열로 변환하여 반환합니다.
 * @param props - 토큰 경로
 * @returns 토큰 경로를 문자열로 변환한 결과
 */
const toTokenRef = (props) => {
    return props.join(".");
};

/**
 * 주어진 토큰 참조 문자열을 토큰 경로의 배열로 변환합니다.
 *
 * @param tokenRef - 토큰 참조 문자열
 * @returns 토큰 경로의 배열
 */
const fromTokenRef = (tokenRef) => {
    return tokenRef.split(".");
};

const takeOffBracketFromTokenRef = (tokenRef) => {
    return tokenRef.replace(/[\{\}]/g, "");
};

var index$4 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    fromTokenRef: fromTokenRef,
    takeOffBracketFromTokenRef: takeOffBracketFromTokenRef,
    toTokenRef: toTokenRef
});

const getType = (value) => {
    return Object.prototype.toString
        .call(value)
        .slice(8, -1)
        .toLowerCase();
};

const isObject = (value) => {
    return getType(value) === "object";
};

const isArray = (value) => {
    return getType(value) === "array";
};

const isString = (value) => {
    return getType(value) === "string";
};

const isNumber = (value) => {
    return getType(value) === "number";
};

const isUndefined = (value) => {
    return getType(value) === "undefined";
};

var index$3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getType: getType,
    isArray: isArray,
    isNumber: isNumber,
    isObject: isObject,
    isString: isString,
    isUndefined: isUndefined
});

/**
 * @description 토큰 객체의 필수 속성이 포함되어 있는지 확인한다
 * @returns
 */
const shouldHaveRequiredProp = (value) => {
    const MUST_HAVE_PROPERTIES = ["$value"];
    return MUST_HAVE_PROPERTIES.every((prop) => prop in value);
};
/**
 * @description 객체 속성 모두 이름에 $를 prefix로 가지고 있는지 확인한다
 * @returns
 */
const shouldHaveDollarPrefix = (value) => {
    let result = true;
    for (const prop in value) {
        if (!prop.startsWith("$")) {
            result = false;
            break;
        }
    }
    return result;
};
/**
 * @description 객체 속성 모두 이름에 $를 prefix로 가지고 있지 않은지 확인한다
 * @returns
 */
const shouldNotHaveDollarPrefix = (value) => {
    let result = true;
    for (const prop in value) {
        if (prop.startsWith("$")) {
            result = false;
            break;
        }
    }
    return result;
};
/**
 * @description 주어진 문자열이 토큰 참조값만 포함되어 있는지 확인한다.
 * @param {string} tokenRef
 * @returns {boolean} 토큰 참조가 포함된 문자열이면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
const shouldBeOnlyTokenRef = (tokenRef) => {
    const matchedTokenRef = tokenRef.match(TOKEN_REF_REGEXP);
    if (!matchedTokenRef) {
        return false;
    }
    return matchedTokenRef[0] === tokenRef;
};

var index$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    shouldBeOnlyTokenRef: shouldBeOnlyTokenRef,
    shouldHaveDollarPrefix: shouldHaveDollarPrefix,
    shouldHaveRequiredProp: shouldHaveRequiredProp,
    shouldNotHaveDollarPrefix: shouldNotHaveDollarPrefix
});

/**
 * 주어진 토큰 객체가 dimension 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 dimension 타입인지 여부
 */
const dimension$1 = (tokenObj) => tokenObj.$type === "dimension";
/**
 * 주어진 토큰 객체가 Color 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Color 타입인지 여부
 */
const color$1 = (tokenObj) => tokenObj.$type === "color";
/**
 * 주어진 토큰 객체가 FontFamily 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 FontFamily 타입인지 여부
 */
const fontFamily$1 = (tokenObj) => tokenObj.$type === "fontFamily";
/**
 * 주어진 토큰 객체가 FontWeight 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 FontWeight 타입인지 여부
 */
const fontWeight$1 = (tokenObj) => tokenObj.$type === "fontWeight";
/**
 * 주어진 토큰 객체가 Duration 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Duration 타입인지 여부
 */
const duration$1 = (tokenObj) => tokenObj.$type === "duration";
/**
 * 주어진 토큰 객체가 CubicBezier 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 CubicBezier 타입인지 여부
 */
const cubicBezier$1 = (tokenObj) => tokenObj.$type === "cubicBezier";
/**
 * 주어진 토큰 객체가 Number 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Number 타입인지 여부
 */
const number$1 = (tokenObj) => tokenObj.$type === "number";
/**
 * 주어진 토큰 객체가 String 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 String 타입인지 여부
 */
const string$1 = (tokenObj) => tokenObj.$type === "string";
/**
 * 주어진 토큰 객체가 Composite 타입인지 확인합니다.
 * Composite 타입은 key-value 형식의 토큰을 포함하는 토큰입니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Composite 타입인지 여부
 */
const composite$1 = (tokenObj) => tokenObj.$type === "composite";
/**
 * 주어진 토큰 객체가 StrokeStyle 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 StrokeStyle 타입인지 여부
 */
const strokeStyle$1 = (tokenObj) => tokenObj.$type === "strokeStyle";
/**
 * 주어진 토큰 객체가 Border 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Border 타입인지 여부
 */
const border$1 = (tokenObj) => tokenObj.$type === "border";
/**
 * 주어진 토큰 객체가 Transition 타입인지 확인합니다.
 * Transition 타입은 Duration, Delay, TimingFunction 세 가지 속성을 가지는 토큰입니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Transition 타입인지 여부
 */
const transition$1 = (tokenObj) => tokenObj.$type === "transition";
/**
 * 주어진 토큰 객체가 Shadow 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Shadow 타입인지 여부
 */
const shadow$1 = (tokenObj) => tokenObj.$type === "shadow";
/**
 * 주어진 토큰 객체가 Gradient 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Gradient 타입인지 여부
 */
const gradient$1 = (tokenObj) => tokenObj.$type === "gradient";
/**
 * 주어진 토큰 객체가 Typography 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Typography 타입인지 여부
 */
const typography$1 = (tokenObj) => tokenObj.$type === "typography";

var is = /*#__PURE__*/Object.freeze({
    __proto__: null,
    border: border$1,
    color: color$1,
    composite: composite$1,
    cubicBezier: cubicBezier$1,
    dimension: dimension$1,
    duration: duration$1,
    fontFamily: fontFamily$1,
    fontWeight: fontWeight$1,
    gradient: gradient$1,
    number: number$1,
    shadow: shadow$1,
    string: string$1,
    strokeStyle: strokeStyle$1,
    transition: transition$1,
    typography: typography$1
});

const HEX_REGEXP = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
const throwTypeError = (prefix) => (msg) => {
    throw new TypeError(`[${prefix}] ${msg}`);
};
const shouldHaveRequiredProps = (value, required, throwError) => {
    const props = Object.keys(value);
    if (!required.every((v) => props.includes(v))) {
        throwError(`${required.join(",")}은 필수 속성입니다.`);
    }
};
const notAllowedProps = (value, required, throwError) => {
    const props = Object.keys(value);
    if (!props.every((v) => required.includes(v))) {
        throwError(`${required.join(",")} 속성 외 사용된 속성이 있습니다.`);
    }
};
const validateTokenRefValue = (value, throwError) => {
    if (!isTokenRef(value)) {
        throwError(`토큰 참조값 이외에 다른 문자열은 사용할 수 없습니다.`);
    }
};
const validateDimensionValue = (value, throwError) => {
    const UNITS = ["px", "rem"];
    if (isString(value)) {
        if (!UNITS.some((unit) => value.endsWith(unit))) {
            throwError(`value의 단위는 [${UNITS.join(",")}]이어야 핕인.`);
        }
    }
    if (isObject(value)) {
        if (!isNumber(value.value)) {
            throwError(`value의 값은 number 타입이어야 합니다.`);
        }
        if (!UNITS.includes(value.unit)) {
            throwError(`unit의 값은 [${UNITS.join(",")}]이어야 합니다.`);
        }
    }
};
const validateColorValue = (value, throwError) => {
    if (!shouldBeOnlyTokenRef(value) && !HEX_REGEXP.test(value)) {
        throwError(`색상값은 토큰 참조값 또는 24 BIT RGB 또는 24 + 8 BIT RGBA 형식의 HEX값이어야 합니다.`);
    }
};
const validateFontFamilyValue = (value, throwError) => {
    if (isArray(value)) {
        if (!value.some((v) => !isString(v))) {
            throwError(`요소의 값은 string 형식이어야 합니다.`);
        }
    }
};
const validateFontWeightValue = (value, throwError) => {
    const ACCEPTABLE_FONT_WEIGHT_VALUES = [
        100,
        200,
        300,
        400,
        500,
        600,
        700,
        800,
        900,
        1000,
        "thin",
        "hairline",
        "extra-light",
        "ultra-light",
        "light",
        "normal",
        "regular",
        "book",
        "medium",
        "semi-bold",
        "demi-bold",
        "bold",
        "extra-bold",
        "ultra-bold",
        "black",
        "heavy",
        "extra-black",
        "ultra-black",
    ];
    if (!ACCEPTABLE_FONT_WEIGHT_VALUES.includes(value)) {
        throwError(`$value 값은 [${ACCEPTABLE_FONT_WEIGHT_VALUES.join(",")}] 중 하나여야 합니다.`);
    }
};
const validateDurationValue = (value, throwError) => {
    const UNITS = ["ms", "s"];
    if (!isNumber(value.value)) {
        throwError(`value값은 number 타입이어야 합니다.`);
    }
    if (!UNITS.includes(value.unit)) {
        throwError(`unit의 값은 [${UNITS.join(",")}] 중 하나여야 합니다.`);
    }
};
const validateCubicBezierValue = (value, throwError) => {
    if (value.some((v) => !isNumber(v))) {
        throwError(`요소의 값은 number 형식이어야 합니다.`);
    }
    if (value.length !== 4) {
        throwError(`value의 길이는 4개이어야 합니다.`);
    }
};
/**
 * Dimension의 유효성을 확인합니다.
 * @param tokenObj - Dimension TokenObj
 * @returns Dimension TokenObj의 유효성 여부
 * @throws "Dimension"에 대한 에러 메시지를 throw합니다.
 */
const dimension = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("Dimension");
    if (!isString($value) && !isObject($value)) {
        throwError(`허용되지 않는 형식입니다.`);
    }
    if (isString($value)) {
        if (hasTokenRef($value)) {
            validateTokenRefValue($value, throwError);
        }
        else {
            validateDimensionValue($value, throwError);
        }
    }
    else {
        validateDimensionValue($value, throwError);
    }
    return true;
};
/**
 * Color의 유효성을 확인합니다.
 * @param tokenObj - Color TokenObj
 * @returns Color TokenObj의 유효성 여부
 * @throws "Color"에 대한 에러 메시지를 throw합니다.
 */
const color = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("Color");
    if (!isString($value)) {
        throwError(`허용되지 않는 형식입니다.`);
    }
    if (hasTokenRef($value)) {
        validateTokenRefValue($value, throwError);
    }
    else {
        validateColorValue($value, throwError);
    }
    return true;
};
/**
 * FontFamily의 유효성을 확인합니다.
 * @param tokenObj - FontFamily TokenObj
 * @returns FontFamily TokenObj의 유효성 여부
 * @throws "FontFamily"에 대한 에러 메시지를 throw합니다.
 */
const fontFamily = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("FontFamily");
    if (!isString($value) && !isArray($value)) {
        throwError(`허용되지 않는 형식입니다.`);
    }
    if (isString($value) && hasTokenRef($value)) {
        validateTokenRefValue($value, throwError);
    }
    else {
        validateFontFamilyValue($value, throwError);
    }
    return true;
};
/**
 * FontWeight의 유효성을 확인합니다.
 * @param tokenObj - FontWeight TokenObj
 * @returns FontWeight TokenObj의 유효성 여부
 * @throws "FontWeight"에 대한 에러 메시지를 throw합니다.
 */
const fontWeight = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("FontWeight");
    if (!isString($value) && !isNumber($value)) {
        throwError(`허용되지 않는 형식입니다.`);
    }
    if (isString($value) && hasTokenRef($value)) {
        validateTokenRefValue($value, throwError);
    }
    else {
        validateFontWeightValue($value, throwError);
    }
    return true;
};
/**
 * Duration의 유효성을 확인합니다.
 * @param tokenObj - Duration TokenObj
 * @returns Duration TokenObj의 유효성 여부
 * @throws "Duration"에 대한 에러 메시지를 throw합니다.
 */
const duration = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("Duration");
    if (!isObject($value) && !isObject($value)) {
        throwError(`허용되지 않는 형식입니다.`);
    }
    if (isString($value)) {
        validateTokenRefValue($value, throwError);
    }
    else {
        validateDurationValue($value, throwError);
    }
    return true;
};
/**
 * CubicBezier의 유효성을 확인합니다.
 * @param tokenObj - CubicBezier TokenObj
 * @returns CubicBezier TokenObj의 유효성 여부
 * @throws "CubicBezier"에 대한 에러 메시지를 throw합니다.
 */
const cubicBezier = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("CubicBezier");
    if (!isString($value) && !isArray($value)) {
        throwError(`허용되지 않는 형식입니다.`);
    }
    if (isString($value)) {
        if (hasTokenRef($value)) {
            validateTokenRefValue($value, throwError);
        }
    }
    else {
        validateCubicBezierValue($value, throwError);
    }
    return true;
};
/**
 * String의 유효성을 확인합니다.
 * @param tokenObj - String TokenObj
 * @returns String TokenObj의 유효성 여부
 * @throws "String"에 대한 에러 메시지를 throw합니다.
 */
const string = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("String");
    if (!isString($value)) {
        throwError(`허용되지 않는 형식입니다.`);
    }
    if (hasTokenRef($value)) {
        validateTokenRefValue($value, throwError);
    }
    return true;
};
/**
 * Number의 유효성을 확인합니다.
 * @param tokenObj - Number TokenObj
 * @returns Number TokenObj의 유효성 여부
 * @throws "Number"에 대한 에러 메시지를 throw합니다.
 */
const number = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("Number");
    if (isString($value)) {
        validateTokenRefValue($value, throwError);
    }
    else {
        if (!isNumber($value)) {
            throwError(`허용되지 않는 형식입니다.`);
        }
    }
    return true;
};
/**
 * Composite의 유효성을 확인합니다.
 * @param tokenObj - Composite TokenObj
 * @returns Composite TokenObj의 유효성 여부
 * @throws "Composite"에 대한 에러 메시지를 throw합니다.
 */
const composite = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("Composite");
    if (!isObject($value)) {
        throwError(`허용되지 않는 형식입니다.`);
    }
    return true;
};
/**
 * StrokeStyle의 유효성을 확인합니다.
 * @param tokenObj - StrokeStyle TokenObj
 * @returns StrokeStyle TokenObj의 유효성 여부
 * @throws "StrokeStyle"에 대한 에러 메시지를 throw합니다.
 */
const strokeStyle = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("StrokeStyle");
    if (!isString($value) && !isObject($value)) {
        throwError(`허용되지 않는 형식입니다.`);
    }
    if (isString($value)) {
        const ACCEPTABLE_VALUE = [
            "solid",
            "dashed",
            "dotted",
            "double",
            "groove",
            "ridge",
            "outset",
            "inset",
        ];
        if (!ACCEPTABLE_VALUE.includes($value)) {
            throwError(`$value 값은 [${ACCEPTABLE_VALUE.join(",")}] 중 하나여야 합니다.`);
        }
        if (hasTokenRef($value)) {
            validateTokenRefValue($value, throwError);
        }
    }
    if (isObject($value)) {
        const REQUIRED_PROPS = ["dashArray", "lineCap"];
        shouldHaveRequiredProps($value, REQUIRED_PROPS, throwError);
        notAllowedProps($value, REQUIRED_PROPS, throwError);
        if (isArray($value.dashArray)) {
            for (const value of $value.dashArray) {
                if (isObject(value)) {
                    validateDimensionValue(value, throwError);
                }
                else {
                    if (!isString(value)) {
                        throwError(`dashArray 요소는 Dimension 또는 문자열 형식이어야 합니다.`);
                    }
                    else {
                        validateTokenRefValue(value, throwError);
                    }
                }
            }
        }
        else {
            throwError(`dashArray는 배열 타입이어야 합니다.`);
        }
        if (isString($value.lineCap)) {
            const ACCEPTABLE_VALUE = ["butt", "round", "square"];
            if (!ACCEPTABLE_VALUE.includes($value.lineCap)) {
                throwError(`lineCap 값은 [${ACCEPTABLE_VALUE.join(",")}] 중 하나여야 합니다.`);
            }
        }
    }
    return true;
};
/**
 * 주어진 토큰 객체가 Border 타입인지 확인합니다.
 * Border 타입은 'width', 'style', 'color' 속성을 포함해야 합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Border 타입인지 여부
 * @throws "Border"에 대한 에러 메시지를 throw합니다.
 */
const border = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("Border");
    if (!isString($value) && !isObject($value)) {
        throwError(`허용되지 않는 형식입니다.`);
    }
    if (isString($value)) {
        validateTokenRefValue($value, throwError);
    }
    else {
        const ACCEPTABLE_PROPS = ["width", "style", "color"];
        shouldHaveRequiredProps($value, ACCEPTABLE_PROPS, throwError);
        notAllowedProps($value, ACCEPTABLE_PROPS, throwError);
        if (isObject($value.width)) {
            validateDimensionValue($value.width, throwError);
        }
        else {
            if (!isString($value.width)) {
                throwError(`width는 Dimension 또는 문자열 형식이어야 합니다.`);
            }
            else {
                validateTokenRefValue($value.width, throwError);
            }
        }
        if (!isString($value.style)) {
            throwError(`style는 문자열 형식이어야 합니다.`);
        }
        else {
            if (hasTokenRef($value.style)) {
                validateTokenRefValue($value.style, throwError);
            }
        }
        if (!isString($value.color)) {
            throwError(`color는 문자열 형식이어야 합니다.`);
        }
        else {
            if (hasTokenRef($value.color)) {
                validateTokenRefValue($value.color, throwError);
            }
        }
    }
    return true;
};
/**
 * 주어진 토큰 객체가 Transition 타입인지 확인합니다.
 * Transition 타입은 'duration', 'timingFunction', 'delay' 속성을 포함해야 합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Transition 타입인지 여부
 * @throws "Transition"에 대한 에러 메시지를 throw합니다.
 */
const transition = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("Transition");
    if (!isString($value) && !isObject($value)) {
        throwError(`허용되지 않는 형식입니다.`);
    }
    if (isString($value)) {
        validateTokenRefValue($value, throwError);
    }
    else {
        const ACCEPTABLE_PROPS = ["duration", "timingFunction", "delay"];
        shouldHaveRequiredProps($value, ACCEPTABLE_PROPS, throwError);
        notAllowedProps($value, ACCEPTABLE_PROPS, throwError);
        if (isObject($value.duration)) {
            validateDurationValue($value.duration, throwError);
        }
        else {
            if (!isString($value.duration)) {
                throwError(`duration는 Duration 또는 문자열 형식이어야 합니다.`);
            }
            else {
                validateTokenRefValue($value.duration, throwError);
            }
        }
        if (isObject($value.delay)) {
            validateDurationValue($value.delay, throwError);
        }
        else {
            if (!isString($value.delay)) {
                throwError(`delay는 Duration 또는 문자열 형식이어야 합니다.`);
            }
            else {
                validateTokenRefValue($value.delay, throwError);
            }
        }
        if (isArray($value.timingFunction)) {
            validateCubicBezierValue($value.timingFunction, throwError);
        }
        else {
            if (!isString($value.timingFunction)) {
                throwError(`timingFunction는 CubicBezier 또는 문자열 형식이어야 합니다.`);
            }
            else {
                validateTokenRefValue($value.timingFunction, throwError);
            }
        }
    }
    return true;
};
/**
 * 주어진 토큰 객체가 Shadow 타입인지 확인합니다.
 * Shadow 타입은 'offsetX', 'offsetY', 'blur', 'spread', 'color' 속성을 포함해야 합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Shadow 타입인지 여부
 * @throws "Shadow"에 대한 에러 메시지를 throw합니다.
 */
const shadow = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("Shadow");
    if (!isString($value) && !isObject($value)) {
        throwError(`허용되지 않는 형식입니다.`);
    }
    if (isString($value)) {
        validateTokenRefValue($value, throwError);
    }
    else {
        const ACCEPTABLE_PROPS = ["offsetX", "offsetY", "blur", "spread", "color"];
        shouldHaveRequiredProps($value, ACCEPTABLE_PROPS, throwError);
        notAllowedProps($value, ACCEPTABLE_PROPS, throwError);
        if (isObject($value.offsetX)) {
            validateDimensionValue($value.offsetX, throwError);
        }
        else {
            if (!isString($value.offsetX)) {
                throwError(`offsetX는 Dimension 또는 문자열 형식이어야 합니다.`);
            }
            else {
                validateTokenRefValue($value.offsetX, throwError);
            }
        }
        if (isObject($value.offsetY)) {
            validateDimensionValue($value.offsetY, throwError);
        }
        else {
            if (!isString($value.offsetY)) {
                throwError(`offsetY는 Dimension 또는 문자열 형식이어야 합니다.`);
            }
            else {
                validateTokenRefValue($value.offsetY, throwError);
            }
        }
        if (isObject($value.blur)) {
            validateDimensionValue($value.blur, throwError);
        }
        else {
            if (!isString($value.blur)) {
                throwError(`blur는 Dimension 또는 문자열 형식이어야 합니다.`);
            }
            else {
                validateTokenRefValue($value.blur, throwError);
            }
        }
        if (isObject($value.spread)) {
            validateDimensionValue($value.spread, throwError);
        }
        else {
            if (!isString($value.spread)) {
                throwError(`spread는 Dimension 또는 문자열 형식이어야 합니다.`);
            }
            else {
                validateTokenRefValue($value.spread, throwError);
            }
        }
        if (!isString($value.color)) {
            validateColorValue($value.color, throwError);
        }
        else {
            if (!isString($value.color)) {
                throwError(`color는 Color 또는 문자열 형식이어야 합니다.`);
            }
            else {
                if (hasTokenRef($value.color)) {
                    validateTokenRefValue($value.color, throwError);
                }
            }
        }
    }
    return true;
};
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
const gradient = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("Gradient");
    if (!isString($value) && !isArray($value)) {
        throwError(`허용되지 않는 형식입니다.`);
    }
    if (isString($value)) {
        validateTokenRefValue($value, throwError);
    }
    else {
        for (const value of $value) {
            if (!isObject(value)) {
                throwError(`허용되지 않는 형식입니다.`);
            }
            const ACCEPTABLE_PROPS = ["color", "position"];
            shouldHaveRequiredProps(value, ACCEPTABLE_PROPS, throwError);
            notAllowedProps(value, ACCEPTABLE_PROPS, throwError);
            if (isString(value.color)) {
                validateColorValue(value.color, throwError);
                if (hasTokenRef(value.color)) {
                    validateTokenRefValue(value.color, throwError);
                }
            }
            else {
                throwError(`color는 Color 또는 문자열 형식이어야 합니다.`);
            }
            if (!isNumber(value.position)) {
                throwError(`position는 number 형식이어야 합니다.`);
            }
        }
    }
    return true;
};
/**
 * Typography 타입의 토큰을 확인합니다.
 * Typography 타입은 "fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing" 속성을 포함해야 합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Typography 타입인지 여부
 * @throws "Typography"에 대한 에러 메시지를 throw합니다.
 */
const typography = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("Typography");
    if (!isString($value) && !isObject($value)) {
        throwError(`허용되지 않는 형식입니다.`);
    }
    if (isString($value)) {
        validateTokenRefValue($value, throwError);
    }
    else {
        const ACCEPTABLE_PROPS = [
            "fontFamily",
            "fontSize",
            "fontWeight",
            "lineHeight",
            "letterSpacing",
        ];
        shouldHaveRequiredProps($value, ACCEPTABLE_PROPS, throwError);
        notAllowedProps($value, ACCEPTABLE_PROPS, throwError);
        if (!isString($value.fontFamily)) {
            validateFontFamilyValue($value.fontFamily, throwError);
        }
        else {
            if (hasTokenRef($value.fontFamily)) {
                validateTokenRefValue($value.fontFamily, throwError);
            }
        }
        if (!isString($value.fontWeight)) {
            validateFontWeightValue($value.fontWeight, throwError);
        }
        else {
            if (hasTokenRef($value.fontWeight)) {
                validateTokenRefValue($value.fontWeight, throwError);
            }
        }
        if (isObject($value.fontSize)) {
            validateDimensionValue($value.fontSize, throwError);
        }
        else {
            if (!isString($value.fontSize)) {
                throwError(`fontSize는 Dimension 또는 문자열 형식이어야 합니다.`);
            }
            else {
                validateTokenRefValue($value.fontSize, throwError);
            }
        }
        if (!isNumber($value.lineHeight)) {
            throwError(`lineHeight는 number 형식이어야 합니다.`);
        }
        else {
            if (isString($value.lineHeight)) {
                validateTokenRefValue($value.lineHeight, throwError);
            }
        }
        if (isObject($value.letterSpacing)) {
            validateDimensionValue($value.letterSpacing, throwError);
        }
        else {
            if (!isString($value.letterSpacing)) {
                throwError(`fontSize는 Dimension 또는 문자열 형식이어야 합니다.`);
            }
            else {
                validateTokenRefValue($value.letterSpacing, throwError);
            }
        }
    }
    return true;
};

/**
 * 주어진 토큰 경로가 토큰 내부에 중복으로 존재하는지 확인합니다.
 *
 * @param {Token | TokenGroup} token
 * @param {string} tokenRef
 * @returns {boolean}
 */
const duplicate = (token, tokenRef) => {
    let _token = token;
    if (!(token instanceof Token)) {
        _token = new Token(token);
    }
    return !!_token.find((props) => toTokenRef(props) === tokenRef);
};

var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    border: border,
    color: color,
    composite: composite,
    cubicBezier: cubicBezier,
    dimension: dimension,
    duplicate: duplicate,
    duration: duration,
    fontFamily: fontFamily,
    fontWeight: fontWeight,
    gradient: gradient,
    is: is,
    number: number,
    shadow: shadow,
    string: string,
    strokeStyle: strokeStyle,
    transition: transition,
    typography: typography
});

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    format: index$2,
    token: index$1
});

class Token {
    #token;
    constructor(token) {
        // 유효성 검사
        this.#validate(token);
        this.#token = token;
    }
    /**
     *
     * @description 주어진 참조값에 해당하는 토큰 객체 및 구조 객체를 반환한다.
     * @returns
     */
    find(callback) {
        let result;
        this.#iterator(this.#token, (props, token) => {
            if (callback(props, token, this)) {
                // props, token을 그대로 할당하면 객체의 참조가 유지됨으로 얕은 복사가 필요한 상황.
                result = [...this.#clone([props, token])];
            }
        });
        return result;
    }
    /**
     * @description 주어진 참조값에 해당하는 모든 토큰 객체 및 구조 객체를 반환한다.
     * @returns
     */
    findAll(callback) {
        const result = [];
        this.#iterator(this.#token, (props, token) => {
            callback(props, token, this) && result.push([props, token]);
        });
        return result;
    }
    /**
     * @description 주어진 참조값에 해당하는 토큰을 삭제한다.
     * @param props 참조값
     * @throws {Error} parent token이 존재하지 않을 때
     */
    delete(props) {
        let parentToken = this.#token;
        const prop = props.pop();
        const tokenRef = toTokenRef(props);
        if (props.length > 0) {
            this.#iterator(this.#token, (props, token) => {
                if (toTokenRef(props) === tokenRef) {
                    parentToken = token;
                }
            });
        }
        if (!parentToken) {
            throw new Error(`Cannot find parent token: ${tokenRef}`);
        }
        delete parentToken[prop];
    }
    /**
     * @description 주어진 참조값에 토큰을 추가한다.
     * @param props 토큰을 추가할 참조값
     * @param token 추가할 토큰
     */
    add(props, token) {
        const newProp = props.pop();
        let temp = this.#token;
        for (const prop of props) {
            if (!temp[prop]) {
                temp[prop] = {};
            }
            temp = temp[prop];
        }
        temp[newProp] = token;
    }
    /**
     * @description 토큰의 복사본을 반환한다.
     * @returns 복사된 토큰
     */
    clone() {
        return new Token(this.#clone(this.#token));
    }
    /**
     * @description 토큰을 순회하여 주어진 콜백을 적용하고, 그 결과를 반환한다.
     * @param callback 토큰을 순회하는 콜백. 첫 번째 인자로 토큰의 경로를, 두 번째 인자로 토큰을 받는다.
     * @returns 주어진 콜백을 적용한 결과를 반환한다.
     */
    map(callback) {
        const result = [];
        this.#iterator(this.#clone(this.#token), (props, token) => {
            result.push(callback(props, token));
        });
        return result;
    }
    getToken() {
        return this.#token;
    }
    #iterator(token, callback) {
        const stack = [Object.entries(token)];
        let currentCtx = stack[stack.length - 1];
        let props = [];
        while (currentCtx.length) {
            const [prop, token] = currentCtx.pop();
            props.push(prop);
            callback(this.#clone(props), token);
            if (isObject(token) && !isTokenObj(token)) {
                const item = Object.entries(token);
                stack.push(item);
                currentCtx = item;
            }
            else {
                props.pop();
            }
            if (currentCtx.length === 0) {
                while (stack.length > 0 && stack.at(-1).length === 0) {
                    stack.pop();
                    props.pop();
                }
                currentCtx = stack[stack.length - 1] ?? [];
            }
        }
    }
    #validate(token) {
        //1. 중복 속성 체크
        //2. $extension 속성은 무조건 JSON
        //3. 토큰 객체 타입별 값의 형식 체크
        //3-1. 값의 유효한 값인지 확인
        this.#iterator(token, (_, _token) => {
            if (typeof _token === "object" &&
                shouldHaveRequiredProp(_token)) {
                if (shouldNotHaveDollarPrefix(_token)) {
                    throw new Error(`토큰 객체의 속성값의 이름은 $가 prefix로 시작해야합니다.`);
                }
            }
        });
    }
    #clone(value) {
        return structuredClone(value);
    }
}

const findValueBy = (tokenRef, refTokens, circularRefMap = new Map()) => {
    let token = null;
    const _tokenRef = takeOffBracketFromTokenRef(tokenRef);
    for (const raw of refTokens) {
        const foundTokenObj = raw.find((props) => toTokenRef(props) === _tokenRef);
        if (foundTokenObj) {
            token = foundTokenObj;
            break;
        }
    }
    if (!token) {
        throw new Error(`정의되지 않은 토큰입니다: ${tokenRef}`);
    }
    const [, tokenObj] = token;
    return recursiveFindValueBy(tokenRef, tokenObj.$value);
    /**
     * 참조하는 토큰 키와 참조되는 토큰 키가 서로 순환 참조하고 있는지 확인합니다.
     * 순환 참조가 발견되면 Error를 throw합니다.
     * @param referringKey - 참조하는 토큰 키
     * @param referredKey - 참조되는 토큰 키
     */
    function checkCircularRef(referringKey, referredKey) {
        let temp = referredKey;
        circularRefMap.set(referringKey, referredKey);
        while (temp && temp !== referringKey) {
            temp = circularRefMap.get(temp);
        }
        if (temp === referringKey) {
            throw new Error(`${referringKey}와 ${referredKey}가 서로 순환 참조하고 있습니다`);
        }
    }
    /**
     * 참조된 토큰값을 재귀적으로 찾아 값을 반환합니다.
     * @param referringTokenRef - 참조하는 토큰 키
     * @param value - 찾을 토큰의 값
     * @returns 찾은 토큰의 값
     */
    function recursiveFindValueBy(referringTokenRef, value) {
        if (isString(value)) {
            if (isTokenRef(value)) {
                checkCircularRef(referringTokenRef, value);
                return findValueBy(value, refTokens, circularRefMap);
            }
            else {
                return value;
            }
        }
        if (isArray(value)) {
            return mapArray(value, (_value) => {
                return recursiveFindValueBy(referringTokenRef, _value);
            });
        }
        if (isObject(value)) {
            return mapObject(value, (_value) => {
                return recursiveFindValueBy(referringTokenRef, _value);
            });
        }
        return value;
    }
};
const parse = (base, refTokens) => {
    const result = base.clone();
    for (const [, tokenObj] of result.findAll((_, token) => isTokenObj(token))) {
        tokenObj.$value = recursiveParse(tokenObj.$value);
    }
    return result;
    /**
     * 재귀적으로 참조된 토큰값을 찾아 값을 반환합니다.
     * @param value - 찾을 토큰의 값
     * @returns 찾은 토큰의 값
     */
    function recursiveParse(value) {
        if (isString(value) && isTokenRef(value)) {
            return findValueBy(value, [base, ...refTokens]);
        }
        else {
            if (isArray(value)) {
                return mapArray(value, recursiveParse);
            }
            if (isObject(value)) {
                return mapObject(value, recursiveParse);
            }
        }
        return value;
    }
};

/**
 * 주어진 토큰 이름에서 토큰 참조를 추출하고, 제공된 토큰 목록에서 검색하여 참조된 토큰을 찾습니다.
 *
 * @param tokenRef - 참조를 추출할 토큰 이름
 * @param tokens - 검색할 토큰 목록
 * @returns 참조된 토큰을 찾으면 T 타입의 토큰을 반환하고, 그렇지 않으면 undefined를 반환합니다.
 */
const findReferredToken = (tokenRef, tokens) => {
    const _tokenRef = takeOffBracketFromTokenRef(findTokenRef(tokenRef)[0]);
    let result;
    for (const token of tokens) {
        const foundToken = token.find((props) => toTokenRef(props) === _tokenRef);
        if (foundToken) {
            result = foundToken;
            break;
        }
    }
    return result;
};
/**
 * 주어진 토큰(base)에 대한 참조 토큰(refTokens)을 찾아 대체합니다.
 *
 * @param base - 대체할 토큰
 * @param refTokens - 참조 토큰을 찾을 토큰 목록
 * @returns 대체된 토큰
 */
const transform = (base, refTokens, transformers = []) => {
    return transformers.reduce((base, transformer) => {
        const useCases = transformer.findUseCases(base, refTokens);
        if (useCases.length === 0)
            return base;
        const transformedTokens = [];
        for (const useCase of useCases) {
            const foundReferredToken = findReferredToken(toTokenRef(useCase[0]), [base, ...refTokens]);
            if (!foundReferredToken) {
                throw new Error(`정의되지 않은 토큰입니다: ${useCase[0]}`);
            }
            transformedTokens.push({
                useCase,
                transformed: transformer.transform(useCase, foundReferredToken),
            });
        }
        for (const { useCase, transformed } of transformedTokens) {
            const [useCaseProps] = useCase;
            base.delete(useCaseProps);
            for (const [transformedProps, transformedToken,] of transformed) {
                base.add(transformedProps, transformedToken);
            }
        }
        return base;
    }, base.clone());
};

/**
 * 주어진 토큰 참조 문자열에 해당하는 토큰을 참조 토큰 목록에서 찾아 반환합니다.
 *
 * @param tokenRef - 찾고자 하는 토큰의 참조 문자열
 * @param refTokens - 검색할 참조 토큰 목록
 * @returns 찾은 토큰이 있으면 [string[], Types.TokenGroup] 형식의 결과를 반환하고, 없으면 undefined를 반환합니다.
 */
const findByRefTokens = (tokenRef, refTokens) => {
    let result;
    const _tokenRef = takeOffBracketFromTokenRef(tokenRef);
    for (const refToken of refTokens) {
        const foundRef = refToken.find((props) => toTokenRef(props) === _tokenRef);
        if (foundRef) {
            result = foundRef;
            break;
        }
    }
    return result;
};

/**
 * {$value}을 포함하고 있는 문자열, 배열, 혹은 객체를
 * 실제 토큰 참조값으로 치환하여 반환합니다.
 *
 * @param {any} value
 * @param {string} tokenRef
 * @returns {any}
 */
const replaceValueToTokenRef = (value, tokenRef) => {
    if (isString(value)) {
        return value.replace(`{$value}`, `{${tokenRef}}`);
    }
    if (isArray(value)) {
        return mapArray(value, (v) => replaceValueToTokenRef(v, tokenRef));
    }
    if (isObject(value)) {
        return mapObject(value, (v) => replaceValueToTokenRef(v, tokenRef));
    }
    return value;
};
/**
 * @function transformTokenResult
 *
 * @description
 * 토큰 객체를 전달받아, {$value}을 포함하고 있는 문자열, 배열, 혹은
 * 객체를 실제 토큰 참조값으로 치환하는 함수
 *
 * @param {Types.TokenObj} base - 토큰 객체
 * @param {UpdateData} data - 치환할 토큰의 프로퍼티와 참조값
 * @returns {[string[], Types.TokenObj]} - TokenResult
 */
const transformTokenResult = (base, data) => {
    return [
        data.props,
        {
            ...base,
            $value: replaceValueToTokenRef(base.$value, data.replaceValue),
        },
    ];
};

var transformCase1 = {
    findUseCases: (base, refTokens) => {
        return base.findAll((props, token) => {
            const lastProp = props.at(-1);
            if (!isTokenRef(lastProp) || !isTokenObj(token)) {
                return false;
            }
            const foundRef = findByRefTokens(lastProp, [base, ...refTokens]);
            if (!foundRef) {
                return false;
            }
            const [, refToken] = foundRef;
            return isTokenObj(refToken);
        });
    },
    transform: (useCase, referred) => {
        return [
            transformTokenResult(useCase[1], {
                props: [referred[0].at(-1)],
                replaceValue: toTokenRef(referred[0]),
            }),
        ];
    },
};

var transformCase2 = {
    findUseCases: (base, refTokens) => {
        return base.findAll((props, token) => {
            const lastProp = props.at(-1);
            if (!isTokenRef(lastProp) || !isTokenObj(token)) {
                return false;
            }
            const foundRef = findByRefTokens(lastProp, [base, ...refTokens]);
            if (!foundRef) {
                return false;
            }
            const [, refToken] = foundRef;
            return !isTokenObj(refToken);
        });
    },
    transform: (useCase, referred) => {
        const result = [];
        const [useCaseProps, useCaseToken] = useCase;
        const [referredProps, referredToken] = referred;
        const referredTokenObjs = new Token(referredToken).findAll((_, token) => isTokenObj(token));
        for (const [referredTokenProps] of referredTokenObjs) {
            result.push(transformTokenResult(useCaseToken, {
                props: [...useCaseProps.slice(0, -1), ...referredTokenProps],
                replaceValue: toTokenRef([
                    ...referredProps,
                    ...referredTokenProps,
                ]),
            }));
        }
        return result;
    },
};

var transformCase3 = {
    findUseCases: (base, refTokens) => {
        return base.findAll((props, token) => {
            const lastProp = props.at(-1);
            if (!isTokenRef(lastProp) || isTokenObj(token)) {
                return false;
            }
            const foundRef = findByRefTokens(lastProp, [base, ...refTokens]);
            if (!foundRef) {
                return false;
            }
            const [, refToken] = foundRef;
            return isTokenObj(refToken);
        });
    },
    transform: (useCase, referred) => {
        const result = [];
        const [useCaseProps, useCaseToken] = useCase;
        const [referredProps] = referred;
        const useCaseTokenObjs = new Token(useCaseToken).findAll((_, token) => isTokenObj(token));
        /**
         * 가장 앞에 위치해야할 속성명
         * - 참조값으로 명명된 속성명을 참조된 토큰을 가리키는 속성명으로 대체한다.
         */
        const firstProp = useCaseProps.map((useCaseProp) => isTokenRef(useCaseProp) ? referredProps.at(-1) : useCaseProp);
        for (const [useCaseTokenObjProps, useCaseTokenObj] of useCaseTokenObjs) {
            result.push(transformTokenResult(useCaseTokenObj, {
                props: [...firstProp, ...useCaseTokenObjProps],
                replaceValue: toTokenRef(referredProps),
            }));
        }
        return result;
    },
};

var transformCase4 = {
    findUseCases: (base, refTokens) => {
        return base.findAll((props, token) => {
            const lastProp = props.at(-1);
            if (!isTokenRef(lastProp) || isTokenObj(token)) {
                return false;
            }
            const foundRef = findByRefTokens(lastProp, [base, ...refTokens]);
            if (!foundRef) {
                return false;
            }
            const [, refToken] = foundRef;
            return !isTokenObj(refToken);
        });
    },
    transform: (useCase, referred) => {
        const result = [];
        const [useCaseProps, useCaseToken] = useCase;
        const [referredProps, referredToken] = referred;
        const referredTokenObjs = new Token(referredToken).findAll((_, token) => isTokenObj(token));
        const useCaseTokenObjs = new Token(useCaseToken).findAll((_, token) => isTokenObj(token));
        for (const [referredTokenObjProps] of referredTokenObjs) {
            /**
             * 가장 앞에 위치해야할 속성명
             * - 참조값으로 명명된 속성명을 참조된 토큰을 가리키는 속성명으로 대체한다.
             */
            const firstProp = [];
            for (const useCaseProp of useCaseProps) {
                if (isTokenRef(useCaseProp)) {
                    firstProp.push(...referredTokenObjProps);
                }
                else {
                    firstProp.push(useCaseProp);
                }
            }
            for (const [useCaseTokenObjProps, useCaseTokenObj] of useCaseTokenObjs) {
                result.push(transformTokenResult(useCaseTokenObj, {
                    props: [...firstProp, ...useCaseTokenObjProps],
                    replaceValue: toTokenRef([
                        ...referredProps,
                        ...referredTokenObjProps,
                    ]),
                }));
            }
        }
        return result;
    },
};

const generateDesignToken = (base, refTokens) => {
    const _refTokens = refTokens.map((token) => new Token(token));
    return parse(transform(new Token(base), _refTokens, [
        transformCase1,
        transformCase2,
        transformCase3,
        transformCase4,
    ]), _refTokens).getToken();
};

export { Token, index$4 as Transformers, index$3 as TypeCheckers, index as Validate, findTokenRef, generateDesignToken, hasTokenRef, isTokenObj, isTokenRef, mapArray, mapObject, parse, transform, transformCase1 as useCase1, transformCase2 as useCase2, transformCase3 as useCase3, transformCase4 as useCase4 };
//# sourceMappingURL=index.es.js.map
