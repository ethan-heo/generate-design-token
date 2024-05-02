import globalToken from "../../design-token/global.tokens.json";
import lightThemeToken from "../../design-token/light.themes.tokens.json";
import creator from "./creator";
import { Token } from "./generateToken.token";
import mapper from "./mapper";
import parser from "./parser";
import transformer from "./transformer";

type GenerateTokenOptions = {
	token: Token;
	baseTokens: Token[];
	fileName: string;
};

const generateToken = async ({
	token,
	baseTokens,
	fileName,
}: GenerateTokenOptions) => {
	const transformedToken = transformer(token, baseTokens);
	const mappedToken = mapper(transformedToken);
	const parsedToken = parser(mappedToken, baseTokens);

	await creator(parsedToken, fileName);
};

generateToken({
	token: globalToken,
	baseTokens: [globalToken],
	fileName: "global",
});
generateToken({
	token: lightThemeToken,
	baseTokens: [lightThemeToken, globalToken],
	fileName: "light-theme",
});
