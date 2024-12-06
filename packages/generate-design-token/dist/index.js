'use strict';

var ejs = require('ejs');
var fs = require('fs/promises');
var nPath = require('node:path');
var prettier = require('prettier');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var ejs__namespace = /*#__PURE__*/_interopNamespaceDefault(ejs);

const TOKEN_REF_REGEXP = /\{([^{}]+)\}/;

/**
 * 주어진 객체가 토큰 객체의 필수 속성을 모두 포함하고 있는지 확인합니다.
 * @param {object} value - 확인할 객체
 * @returns 주어진 객체가 토큰 객체의 필수 속성을 모두 포함하고 있으면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
const shouldHaveRequiredProp = (value) => {
    const MUST_HAVE_PROPERTIES = ["$value"];
    return MUST_HAVE_PROPERTIES.every((prop) => prop in value);
};
/**
 * @description 주어진 객체의 속성명이 모두 $로 시작하는지 확인합니다.
 * @param {object} value - 확인할 객체
 * @returns 주어진 객체의 모든 속성명이 $로 시작하면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
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
 * @description 주어진 객체의 속셩명 중 하나라도 $를 prefix로 가지고 있지 않은 속성명이 있는지 확인합니다.
 * @param {object} value - 확인할 객체
 * @returns 주어진 객체의 속셩명 중 하나라도 $를 prefix로 가지고 있지 않으면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
const shouldNotHaveDollarPrefix = (value) => {
    let result = false;
    for (const prop in value) {
        if (!prop.startsWith("$")) {
            result = true;
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

/**
 * 주어진 객체가 TokenObj 타입인지 확인합니다.
 * TokenObj는 `value` 속성을 가져야 합니다.
 * @param token - 확인할 객체
 * @returns 주어진 객체가 TokenObj 타입인지 여부
 */
