import { expect, it } from "vitest";
import globalToken from "./_mock/global.tokens.json";
import themeToken from "./_mock/themes.tokens.json";
import themeResultToken from "./_mock/theme.result.tokens.json";
import generateDesignToken from ".";

it(`generateToken`, () => {
	expect(
		generateDesignToken(themeToken, [themeToken, globalToken]),
	).toStrictEqual(themeResultToken);
});
