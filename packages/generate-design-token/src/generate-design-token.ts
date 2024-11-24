import { TokenGroup } from "@types";
import * as Modules from "./modules";
import Token from "./token";

const generateDesignToken = (base: TokenGroup, refTokens: TokenGroup[]) => {
	const _refTokens = refTokens.map((token) => new Token(token));

	return Modules.parse(
		Modules.transform(new Token(base), _refTokens, [
			Modules.useCase1,
			Modules.useCase2,
			Modules.useCase3,
			Modules.useCase4,
		]),
		_refTokens,
	).getToken();
};

export default generateDesignToken;
