/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var isTokenObj = function (token) {
    var MUST_HAVE_PROPERTIES = ["$type", "$value"];
    var tokenKeys = Object.keys(token);
    return MUST_HAVE_PROPERTIES.every(function (prop) { return tokenKeys.includes(prop); });
};

var assignToken = function (tokenNames, data, tokenObj) {
    var e_1, _a, e_2, _b;
    if (tokenNames.length > 0) {
        var _tokenNames = __spreadArray([], __read(tokenNames), false);
        var target = _tokenNames.pop();
        try {
            for (var _tokenNames_1 = __values(_tokenNames), _tokenNames_1_1 = _tokenNames_1.next(); !_tokenNames_1_1.done; _tokenNames_1_1 = _tokenNames_1.next()) {
                var tokenName = _tokenNames_1_1.value;
                if (data[tokenName] === undefined) {
                    data[tokenName] = {};
                }
                data = data[tokenName];
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_tokenNames_1_1 && !_tokenNames_1_1.done && (_a = _tokenNames_1.return)) _a.call(_tokenNames_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (isTokenObj(tokenObj)) {
            data[target] = tokenObj;
        }
        else {
            data[target] = __assign(__assign({}, data[target]), tokenObj);
        }
    }
    else {
        try {
            for (var _c = __values(Object.entries(tokenObj)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), tokenName = _e[0], token = _e[1];
                data[tokenName] = token;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
};

var TOKEN_REF_SEPERATOR = ".";
var TOKEN_KEY_SEPERATOR = "/";

var isTokenRef = function (tokenRef) {
    return /^\{[^{}\s]+\}$/.test(tokenRef);
};

var matchTokenRefs = function (tokenRef) {
    var result = [];
    var matchedResult;
    var input = tokenRef;
    var sliceTokenRef = function (matchedResult, tokenRef) {
        return tokenRef.slice(matchedResult[0].length);
    };
    while (true) {
        matchedResult = input.match(/\{([^{}]+)\}/);
        if (matchedResult === null) {
            break;
        }
        result.push(matchedResult[1]);
        input = sliceTokenRef(matchedResult, input);
    }
    return result;
};

var findToken = function (tokenRef, tokens) {
    var e_1, _a, e_2, _b;
    var _tokenRef = tokenRef;
    var result;
    var _tokens = __spreadArray([], __read(tokens), false);
    while (true) {
        var tokenKeys = _tokenRef.split(TOKEN_REF_SEPERATOR);
        var token = void 0;
        try {
            for (var _tokens_1 = (e_1 = void 0, __values(_tokens)), _tokens_1_1 = _tokens_1.next(); !_tokens_1_1.done; _tokens_1_1 = _tokens_1.next()) {
                var _token = _tokens_1_1.value;
                var result_1 = _token;
                try {
                    for (var tokenKeys_1 = (e_2 = void 0, __values(tokenKeys)), tokenKeys_1_1 = tokenKeys_1.next(); !tokenKeys_1_1.done; tokenKeys_1_1 = tokenKeys_1.next()) {
                        var tokenKey = tokenKeys_1_1.value;
                        result_1 = result_1 === null || result_1 === void 0 ? void 0 : result_1[tokenKey];
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (tokenKeys_1_1 && !tokenKeys_1_1.done && (_b = tokenKeys_1.return)) _b.call(tokenKeys_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                if (result_1 !== undefined) {
                    token = result_1;
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_tokens_1_1 && !_tokens_1_1.done && (_a = _tokens_1.return)) _a.call(_tokens_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (token === undefined) {
            break;
        }
        if (!isTokenObj(token)) {
            result = token;
            break;
        }
        if (isTokenRef(token.$value)) {
            _tokenRef = matchTokenRefs(token.$value)[0];
            continue;
        }
        result = token;
        break;
    }
    return result;
};

var transformTokenToArray = function (token) {
    return Object.entries(token);
};

var iterateToken = function (options) {
    return function (token) {
        var e_1, _a;
        var _b, _c;
        var stack = transformTokenToArray(token);
        var tokenNames = [];
        var position = [stack.length];
        while (stack.length) {
            var _d = __read(stack.shift(), 2), _tokenName = _d[0], _tokenValue = _d[1];
            tokenNames.push(_tokenName);
            (_b = options.iterateCallback) === null || _b === void 0 ? void 0 : _b.call(options, tokenNames, _tokenValue, options.data);
            if (isTokenObj(_tokenValue)) {
                (_c = options.foundTokenObjCallback) === null || _c === void 0 ? void 0 : _c.call(options, tokenNames, _tokenValue, options.data);
                var _position = __spreadArray([], __read(position), false);
                try {
                    for (var _e = (e_1 = void 0, __values(position.reverse())), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var count = _f.value;
                        tokenNames.pop();
                        if (count === 1) {
                            _position.pop();
                        }
                        else {
                            _position[_position.length - 1] -= 1;
                            break;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                position = _position;
            }
            else {
                var items = transformTokenToArray(_tokenValue);
                stack = __spreadArray(__spreadArray([], __read(items), false), __read(stack), false);
                position.push(items.length);
            }
        }
        return options.data;
    };
};

var parser = function (token, baseTokens) {
    return iterateToken({
        data: {},
        iterateCallback: function (tokenNames, token, data) {
            if (isTokenObj(token)) {
                assignToken(tokenNames, data, __assign(__assign({}, token), { $value: token.$value.replace(/\{[^{}]+\}/g, function (matcher) {
                        var matchedTokenRef = matchTokenRefs(matcher)[0];
                        var foundToken = findToken(matchedTokenRef, baseTokens);
                        if (foundToken === undefined) {
                            throw new Error("\uD1A0\uD070\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. [".concat(matcher, "]"));
                        }
                        if (!isTokenObj(foundToken)) {
                            throw new Error("\uD1A0\uD070 \uAC1D\uCCB4\uAC00 \uC544\uB2D9\uB2C8\uB2E4. [".concat(matcher, "]"));
                        }
                        return foundToken.$value;
                    }) }));
            }
            else {
                assignToken(tokenNames, data, token);
            }
        },
    })(token);
};

var USE_CASES = {
    CASE1: "Case1",
    CASE2: "Case2",
    CASE3: "Case3",
    CASE4: "Case4",
};

var parseTokenRef = function (refTokenName) {
    return refTokenName.slice(1, refTokenName.length - 1).split(".");
};

/**
 * TODO
 * - 리팩토링 필요
 */
var transformer = function (token, baseTokens) {
    // 1. 참조값으로 구성된 키를 가진 객체를 수집한다.
    var data = iterateToken({
        data: new Map(),
        iterateCallback: function (objPaths, token, data) {
            var tokenKey = objPaths.at(-1);
            if (isTokenRef(tokenKey)) {
                // 2. 수집한 객체는 상위 뎁스까지 포함되며 뎁스는 '/'를 기준으로 문자열로 구성되며 키값으로 설정된다. 값은 토큰 객체 및 토큰 구조 객체가 설정된다.
                var _a = __read(matchTokenRefs(tokenKey), 1), tokenRef = _a[0];
                var foundToken = findToken(tokenRef, baseTokens);
                if (!foundToken) {
                    throw new Error("토큰 찾을 수 없음.");
                }
                var useCase = void 0;
                switch (true) {
                    case isTokenObj(token) && isTokenObj(foundToken):
                        useCase = USE_CASES.CASE1;
                        break;
                    case isTokenObj(token) && !isTokenObj(foundToken):
                        useCase = USE_CASES.CASE2;
                        break;
                    case !isTokenObj(token) && isTokenObj(foundToken):
                        useCase = USE_CASES.CASE3;
                        break;
                    case !isTokenObj(token) && !isTokenObj(foundToken):
                    default:
                        useCase = USE_CASES.CASE4;
                }
                data.set(objPaths.join(TOKEN_KEY_SEPERATOR), {
                    case: useCase,
                    value: token,
                    token: foundToken,
                });
            }
        },
    })(token);
    // 2. 각 케이스별 변환을 한다.
    data.forEach(function (data, objPath) {
        switch (data.case) {
            case USE_CASES.CASE1:
                transformCase1(token, objPath, data);
                break;
            case USE_CASES.CASE2:
                transformCase2(token, objPath, data);
                break;
            case USE_CASES.CASE3:
                transformCase3(token, objPath, data);
                break;
            case USE_CASES.CASE4:
                transformCase4(token, objPath, data);
                break;
        }
    });
    return token;
};
function replaceTokenValue(token, replacer) {
    return __assign(__assign({}, token), { $value: token.$value.replace("$value", replacer) });
}
function deleteTokenObj(originalToken, tokenRef) {
    var e_1, _a;
    var foundTokenRefObj = originalToken;
    var tokenKeys = tokenRef.split(TOKEN_KEY_SEPERATOR);
    var foundTokenRefIndex = tokenKeys.findIndex(function (tokenKey) {
        return isTokenRef(tokenKey);
    });
    var willDeleteKey = tokenKeys[foundTokenRefIndex];
    tokenKeys = tokenKeys.splice(0, foundTokenRefIndex);
    try {
        for (var tokenKeys_1 = __values(tokenKeys), tokenKeys_1_1 = tokenKeys_1.next(); !tokenKeys_1_1.done; tokenKeys_1_1 = tokenKeys_1.next()) {
            var key = tokenKeys_1_1.value;
            foundTokenRefObj = foundTokenRefObj[key];
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (tokenKeys_1_1 && !tokenKeys_1_1.done && (_a = tokenKeys_1.return)) _a.call(tokenKeys_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    delete foundTokenRefObj[willDeleteKey];
}
function transformCase1(originalToken, objPath, data) {
    deleteTokenObj(originalToken, objPath);
    var parentPaths = objPath.split(TOKEN_KEY_SEPERATOR);
    var tokenRef = parentPaths.pop();
    parentPaths.push(parseTokenRef(tokenRef).at(-1));
    assignToken(parentPaths, originalToken, replaceTokenValue(data.value, matchTokenRefs(tokenRef).at(0)));
}
function transformCase2(originalToken, objPath, data) {
    deleteTokenObj(originalToken, objPath);
    var parentPaths = objPath.split(TOKEN_KEY_SEPERATOR);
    var parsedTokenRef = parseTokenRef(parentPaths.pop());
    // 1. data.token이 토큰 구조 객체이기 때문에 내부의 토큰 객체를 찾아 data.value값으로 치환해주어야 함.
    var transformedToken = iterateToken({
        data: new Map(),
        foundTokenObjCallback: function (objPaths, _, _data) {
            var objPath = __spreadArray(__spreadArray([], __read(parentPaths), false), __read(objPaths), false).join(TOKEN_KEY_SEPERATOR);
            var tokenRef = __spreadArray(__spreadArray([], __read(parsedTokenRef), false), __read(objPaths), false).join(TOKEN_REF_SEPERATOR);
            _data.set(objPath, replaceTokenValue(data.value, tokenRef));
        },
    })(data.token);
    // 2. 변환된 결과물을 originalToken 객체에 override 한다.
    transformedToken.forEach(function (tokenObj, objPath) {
        assignToken(objPath.split(TOKEN_KEY_SEPERATOR), originalToken, tokenObj);
    });
}
function transformCase3(originalToken, objPath, data) {
    deleteTokenObj(originalToken, objPath);
    var parentPaths = objPath.split(TOKEN_KEY_SEPERATOR);
    var foundTokenRefIndex = parentPaths.findIndex(function (tokenKey) {
        return isTokenRef(tokenKey);
    });
    var parsedTokenRef = parseTokenRef(parentPaths[foundTokenRefIndex]);
    parentPaths = parentPaths.splice(0, foundTokenRefIndex);
    // 1. data.value가 토큰 구조 객체이기 때문에 내부의 토큰 객체를 찾아 data.token의 토큰 객체로 변경한다.
    var transformedValue = iterateToken({
        data: new Map(),
        foundTokenObjCallback: function (objPaths, token, _data) {
            var objPath = __spreadArray(__spreadArray(__spreadArray([], __read(parentPaths), false), [parsedTokenRef.at(-1)], false), __read(objPaths), false);
            _data.set(objPath.join(TOKEN_KEY_SEPERATOR), replaceTokenValue(token, parsedTokenRef.join(TOKEN_REF_SEPERATOR)));
        },
    })(data.value);
    transformedValue.forEach(function (tokenObj, objPath) {
        assignToken(objPath.split(TOKEN_KEY_SEPERATOR), originalToken, tokenObj);
    });
}
function transformCase4(originalToken, objPath, data) {
    deleteTokenObj(originalToken, objPath);
    var parentPaths = objPath.split(TOKEN_KEY_SEPERATOR);
    var foundTokenRefIndex = parentPaths.findIndex(function (tokenKey) {
        return isTokenRef(tokenKey);
    });
    var parsedTokenRef = parseTokenRef(parentPaths[foundTokenRefIndex]);
    parentPaths = parentPaths.splice(0, foundTokenRefIndex);
    // 1. data.token이 토큰 구조 객체를 키(objPath), 값(토큰 객체) 형태로 바꾼다.
    var transformedToken = iterateToken({
        data: new Map(),
        foundTokenObjCallback: function (objPaths, token, _data) {
            _data.set(objPaths.join(TOKEN_KEY_SEPERATOR), token);
        },
    })(data.token);
    // 2. transformedToken의 값을 정의한다.
    var transformedValue = iterateToken({
        data: new Map(),
        foundTokenObjCallback: function (valueObjPaths, token, _data) {
            transformedToken.forEach(function (_, objPath) {
                var newObjPaths = objPath.split(TOKEN_KEY_SEPERATOR);
                var _objPath = __spreadArray(__spreadArray(__spreadArray([], __read(parentPaths), false), __read(newObjPaths), false), __read(valueObjPaths), false).join(TOKEN_KEY_SEPERATOR);
                var tokenValue = __spreadArray(__spreadArray([], __read(parsedTokenRef), false), __read(newObjPaths), false).join(TOKEN_REF_SEPERATOR);
                _data.set(_objPath, replaceTokenValue(token, tokenValue));
            });
        },
    })(data.value);
    transformedValue.forEach(function (tokenObj, objPath) {
        assignToken(objPath.split(TOKEN_KEY_SEPERATOR), originalToken, tokenObj);
    });
}

var generateDesignToken = function (token, baseTokens) {
    if (baseTokens === void 0) { baseTokens = [token]; }
    return parser(transformer(token, baseTokens), baseTokens);
};

export { generateDesignToken as default };
//# sourceMappingURL=index.es.js.map
