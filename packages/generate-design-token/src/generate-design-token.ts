import Token from "./modules/token";
import { TokenGroup } from "./types/token.types";
import transform from "./modules/transform";
import {
	useCase1,
	useCase2,
	useCase3,
	useCase4,
} from "./modules/transform-use-cases";
import parse from "./modules/parse";

const generateDesignToken = (base: TokenGroup, refTokens: TokenGroup[]) => {
	const _refTokens = refTokens.map((token) => new Token(token));

	return parse(
		transform(new Token(base), _refTokens, [
			useCase1,
			useCase2,
			useCase3,
			useCase4,
		]),
		_refTokens,
	).getToken();
};

export default generateDesignToken;
