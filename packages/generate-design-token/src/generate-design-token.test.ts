import { generateDesignToken } from ".";
import { expect, it } from "vitest";
import baseToken from "./_mocks/baseToken.json";
import referredToken from "./_mocks/referredToken.json";
import generatedToken from "./_mocks/generated.json";

it(`generateDesignToken`, () => {
	expect(generateDesignToken(baseToken.token, [referredToken])).toEqual(
		generatedToken,
	);
});
