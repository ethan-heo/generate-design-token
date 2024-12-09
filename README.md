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

You can generate a file or string based on an EJS template.

#### generateContents(TOKEN_GROUP, config)

```typescript
const contents = generate(
	{
		color: {
			primary: {
				$type: "color",
				$value: "#ff0000",
			},
		},
	},
	{
		extname: "css",
		template: {
			contents: `
					:root {
						<% tokens.forEach(function (token) {  %>
							<% const data = transformCSSVariable(token); %>
							<%= data.key %>: <%= data.value %>;
						<%})%>
					}
			`,
		},
		ejsHelper: {
			transformCSSVariable: (tokenData: EJSTemplateTokenData) => {
				return {
					key: `--${tokenData.props.join("-")}`,
					value: tokenData.value.$value,
				};
			},
		},
	},
);
```

**Configs**

```typescript
{
	/**
	 * File extension
	 */
	extname: string;
	/**
	 * EJS template and template path, one or the
	 * other must be defined unconditionally. If you
	 * define both, content takes precedence over
	 */
	template: {
		content?: string;
		path?: string
	};
	/**
	 * Custom EJS template data
	 */
	ejsData?: Record<string, any>
	/**
	 * EJS library options
	 */
	ejsOptions?: EjsOptions;
	/**
	 * Register helper functions to be used in
	 * EJS templates
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

#### generateFile(TOKEN_GROUP, config)

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
		filename: "variables.css",
		outputPath: OUTPUT_PATH
		template: {
			contents: `
					:root {
						<% tokens.forEach(function (token) {  %>
							<% const data = transformCSSVariable(token); %>
							<%= data.key %>: <%= data.value %>;
						<%})%>
					}
			`
		},
		ejsHelper: {
			transformCSSVariable: (tokenData: EJSTemplateTokenData) => {
					return {
						key: `--${tokenData.props.join("-")}`,
						value: tokenData.value.$value,
					};
				}
		}
	},
);
```

**Configs**

```typescript
{
	/**
	 * filename
	 */
	filename: string;
	/**
	 * output path
	 */
	outputPath: string;
	/**
	 * EJS template and template path, one or the
	 * other must be defined unconditionally. If you
	 * define both, content takes precedence over
	 */
	template: {
		content?: string;
		path?: string
	};
	/**
	 * Custom EJS template data
	 */
	ejsData?: Record<string, any>
	/**
	 * EJS library options
	 */
	ejsOptions?: EjsOptions;
	/**
	 * Register helper functions to be used in
	 * EJS templates
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

### Data and default helper functions available in EJS templates

#### Data

**tokens**

An array consisting of information from token objects and groups.

```typescript
{
	props: string[];
	value: TokenObj | TokenGroup;
	meta: Record<`$${string}`, any>;
}
```

- **props**: Array of property names where token objects and groups are located
- **value**: Token objects and groups
- **meta**: Meta-information except $type, $value contained in token objects and groups

**topLevelMeta**

Metadata at the top of the token group

#### Default helper functions

Default helper functions available in EJS templates

**isTokenObj**

The value of the token data determines whether it is a token object or not.

example:

```ejs
<% tokens.forEach(function (token) {  %>
	<% if (!isTokenObj(token.value)) return %>
<%})%>
```

## Transform

Structural transformations are used to effectively use duplicate structures. When writing defined style attributes in JSON, duplication of values could be resolved with reference values, but not structurally. For example, here's an example of a case like this

```json
{
	"color": {
		"primary": {
			"$type": "color",
			"$value": "#ff0000"
		},
		"secondary": {
			"$type": "color",
			"$value": "#00ff00"
		}
	},
	"border": {
		"thin": {
			"primary": {
				"$type": "border",
				"$value": {
					"width": "1px",
					"style": "solid",
					"color": "{color.primary}"
				}
			},
			"secondary": {
				"$type": "border",
				"$value": {
					"width": "1px",
					"style": "solid",
					"color": "{color.primary}"
				}
			}
		}
	}
}
```

In this case, we are color-coding specific attributes inside the border, and the same structure is repeated as the number of specific attributes increases. To solve this problem, we thought of programming repeated use by utilizing structural generalization. The parts that can be utilized can be divided into the subject of the reference value and the structure of the attribute to be utilized.

The subject of the reference value represents a token object or a group of tokens. As shown above, if you use all of the color property values, the token group is the subject, and if you use one of the color property values, the token object is the subject.

The structure of the attribute you want to utilize indicates the structure in which you want to use the repeated element. In the example above, the property value of border would be that structure. Within the structure, how the repeated element is represented depends on whether it is followed by a token object or a group of tokens.

There are four cases that can be defined

1. when the iterator is a token object and the structure of the property it utilizes is a token object.
2. when the iterator is a token object and the structure of the utilized attributes is a group of tokens.
3. when the iterator is a token group and the structure of the utilized attribute is a token object
4. when the iterator is a group of tokens and the structure of the utilized property is a group of tokens.

Based on the number of these cases, the structure conversion proceeds.

Case1.

```json
// before
{
	"border": {
    "thin": {
      "{color.primary}": {
        "$type": "border",
        "$value": {
          "width": "1px",
          "style": "solid",
          "color": "{$value}"
        }
      }
    }
	}
}

