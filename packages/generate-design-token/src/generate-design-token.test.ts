import generateDesignToken from "./generate-design-token";
import { expect, it } from "vitest";
import base from "./_mocks/base.tokens.json";
import raws from "./_mocks/raws.tokens.json";
import generatedToken from "./_mocks/generated.tokens.json";

it(`generateDesignToken`, () => {
	// console.log(JSON.stringify(generateDesignToken(base.token, [raws]), null, 2));
	expect(generateDesignToken(base.token, [raws])).toEqual(generatedToken);
});
