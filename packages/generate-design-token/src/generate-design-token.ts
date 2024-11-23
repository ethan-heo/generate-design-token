import * as Types from "@types";
import UseCases from "@use-cases";
import Token from "./token";
import Parser from "./parser";

const generateDesignToken = (
	base: Types.TokenGroup,
	raws: Types.TokenGroup[],
) => {
	const baseToken = new Token(base);
	const rawTokens = raws.map((raw) => new Token(raw));

	return new Parser()
		.parse(new UseCases().transform(baseToken, rawTokens), rawTokens)
		.getToken();
};

export default generateDesignToken;