const isTokenObj = (token) => {
    return shouldHaveRequiredProp(token);
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
 * 주어진 문자열에 토큰 참조값이 포함되어 있는지 확인합니다.
 *
 * @param tokenRef - 확인할 문자열
 * @returns 토큰 참조 문자열이 포함되어 있으면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
const hasTokenRef = (str) => {
    return !!str.match(TOKEN_REF_REGEXP);
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
/**
 * 주어진 토큰 참조 문자열에 포함된 중괄호를 삭제하여 반환합니다.
 * @param tokenRef - 토큰 참조 문자열
 * @returns 중괄호를 삭제한 토큰 참조 문자열
 */
const takeOffBracketFromTokenRef = (tokenRef) => {
    return tokenRef.replace(/[\{\}]/g, "");
};

/**
 * 주어진 값의 타입을 반환합니다.
 * @param value 타입을 확인할 값
 * @returns 주어진 값의 타입
 */
const getType = (value) => {
    return Object.prototype.toString
        .call(value)
        .slice(8, -1)
        .toLowerCase();
};
/**
 * 주어진 값이 배열인지 확인합니다.
 * @param value 확인할 값
 * @returns 주어진 값이 배열이면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
const isArray = (value) => {
    return getType(value) === "array";
};
/**
 * 주어진 값이 숫자인지 확인합니다.
 * @param value 확인할 값
 * @returns 주어진 값이 숫자이면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
const isNumber = (value) => {
    return getType(value) === "number";
};
/**
 * 주어진 값이 객체인지 확인합니다.
 * @param value 확인할 값
 * @returns 주어진 값이 객체이면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
const isObject = (value) => {
    return getType(value) === "object";
};
/**
 * 주어진 값이 문자열인지 확인합니다.
 * @param value 확인할 값
 * @returns 주어진 값이 문자열이면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
const isString = (value) => {
    return getType(value) === "string";
};
/**
 * 주어진 값이 undefined인지 확인합니다.
 * @param value 확인할 값
 * @returns 주어진 값이 undefined이면 true를 반환합니다. 그렇지 않으면 false를 반환합니다.
 */
const isUndefined = (value) => {
    return getType(value) === "undefined";
};

class Token {
    #token;
    constructor(token) {
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
    /**
     * @description 주어진 콜백을 적용하여 필터링된 토큰을 반환합니다.
     * @param callback 필터링을 위한 콜백. 첫 번째 인자로 토큰의 경로를, 두 번째 인자로 토큰을 받는다.
     * @returns 필터링된 토큰을 반환합니다.
     */
    filter(callback) {
        const result = [];
        this.#iterator(this.#clone(this.#token), (props, token) => {
            if (callback(props, token)) {
                result.push([props, token]);
            }
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
    /**
     * @description 주어진 토큰을 순회하여 주어진 콜백을 실행합니다.
     * @param callback 토큰을 순회하는 콜백. 첫 번째 인자로 토큰의 경로를, 두 번째 인자로 토큰을 받는다.
     */
    forEach(callback) {
        this.#iterator(this.#token, (props, token) => {
            callback(props, token, this);
        });
    }
    #clone(value) {
        return structuredClone(value);
    }
}

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
 * 주어진 객체의 모든 값을 주어진 콜백을 적용하여 반환합니다.
 *
 * @param obj - 처리할 객체
 * @param callback - 처리할 콜백. 첫 번째 인자로 값, 두 번째 인자로 키를 받습니다.
 * @returns 주어진 콜백을 적용한 결과를 반환합니다.
 */
const mapObject = (obj, callback) => {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, callback(value)]));
};

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
        if (isString(tokenObj.$value) && isTokenRef(tokenObj.$value)) {
            const { $type, $value } = findTokenObj(takeOffBracketFromTokenRef(tokenObj.$value), [base, ...refTokens]);
            tokenObj.$type = $type;
            tokenObj.$value = recursiveTokenValue($value);
        }
        else {
            tokenObj.$value = recursiveTokenValue(tokenObj.$value);
        }
    }
    return result;
    /**
     * 재귀적으로 참조된 토큰값을 찾아 값을 반환합니다.
     * @param value - 찾을 토큰의 값
     * @returns 찾은 토큰의 값
     */
    function recursiveTokenValue(value) {
        if (isString(value) && isTokenRef(value)) {
            return findValueBy(value, [base, ...refTokens]);
        }
        else {
            if (isArray(value)) {
                return mapArray(value, recursiveTokenValue);
            }
            if (isObject(value)) {
                return mapObject(value, recursiveTokenValue);
            }
        }
        return value;
    }
    /**
     * 주어진 토큰 참조 문자열에 대한 토큰을 찾아 반환합니다.
     * @param tokenRef - 토큰 참조 문자열
     * @param refTokens - 참조 토큰 목록
     * @returns 찾은 토큰
     * @throws 토큰이 정의되지 않은 경우 에러를 throw합니다.
     */
    function findTokenObj(tokenRef, refTokens) {
        let tokenObj;
        for (const refToken of refTokens) {
            const foundResult = refToken.find((props) => toTokenRef(props) === tokenRef);
            if (foundResult) {
                tokenObj = foundResult[1];
                break;
            }
        }
        if (!tokenObj) {
            throw new Error(`정의되지 않은 토큰입니다: ${tokenRef}`);
        }
        const { $value } = tokenObj;
        if (isString($value) && isTokenRef($value)) {
            return findTokenObj(takeOffBracketFromTokenRef($value), refTokens);
        }
        return tokenObj;
    }
};

/**
 * 주어진 토큰 객체가 dimension 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 dimension 타입인지 여부
 */
const isDimensionToken = (tokenObj) => tokenObj.$type === "dimension";
/**
 * 주어진 토큰 객체가 Color 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Color 타입인지 여부
 */
const isColorToken = (tokenObj) => tokenObj.$type === "color";
/**
 * 주어진 토큰 객체가 FontFamily 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 FontFamily 타입인지 여부
 */
const isFontFamilyToken = (tokenObj) => tokenObj.$type === "fontFamily";
/**
 * 주어진 토큰 객체가 FontWeight 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 FontWeight 타입인지 여부
 */
const isFontWeightToken = (tokenObj) => tokenObj.$type === "fontWeight";
/**
 * 주어진 토큰 객체가 Duration 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Duration 타입인지 여부
 */
const isDurationToken = (tokenObj) => tokenObj.$type === "duration";
/**
 * 주어진 토큰 객체가 CubicBezier 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 CubicBezier 타입인지 여부
 */
const isCubicBezierToken = (tokenObj) => tokenObj.$type === "cubicBezier";
/**
 * 주어진 토큰 객체가 Number 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Number 타입인지 여부
 */
const isNumberToken = (tokenObj) => tokenObj.$type === "number";
/**
 * 주어진 토큰 객체가 String 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 String 타입인지 여부
 */
