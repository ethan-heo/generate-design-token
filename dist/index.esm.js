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
    var _tokenRef = tokenRef;
    var result;
    var _tokens = __spreadArray([], __read(tokens), false);
    while (_tokens.length) {
        var tokenKeys = _tokenRef.split(TOKEN_REF_SEPERATOR);
        var token = tokenKeys.reduce(function (result, tokenKey) { return result === null || result === void 0 ? void 0 : result[tokenKey]; }, _tokens.shift());
        if (token === undefined) {
            continue;
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

/**
 * TODO
 * - 리팩토링 필요
 */
var transformer = function (token, baseTokens) {
    var skipTokenNames = [];
    return iterateToken({
        data: {},
        iterateCallback: function (tokenNames, token, data) {
            var _tokenNames = __spreadArray([], __read(tokenNames), false);
            var _tokenName = _tokenNames.pop();
            if (isTokenRef(_tokenName)) {
                var _token = token;
                var matchedTokenRef_1 = matchTokenRefs(_tokenName)[0];
                var foundToken = findToken(matchedTokenRef_1, baseTokens);
                if (foundToken === undefined) {
                    throw new Error("\uD1A0\uD070\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. [".concat(_tokenName, "]"));
                }
                var splitedMatchedTokenRef_1 = matchedTokenRef_1.split(TOKEN_REF_SEPERATOR);
                if (isTokenObj(foundToken) && isTokenObj(token)) {
                    splitedMatchedTokenRef_1.shift();
                    assignToken(splitedMatchedTokenRef_1, (_token = {}), replaceTokenValue(token, matchedTokenRef_1));
                }
                if (isTokenObj(foundToken) && !isTokenObj(token)) {
                    splitedMatchedTokenRef_1.shift();
                    _token = iterateToken({
                        data: {},
                        foundTokenObjCallback: function (__tokenNames, __token, __data) {
                            assignToken(__spreadArray(__spreadArray([], __read(splitedMatchedTokenRef_1), false), __read(__tokenNames), false), __data, replaceTokenValue(__token, matchedTokenRef_1));
                        },
                    })(token);
                }
                if (!isTokenObj(foundToken) && isTokenObj(token)) {
                    _token = iterateToken({
                        data: {},
                        foundTokenObjCallback: function (__tokenNames, __token, __data) {
                            assignToken(__tokenNames, __data, replaceTokenValue(token, __spreadArray(__spreadArray([], __read(splitedMatchedTokenRef_1), false), [__tokenNames], false).join(TOKEN_REF_SEPERATOR)));
                        },
                    })(foundToken);
                }
                if (!isTokenObj(foundToken) && !isTokenObj(token)) {
                    _token = iterateToken({
                        data: {},
                        foundTokenObjCallback: function (__tokenNames, __token, __data) {
                            iterateToken({
                                data: {},
                                foundTokenObjCallback: function (___tokenNames, ___token, ___data) {
                                    assignToken(__spreadArray(__spreadArray([], __read(__tokenNames), false), __read(___tokenNames), false), __data, replaceTokenValue(___token, __spreadArray(__spreadArray([], __read(splitedMatchedTokenRef_1), false), [__tokenNames], false).join(TOKEN_REF_SEPERATOR)));
                                },
                            })(token);
                        },
                    })(foundToken);
                }
                if (_tokenName.length === 0 && isTokenObj(_token)) {
                    throw new Error("\uCD5C\uC0C1\uC704 \uB808\uBCA8\uC5D0 \uD1A0\uD070 \uAC1D\uCCB4\uB97C \uC815\uC758\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. ".concat(tokenNames.join(".")));
                }
                deleteToken(tokenNames, data);
                assignToken(_tokenNames, data, _token);
                skipTokenNames.push(__spreadArray([], __read(tokenNames), false));
            }
            else {
                if (!skipAssignToken(tokenNames)) {
                    assignToken(tokenNames, data, token);
                }
            }
        },
    })(token);
    function deleteToken(tokenNames, data) {
        var e_1, _a;
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
        delete data[target];
    }
    function skipAssignToken(tokenNames) {
        var tokenNamesStr = tokenNames.join(TOKEN_REF_SEPERATOR);
        return skipTokenNames.some(function (skipTokenName) {
            return tokenNamesStr.includes(skipTokenName.join(TOKEN_REF_SEPERATOR));
        });
    }
    function replaceTokenValue(token, replacer) {
        return __assign(__assign({}, token), { $value: token.$value.replace("$value", replacer) });
    }
};

var generateDesignToken = function (token, baseTokens) {
    return parser(transformer(token, baseTokens), baseTokens);
};

export { generateDesignToken as default };
//# sourceMappingURL=index.esm.js.map
