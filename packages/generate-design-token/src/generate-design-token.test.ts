import generateDesignToken from "./generate-design-token";
import { expect, it } from "vitest";
import base from "./_mocks/base.tokens.json";
import raws from "./_mocks/raws.tokens.json";
import generatedToken from "./_mocks/generated.tokens.json";
import * as Types from "@types";

it(`generateDesignToken`, () => {
	expect(
		generateDesignToken(base.token as Types.TokenGroup, [
			raws as Types.TokenGroup,
		]),
	).toEqual(generatedToken);
});
