/**
 * @description 토큰 객체의 필수 속성이 포함되어 있는지 확인한다
 * @returns
 */
const shouldHaveRequiredProp = (value) => {
    const MUST_HAVE_PROPERTIES = ["$type", "$value"];
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

const isTokenObj = (token) => {
    return shouldHaveRequiredProp(token);
};

const transformPropsToTokenRef = (props) => {
    return props.join(".");
};

/**
 * token 필드를 업데이트하는 메서드와 복제하여 사용하는 메서드를 사용하고 있어 예상치 못한 이슈가 발생할 케이스가 있음.
 * 개선이 필요한 상황.
 * - 복사가 필요한 메서드에서는 부분적으로 deepClone을 통해 해결하고 있음.
 * - 예) map 메서드에서 props가 참조값이 유지되어 반환값이 동일하게 처리되는 경우
 */
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
        const tokenRef = transformPropsToTokenRef(props);
        if (props.length > 0) {
            this.#iterator(this.#token, (props, token) => {
                if (transformPropsToTokenRef(props) === tokenRef) {
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
            if (!isTokenObj(token)) {
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
        this.#iterator(token, (_, token) => {
            if (shouldHaveRequiredProp(token)) {
                if (shouldNotHaveDollarPrefix(token)) {
                    throw new Error(`토큰 객체의 속성값의 이름은 $가 prefix로 시작해야합니다.`);
                }
            }
            else {
                if (shouldHaveDollarPrefix(token)) {
                    throw new Error(`토큰 구조 객체의 속성값의 이름은 $가 prefix로 시작되어서는 안됩니다. ${JSON.stringify(token, null, 2)}`);
                }
            }
        });
    }
    #clone(value) {
        return structuredClone(value);
    }
}

const TOKEN_REF_REGEXP = /\{([^{}]+)\}/;

class UseCase {
    /**
     * 참조 토큰에서 기본 토큰과 동일한 이름을 가진 토큰으로 대체합니다.
     *
     * @param baseToken 변환할 토큰
     * @param referredTokens 기본 토큰에서 참조하는 토큰
     */
    transform(baseToken, referredTokens) {
        const useCases = this.findUseCases(baseToken, referredTokens);
        if (useCases.length === 0)
            return;
        const transformedTokens = [];
        for (const useCase of useCases) {
            const foundReferredToken = this.findReferredToken(transformPropsToTokenRef(useCase[0]), referredTokens);
            if (!foundReferredToken) {
                throw new Error(`정의되지 않은 토큰입니다: ${useCase[0]}`);
            }
            transformedTokens.push({
                useCase,
                transformed: this.transformToken(useCase, foundReferredToken),
            });
        }
        for (const { useCase, transformed } of transformedTokens) {
            const [useCaseProps] = useCase;
            baseToken.delete(useCaseProps);
            for (const [transformedProps, transformedToken] of transformed) {
                baseToken.add(transformedProps, transformedToken);
            }
        }
    }
    /**
     * 주어진 문자열에 토큰 참조가 포함되어 있는지 확인합니다.
     *
     * @param value - 확인할 문자열
     * @returns 토큰 참조가 포함되어 있으면 true를 반환하고, 그렇지 않으면 false를 반환합니다.
     */
    hasTokenRef(value) {
        return TOKEN_REF_REGEXP.test(value);
    }
    /**
     * 주어진 토큰 이름에서 토큰 참조를 추출하고 제공된 토큰 목록에서 검색하여 참조된 토큰을 찾습니다.
     *
     * @param prop - 참조를 추출할 토큰 이름
     * @param tokens - 검색할 토큰 목록
     * @returns 참조된 토큰을 찾으면 T 타입의 토큰을 반환하고, 그렇지 않으면 undefined를 반환합니다.
     */
    findReferredToken(prop, tokens) {
        const tokenRef = this.getTokenRef(prop).slice(1, -1);
        let result;
        for (const token of tokens) {
            const foundToken = token.find((props) => transformPropsToTokenRef(props) === tokenRef);
            if (foundToken) {
                result = foundToken;
                break;
            }
        }
        return result;
    }
    /**
     * 정규식을 사용하여 주어진 토큰 이름에서 토큰 참조를 추출하고 반환합니다.
     *
     * @param prop 참조를 추출할 토큰 이름
     * @returns 추출된 토큰 참조를 문자열로 반환합니다. ex) {color.primary}
     */
    getTokenRef(prop) {
        return prop.match(TOKEN_REF_REGEXP)[0];
    }
    /**
     * 토큰 객체 값을 업데이트합니다.
     *
     * 주어진 문자열에서 {$value} 플레이스홀더를 props 배열을 기반으로 생성된 토큰 객체 참조로 대체합니다.
     *
     * @param value 업데이트할 토큰 객체 값
     * @param props 토큰 객체 참조를 생성하기 위한 속성 배열
     * @returns 업데이트된 토큰 객체 값
     */
    updateTokenObjValue(value, props) {
        return value.replace(`{$value}`, `{${transformPropsToTokenRef(props)}}`);
    }
    isTokenObjByTokens(prop, tokens) {
        const tokenRef = this.getTokenRef(prop);
        const referredToken = this.findReferredToken(tokenRef, tokens);
        if (referredToken && isTokenObj(referredToken[1])) {
            return true;
        }
        return false;
    }
}

