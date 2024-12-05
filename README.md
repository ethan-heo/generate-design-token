## generate-design-token

![version](./packages/generate-design-token/assets/version.svg)

> GDT is a library that converts the format of design tokens and generates them into files. The design token format follows [the format of community groups](https://www.w3.org/community/design-tokens/)

## Concepts

The purpose of GDTs is to allow you to convert defined design tokens into files in a variety of formats. Along the way, we provide features for easily manipulating and validating design tokens.

## Installing

### Package manager

Using npm:

```bash
npm install generate-design-token
```

Using bower:

```bash
bower install generate-design-token
```

Using yarn:

```bash
yarn add generate-design-token
```

Using pnpm:

```bash
pnpm add generate-design-token
```

## API

### Generate

Generates a file according to a user-defined template format using the given token

**generate(TOKEN_GROUP, config)**

```typescript
generate(
	{
		color: {
			primary: {
				$type: "color",
				$value: "#ff0000",
			},
		},
	},
	{
		filename: FILE_NAME,
		path: CREATE_PATH,
		template: `
			:root {
				<% tokens.forEach(function (token) {  %>
					<% const data = transformCSSVariable(token); %>
					<%= data.key %>: <%= data.value %>;
				<%})%>
			}
	`,
	},
);
```

**Generate configs**

generate API

```typescript
{
	/**
	 * File name to create
	 */
	filename: string;
	/**
	 * Path to the file to create
	 */
	path: string;
	/**
	 * EJS template string and path
	 */
	template: string;
	/**
	 * EJS library options
	 */
	ejsOptions?: EjsOptions;
	/**
	 * Register helper functions to be used in EJS templates
	 */
	ejsHelper?: {
		[key in string]: (tokenData: {
			props: string[];
			value: TOKEN_OBJECT;
			meta: {
				[key in `$${string}`]: any
			};
		}) => any
	};
	/**
	 * prettier library options
	 */
	prettierConfig?: PrettierConfig;
}
```

## Infos

### Token Group

A token group represents the structure of information associated with a token. [link](https://second-editors-draft.tr.designtokens.org/format/#groups-0)

### Token Object

Token objects represent information about the type of token. [link](https://second-editors-draft.tr.designtokens.org/format/#design-token-0)

### License

[MIT](./LICENSE.md)