const isStringToken = (tokenObj) => tokenObj.$type === "string";
/**
 * 주어진 토큰 객체가 Composite 타입인지 확인합니다.
 * Composite 타입은 key-value 형식의 토큰을 포함하는 토큰입니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Composite 타입인지 여부
 */
const isCompositeToken = (tokenObj) => tokenObj.$type === "composite";
/**
 * 주어진 토큰 객체가 StrokeStyle 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 StrokeStyle 타입인지 여부
 */
const isStrokeStyleToken = (tokenObj) => tokenObj.$type === "strokeStyle";
/**
 * 주어진 토큰 객체가 Border 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Border 타입인지 여부
 */
const isBorderToken = (tokenObj) => tokenObj.$type === "border";
/**
 * 주어진 토큰 객체가 Transition 타입인지 확인합니다.
 * Transition 타입은 Duration, Delay, TimingFunction 세 가지 속성을 가지는 토큰입니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Transition 타입인지 여부
 */
const isTransitionToken = (tokenObj) => tokenObj.$type === "transition";
/**
 * 주어진 토큰 객체가 Shadow 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Shadow 타입인지 여부
 */
const isShadowToken = (tokenObj) => tokenObj.$type === "shadow";
/**
 * 주어진 토큰 객체가 Gradient 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Gradient 타입인지 여부
 */
const isGradientToken = (tokenObj) => tokenObj.$type === "gradient";
/**
 * 주어진 토큰 객체가 Typography 타입인지 확인합니다.
 * @param tokenObj - 확인할 토큰 객체
 * @returns 토큰 객체가 Typography 타입인지 여부
 */