//after
{
	"border": {
		"thin": {
			"primary": {
				"$type": "border",
				"$value": {
					"width": "1px",
					"style": "solid",
					"color": "{color.primary}"
				}
			}
		}
	}
}
```

Case2.

```json
// before
{
	"border": {
    "{color.primary}": {
      "thin": {
				"$type": "border",
				"$value": {
					"width": "1px",
					"style": "solid",
					"color": "{$value}"
				}
			},
			"thick": {
				"$type": "border",
				"$value": {
					"width": "2px",
					"style": "solid",
					"color": "{$value}"
				}
			}
    }
	}
}

// after
{
	"border": {
		"primary": {
			"thin": {
				"$type": "border",
				"$value": {
					"width": "1px",
					"style": "solid",
					"color": "{color.primary}"
				}
			},
			"thick": {
				"$type": "border",
				"$value": {
					"width": "2px",
					"style": "solid",
					"color": "{color.primary}"
				}
			}
		}
	}
}
```

Case3.

```json
// before
{
	"border": {
    "thin": {
      "{color}": {
				"$type": "border",
				"$value": {
					"width": "1px",
					"style": "solid",
					"color": "{$value}"
				}
			}
    }
	}
}

// after
{
	"border": {
    "thin": {
      "primary": {
        "$type": "border",
        "$value": {
          "width": "1px",
          "style": "solid",
          "color": "{color.primary}"
        }
      },
      "secondary": {
        "$type": "border",
        "$value": {
          "width": "1px",
          "style": "solid",
          "color": "{color.secondary}"
        }
      }
    }
  }
}
```

Case4.

```json
// before
{
	"border": {
    "{color}": {
      "thin": {
        "$type": "border",
        "$value": {
          "width": "1px",
          "style": "solid",
          "color": "{$value}"
        }
      },
      "thick": {
        "$type": "border",
        "$value": {
          "width": "2px",
          "style": "solid",
          "color": "{$value}"
        }
      },
    },
	}
}

// after
{
	"border": {
		"primary": {
			"thin": {
				"$type": "border",
				"$value": {
					"width": "1px",
					"style": "solid",
					"color": "{color.primary}"
				}
			},
			"thick": {
				"$type": "border",
				"$value": {
					"width": "2px",
					"style": "solid",
					"color": "{color.primary}"
				}
			}
		},
		"secondary": {
			"thin": {
				"$type": "border",
				"$value": {
					"width": "1px",
					"style": "solid",
					"color": "{color.secondary}"
				}
			},
			"thick": {
				"$type": "border",
				"$value": {
					"width": "2px",
					"style": "solid",
					"color": "{color.thick}"
				}
			}
		}
	}
}
```

## Infos

### Token Group

A token group represents the structure of information associated with a token. [link](https://second-editors-draft.tr.designtokens.org/format/#groups-0)

### Token Object

Token objects represent information about the type of token. [link](https://second-editors-draft.tr.designtokens.org/format/#design-token-0)

## License

[MIT](./LICENSE.md)
