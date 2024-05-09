import { Token } from "./generateToken.types";
import assignToken from "./utils/assignToken";
import findToken from "./utils/findToken";
import isTokenObj from "./utils/isTokenObj";
import iterateToken from "./utils/iterateToken";
import matchTokenRefs from "./utils/matchTokenRefs";

const parser = (token: Token, baseTokens: Token[]) => {
	return iterateToken<Token>({
		data: {},
		iterateCallback: (tokenNames, token, data) => {
			if (isTokenObj(token)) {
				assignToken(tokenNames, data, {
					...token,
					$value: token.$value.replace(/\{[^{}]+\}/g, (matcher) => {
						const matchedTokenRef = matchTokenRefs(matcher)[0];
						const foundToken = findToken(matchedTokenRef, baseTokens);

						if (foundToken === undefined) {
							throw new Error(`토큰을 찾을 수 없습니다. [${matcher}]`);
						}

						if (!isTokenObj(foundToken)) {
							throw new Error(`토큰 객체가 아닙니다. [${matcher}]`);
						}

						return foundToken.$value;
					}),
				});
			} else {
				assignToken(tokenNames, data, token);
			}
		},
	})(token);
};

export default parser;
