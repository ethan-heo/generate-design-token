import * as Types from "./types";
import Token from "./Token";
import UseCases from "./useCases";
import Parser from "./Parser";

const generateDesignToken = (
	base: Types.TokenGroup,
	raws: Types.TokenGroup[],
) => {
	const baseToken = new Token(base);
	const rawTokens = raws.map((raw) => new Token(raw));
	const useCases = new UseCases();
	const parser = new Parser(baseToken, rawTokens);

	useCases.transform(baseToken, rawTokens);
	parser.parse();

	return baseToken.getToken();
};

export default generateDesignToken;
