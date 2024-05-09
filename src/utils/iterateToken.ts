import { Token, TokenObj } from "../generateToken.types";
import isTokenObj from "./isTokenObj";
import transformTokenToArray from "./transformTokenToArray";

type IterateTokenOptions<Data> = {
	data: Data;
	foundTokenObjCallback?: (
		tokenNames: string[],
		token: TokenObj,
		data: IterateTokenOptions<Data>["data"],
	) => void;
	iterateCallback?: (
		tokenNames: string[],
		token: Token | TokenObj,
		data: IterateTokenOptions<Data>["data"],
	) => void;
};

const iterateToken =
	<Data>(options: IterateTokenOptions<Data>) =>
	(token: Token) => {
		let stack = transformTokenToArray(token);
		let tokenNames: string[] = [];
		let position: number[] = [stack.length];

		while (stack.length) {
			const [_tokenName, _tokenValue] = stack.shift()!;

			tokenNames.push(_tokenName);

			options.iterateCallback?.(tokenNames, _tokenValue, options.data);

			if (isTokenObj(_tokenValue)) {
				options.foundTokenObjCallback?.(tokenNames, _tokenValue, options.data);

				const _position = [...position];

				for (const count of position.reverse()) {
					tokenNames.pop();

					if (count === 1) {
						_position.pop();
					} else {
						_position[_position.length - 1] -= 1;
						break;
					}
				}

				position = _position;
			} else {
				const items = transformTokenToArray(_tokenValue);

				stack = [...items, ...stack];
				position.push(items.length);
			}
		}

		return options.data;
	};

export default iterateToken;