class UseCase1 extends UseCase {
    transformToken(useCase, referred) {
        const result = [];
        const [_, useCaseToken] = useCase;
        const [referredProps] = referred;
        result.push([
            [referredProps.at(-1)],
            {
                ...useCaseToken,
                $value: this.updateTokenObjValue(useCaseToken.$value, referredProps),
            },
        ]);
        return result;
    }
    findUseCases(baseToken, referredTokens) {
        return baseToken.findAll((props, token) => {
            const lastProp = props.at(-1);
            if (!this.hasTokenRef(lastProp) || !isTokenObj(token)) {
                return false;
            }
            return this.isTokenObjByTokens(lastProp, referredTokens);
        });
    }
}

class UseCase2 extends UseCase {
    transformToken(useCase, referred) {
        const result = [];
        const [useCaseProps, useCaseToken] = useCase;
        const [referredProps, referredToken] = referred;
        const referredTokenObjs = new Token(referredToken).findAll((_, token) => isTokenObj(token));
        const getNewProps = (useCaseProps, referredProps) => {
            const result = [];
            for (const useCaseProp of useCaseProps) {
                if (this.hasTokenRef(useCaseProp)) {
                    result.push(...referredProps);
                    break;
                }
                else {
                    result.push(useCaseProp);
                }
            }
            return result;
        };
        for (const [referredTokenProps] of referredTokenObjs) {
            result.push([
                getNewProps(useCaseProps, referredTokenProps),
                {
                    ...useCaseToken,
                    $value: this.updateTokenObjValue(useCaseToken.$value, [
                        ...referredProps,
                        ...referredTokenProps,
                    ]),
                },
            ]);
        }
        return result;
    }
    findUseCases(baseToken, referredTokens) {
        return baseToken.findAll((props, token) => {
            const lastProp = props.at(-1);
            if (!this.hasTokenRef(lastProp) || !isTokenObj(token)) {
                return false;
            }
            return !this.isTokenObjByTokens(lastProp, referredTokens);
        });
    }
}

class UseCase3 extends UseCase {
    transformToken(useCase, referred) {
        const result = [];
        const [useCaseProps, useCaseToken] = useCase;
        const [referredProps] = referred;
        const useCaseTokenObjs = new Token(useCaseToken).findAll((_, token) => isTokenObj(token));
        for (const [useCaseTokenObjProps, useCaseTokenObj] of useCaseTokenObjs) {
            result.push([
                [
                    ...useCaseProps.filter((prop) => !this.hasTokenRef(prop)),
                    referredProps.at(-1),
                    ...useCaseTokenObjProps,
                ],
                {
                    ...useCaseTokenObj,
                    $value: this.updateTokenObjValue(useCaseTokenObj.$value, referredProps),
                },
            ]);
        }
        return result;
    }
    findUseCases(baseToken, referredTokens) {
        return baseToken.findAll((props, token) => {
            const lastProp = props.at(-1);
            if (!this.hasTokenRef(lastProp) || isTokenObj(token)) {
                return false;
            }
            return this.isTokenObjByTokens(lastProp, referredTokens);
        });
    }
}

class UseCase4 extends UseCase {
    transformToken(useCase, referred) {
        const result = [];
        const [useCaseProps, useCaseToken] = useCase;
        const [referredProps, referredToken] = referred;
        const referredTokenObjs = new Token(referredToken).findAll((_, token) => isTokenObj(token));
        const useCaseTokenObjs = new Token(useCaseToken).findAll((_, token) => isTokenObj(token));
        for (const [useCaseTokenObjProps, useCaseTokenObj] of useCaseTokenObjs) {
            for (const [referredTokenObjProps] of referredTokenObjs) {
                result.push([
                    [
                        ...useCaseProps.filter((prop) => !this.hasTokenRef(prop)),
                        ...referredTokenObjProps,
                        ...useCaseTokenObjProps,
                    ],
                    {
                        ...useCaseTokenObj,
                        $value: this.updateTokenObjValue(useCaseTokenObj.$value, [
                            ...referredProps,
                            ...referredTokenObjProps,
                        ]),
                    },
                ]);
            }
        }
        return result;
    }
    findUseCases(baseToken, referredTokens) {
        return baseToken.findAll((props, token) => {
            const lastProp = props.at(-1);
            if (!this.hasTokenRef(lastProp) || isTokenObj(token)) {
                return false;
            }
            return !this.isTokenObjByTokens(lastProp, referredTokens);
        });
    }
}

class UseCases {
    #useCases;
    constructor() {
        this.#useCases = [UseCase1, UseCase2, UseCase3, UseCase4].map((UseCase) => new UseCase());
    }
    transform(baseToken, tokens) {
        this.#useCases.forEach((useCase) => useCase.transform(baseToken, tokens));
    }
}

var types = /*#__PURE__*/Object.freeze({
    __proto__: null
});

const generateDesignToken = (base, raws) => {
    const baseToken = new Token(base);
    const useCases = new UseCases();
    const tokens = raws.map((raw) => new Token(raw));
    useCases.transform(baseToken, tokens);
    // parse token
    const parser = (matcher) => {
        let referred;
        const tokenRef = matcher.slice(1, -1);
        for (const token of tokens) {
            referred = token.find((props) => transformPropsToTokenRef(props) === tokenRef);
            if (referred) {
                break;
            }
        }
        return referred ? referred[1].$value : tokenRef;
    };
    const tokenObjs = baseToken.findAll((_, token) => isTokenObj(token));
    for (const [_, tokenObj] of tokenObjs) {
        tokenObj.$value = tokenObj.$value.replace(new RegExp(TOKEN_REF_REGEXP, "g"), parser);
    }
    return baseToken.getToken();
};

export { types as GDTTypes, Token, generateDesignToken as default };
//# sourceMappingURL=index.es.js.map
