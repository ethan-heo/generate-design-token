import { generateDesignToken } from ".";
import { expect, it } from "vitest";
import baseToken from "./_mocks/baseToken.json";
import referredToken from "./_mocks/referredToken.json";
import generatedToken from "./_mocks/generated.json";
import * as Types from "./types";

it(`generateDesignToken`, () => {
	expect(
		generateDesignToken(baseToken.token as Types.Token, [
			referredToken as Types.Token,
		]),
	).toEqual(generatedToken);
});
