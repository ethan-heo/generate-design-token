import { expect, it } from "vitest";
import {
	generateContents,
	EJSTemplateTokenData,
	EJSTemplateTopLevelMetaData,
} from "./generate";

it(`템플릿 데이터 및 헬퍼함수 활용`, async () => {
	const contents = await generateContents(
		{
			$type: "light",
			$description: "light 테마",
			color: {
				primary: {
					$type: "color",
					$value: "#ff0000",
					$description: "primary color",
				},
			},
		},
		{
			extname: "css",
			template: {
				contents: `
					<% transformComments(topLevelMeta) %>
					[data-theme="<%= topLevelMeta.$type %>"] {
						<% tokens.forEach(function (token) {  %>
							<% if (!isTokenObj(token.value)) return %>
							<% const data = transformCSSVariable(token); %>
							<%= data.comments %>
							<%= data.key %>: <%= data.value %>;
						<%})%>
					}
				`,
			},
			ejsHelper: {
				transformComments: (topLevelMetaData: EJSTemplateTopLevelMetaData) => {
					return `/*
						${topLevelMetaData.$description}
					*/`;
				},
				transformCSSVariable: (tokenData: EJSTemplateTokenData) => {
					// console.log(tokenData);
					return {
						key: `--${tokenData.props.join("-")}`,
						value: tokenData.value.$value,
						comments: `
							/*
								${tokenData.meta.$description}
							*/
						`,
					};
				},
			},
			ejsData: {
				type: "light",
			},
		},
	);

	const expected = [
		'[data-theme="light"]',
		"--color-primary: #ff0000;",
		"primary color",
	];

	expect(expected.every((str) => contents.includes(str))).toBeTruthy();
});