const isTypographyToken = (tokenObj) => tokenObj.$type === "typography";
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
    if (value.includes("{$value}")) {
        return;
    }
    if (!isTokenRef(value)) {
        throwError(`토큰 참조값 이외에 다른 문자열은 사용할 수 없습니다. ${value}`);
    }
};
const validateDimensionValue = (value, throwError) => {
    const UNITS = ["px", "rem"];
    if (isString(value)) {
        if (!UNITS.some((unit) => value.endsWith(unit))) {
            throwError(`value의 단위는 [${UNITS.join(",")}]이어야 합니다.`);
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
const validateDimensionToken = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("Dimension");
    if (!isString($value) && !isObject($value)) {
        throwError(`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`);
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
const validateColorToken = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("Color");
    if (!isString($value)) {
        throwError(`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`);
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
const validateFontFamilyToken = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("FontFamily");
    if (!isString($value) && !isArray($value)) {
        throwError(`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`);
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
const validateFontWeightToken = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("FontWeight");
    if (!isString($value) && !isNumber($value)) {
        throwError(`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`);
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
const validateDurationToken = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("Duration");
    if (!isObject($value) && !isObject($value)) {
        throwError(`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`);
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
const validateCubicBezierToken = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("CubicBezier");
    if (!isString($value) && !isArray($value)) {
        throwError(`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`);
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
const validateStringToken = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("String");
    if (!isString($value)) {
        throwError(`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`);
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
const validateNumberToken = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("Number");
    if (isString($value)) {
        validateTokenRefValue($value, throwError);
    }
    else {
        if (!isNumber($value)) {
            throwError(`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`);
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
const validateCompositeToken = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("Composite");
    if (!isObject($value)) {
        throwError(`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`);
    }
    return true;
};
/**
 * StrokeStyle의 유효성을 확인합니다.
 * @param tokenObj - StrokeStyle TokenObj
 * @returns StrokeStyle TokenObj의 유효성 여부
 * @throws "StrokeStyle"에 대한 에러 메시지를 throw합니다.
 */
const validateStrokeStyleToken = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("StrokeStyle");
    if (!isString($value) && !isObject($value)) {
        throwError(`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`);
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
const validateBorderToken = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("Border");
    if (!isString($value) && !isObject($value)) {
        throwError(`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`);
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
const validateTransitionToken = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("Transition");
    if (!isString($value) && !isObject($value)) {
        throwError(`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`);
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
const validateShadowToken = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("Shadow");
    if (!isString($value) && !isObject($value)) {
        throwError(`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`);
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
const validateGradientToken = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("Gradient");
    if (!isString($value) && !isArray($value)) {
        throwError(`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`);
    }
    if (isString($value)) {
        validateTokenRefValue($value, throwError);
    }
    else {
        for (const value of $value) {
            if (!isObject(value)) {
                throwError(`허용되지 않는 형식입니다. ${JSON.stringify(value, null, 2)}`);
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
const validateTypographyToken = (tokenObj) => {
    const { $value } = tokenObj;
    const throwError = throwTypeError("Typography");
    if (!isString($value) && !isObject($value)) {
        throwError(`허용되지 않는 형식입니다. ${JSON.stringify(tokenObj, null, 2)}`);
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
const defaultValidators = {
    shadow: {
        is: isShadowToken,
        validate: validateShadowToken,
    },
    gradient: {
        is: isGradientToken,
        validate: validateGradientToken,
    },
    typography: {
        is: isTypographyToken,
        validate: validateTypographyToken,
    },
    color: {
        is: isColorToken,
        validate: validateColorToken,
    },
    string: {
        is: isStringToken,
        validate: validateStringToken,
    },
    number: {
        is: isNumberToken,
        validate: validateNumberToken,
    },
    duration: {
        is: isDurationToken,
        validate: validateDurationToken,
    },
    cubicBezier: {
        is: isCubicBezierToken,
        validate: validateCubicBezierToken,
    },
    border: {
        is: isBorderToken,
        validate: validateBorderToken,
    },
    composite: {
        is: isCompositeToken,
        validate: validateCompositeToken,
    },
    strokeStyle: {
        is: isStrokeStyleToken,
        validate: validateStrokeStyleToken,
    },
    transition: {
        is: isTransitionToken,
        validate: validateTransitionToken,
    },
    fontFamily: {
        is: isFontFamilyToken,
        validate: validateFontFamilyToken,
    },
    fontWeight: {
        is: isFontWeightToken,
        validate: validateFontWeightToken,
    },
    dimension: {
        is: isDimensionToken,
        validate: validateDimensionToken,
    },
};
const validate = (token) => {
    const validators = defaultValidators;
    let _token = token;
    if (!(_token instanceof Token)) {
        _token = new Token(_token);
    }
    _token.forEach((props, token) => {
        if (isObject(token) && isTokenObj(token)) {
            if (shouldNotHaveDollarPrefix(token)) {
                throw new Error(`토큰 객체의 속성값의 이름은 $가 prefix로 시작해야합니다. ${toTokenRef(props)}`);
            }
            const validator = validators[token.$type];
            if (validator && validator.is(token)) {
                // TODO validate를 찾을 수 없는 에러 해결 필요
                validator.validate(token);
            }
        }
    });
};

/**
 * TokenGroup을 파일로 생성합니다.
 *
 * @param token 생성할 TokenGroup
 * @param options 생성할 파일의 경로, 이름, ejs 템플릿 등의 옵션
 *
 * @return 생성이 완료된 Promise
 */
const generate = async (token, options) => {
    if (isUndefined(global)) {
        throw new Error("Node 환경에서 사용할 수 있습니다.");
    }
    validate(token);
    const { path, filename, template, ejsOptions, ejsHelper = {}, ejsData, } = validateOptions(options);
    const data = new Token(token)
        .filter((_, token) => isTokenObj(token))
        .map(([props, token]) => {
        return {
            props,
            value: {
                $type: token.$type,
                $value: token.$value,
            },
            meta: pickMeta(token, ["$type", "$value"]),
        };
    });
    let _template = template;
    if (_template.includes(nPath.sep)) {
        _template = await fs.readFile(nPath.resolve(_template), {
            encoding: "utf-8",
        });
    }
    let contents = await ejs__namespace.compile(_template, { async: true, ...ejsOptions })({
        tokens: data,
        custom: ejsData,
        ...ejsHelper,
    });
    contents = await prettier.format(contents, {
        parser: nPath.extname(filename).slice(1),
    });
    await fs.mkdir(path, { recursive: true });
    await fs.writeFile(nPath.resolve(path, filename), contents, {
        encoding: "utf-8",
    });
};
function validateOptions(options) {
    if (isString(options.filename)) {
        if (!nPath.extname(options.filename)) {
            throw new Error(`filename에 확장자가 없습니다. ${options.filename}`);
        }
    }
    else {
        throw new Error(`filename은 문자열 형식이어야 합니다.`);
    }
    if (!isString(options.path)) {
        throw new Error(`path는 문자열 형식이어야 합니다.`);
    }
    if (!isString(options.template)) {
        throw new Error(`template는 ejs 템플릿 경로 또는 ejs 템플릿 문자열 가진 문자열 형식이어야 합니다.`);
    }
    return options;
}
/**
 * 토큰에 대한 메타데이터를 추출하는 함수
 * @param token - 토큰
 * @param excludes - 추출하고 싶지 않은 메타데이터의 키
 * @returns {EJSTokenData["meta"]} 추출된 메타데이터
 */
function pickMeta(token, excludes = []) {
    const result = {};
    for (const prop in token) {
        if (!excludes.includes(prop) && prop.startsWith("$")) {
            result[prop] = token;
        }
    }
    return result;
}

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
            const foundReferredToken = findReferredToken(toTokenRef(useCase[0]), [
                base,
                ...refTokens,
            ]);
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
            for (const [transformedProps, transformedToken] of transformed) {
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

const useCase1 = {
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
const useCase2 = {
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
                replaceValue: toTokenRef([...referredProps, ...referredTokenProps]),
            }));
        }
        return result;
    },
};
const useCase3 = {
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
const useCase4 = {
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

/**
 * @description
 * 주어진 기본 토큰과 참조 토큰을 통해 구조 변환 -> 파싱 과정을 거쳐 토큰를 반환한다.
 *
 * @param {TokenGroup} base - 기본 토큰
 * @param {TokenGroup[]} refTokens - 참조 토큰
 * @returns {TokenGroup} - 처리된 토큰
 */
const generateDesignToken = (base, refTokens) => {
    [base, ...refTokens].forEach((token) => validate(token));
    const _refTokens = refTokens.map((token) => new Token(token));
    const result = parse(transform(new Token(base), _refTokens, [
        useCase1,
        useCase2,
        useCase3,
        useCase4,
    ]), _refTokens);
    validate(result);
    return result.getToken();
};

exports.Token = Token;
exports.findTokenRef = findTokenRef;
exports.fromTokenRef = fromTokenRef;
exports.generate = generate;
exports.generateDesignToken = generateDesignToken;
exports.hasTokenRef = hasTokenRef;
exports.isBorderToken = isBorderToken;
exports.isColorToken = isColorToken;
exports.isCompositeToken = isCompositeToken;
exports.isCubicBezierToken = isCubicBezierToken;
exports.isDimensionToken = isDimensionToken;
exports.isDurationToken = isDurationToken;
exports.isFontFamilyToken = isFontFamilyToken;
exports.isFontWeightToken = isFontWeightToken;
exports.isGradientToken = isGradientToken;
exports.isNumberToken = isNumberToken;
exports.isShadowToken = isShadowToken;
exports.isStringToken = isStringToken;
exports.isStrokeStyleToken = isStrokeStyleToken;
exports.isTokenObj = isTokenObj;
exports.isTokenRef = isTokenRef;
exports.isTransitionToken = isTransitionToken;
exports.isTypographyToken = isTypographyToken;
exports.parse = parse;
exports.shouldBeOnlyTokenRef = shouldBeOnlyTokenRef;
exports.shouldHaveDollarPrefix = shouldHaveDollarPrefix;
exports.shouldHaveRequiredProp = shouldHaveRequiredProp;
exports.shouldNotHaveDollarPrefix = shouldNotHaveDollarPrefix;
exports.takeOffBracketFromTokenRef = takeOffBracketFromTokenRef;
exports.toTokenRef = toTokenRef;
exports.useCase1 = useCase1;
exports.useCase2 = useCase2;
exports.useCase3 = useCase3;
exports.useCase4 = useCase4;
exports.validate = validate;
exports.validateBorderToken = validateBorderToken;
exports.validateColorToken = validateColorToken;
exports.validateCompositeToken = validateCompositeToken;
exports.validateCubicBezierToken = validateCubicBezierToken;
exports.validateDimensionToken = validateDimensionToken;
exports.validateDurationToken = validateDurationToken;
exports.validateFontFamilyToken = validateFontFamilyToken;
exports.validateFontWeightToken = validateFontWeightToken;
exports.validateGradientToken = validateGradientToken;
exports.validateNumberToken = validateNumberToken;
exports.validateShadowToken = validateShadowToken;
exports.validateStringToken = validateStringToken;
exports.validateStrokeStyleToken = validateStrokeStyleToken;
exports.validateTransitionToken = validateTransitionToken;
exports.validateTypographyToken = validateTypographyToken;
//# sourceMappingURL=index.js.map
