import { expect, it } from "vitest";
import generate from "./generate";
import nPath from "node:path";
import nFs from "node:fs/promises";

const filename = "generate-test-file.css";
const path = nPath.resolve(__dirname, "../_mocks");

it(`헬퍼 함수가 동작하는지 확인한다.`, async () => {
	await generate(
		{
			color: {
				primary: {
					$type: "color",
					$value: "#ff0000",
				},
			},
		},
		{
			filename,
			path,
			template: `
                [data-theme="<%= custom.type %>"] {
                    <% tokens.forEach(function (token) {  %>
                        <% const data = transformCSSVariable(token); %>
                        <%= data.key %>: <%= data.value %>;
                    <%})%>
                }
            `,
			ejsHelper: {
				transformCSSVariable: (tokenData) => {
					return {
						key: `--${tokenData.props.join("-")}`,
						value: tokenData.value.$value,
					};
				},
			},
			ejsData: {
				type: "light",
			},
		},
	);

	expect(async () => {
		const contents = await nFs.readFile(nPath.resolve(path, filename), {
			encoding: "utf-8",
		});
		return contents.includes("--primary-color: #ff0000");
	}).toBeTruthy();
});

it(`옵션을 확인한다.`, async () => [
	/**
	 * filename 에 확장자가 포함되어 있지 않을때
	 */
	await expect(
		generate(
			{},
			{
				filename: "hello",
				path,
				template: ``,
			},
		),
	).rejects.toThrowError(),
	/**
	 * filename 의 값이 문자열이 아닐 때
	 */
	await expect(
		generate(
			{},
			{
				filename: 1 as unknown as string,
				path,
				template: ``,
			},
		),
	).rejects.toThrowError(),
	/**
	 * path 의 값이 문자열이 아닐 때
	 */
	await expect(
		generate(
			{},
			{
				filename,
				path: 1 as unknown as string,
				template: ``,
			},
		),
	).rejects.toThrowError(),
	/**
	 * template 의 값이 문자열이 아닐 때
	 */
	await expect(
		generate(
			{},
			{
				filename,
				path,
				template: 1 as unknown as string,
			},
		),
	).rejects.toThrowError(),
]);
