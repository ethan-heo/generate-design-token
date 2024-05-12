## generate-design-token

![version](./packages/generate-design-token/assets/version.svg)
![node](./packages/generate-design-token/assets/node.svg)
![environment](./packages/generate-design-token/assets/env.svg)

> A library that allows you to conveniently define design tokens.

## Goal

When constructing design tokens, we often create and use not only single properties, but also compound properties, and we often implement them in multiple steps. In these situations, we may need to duplicate or reference the values of multiple properties. However, this can be quite cumbersome when done by hand. This library was created to solve this problem.

## Useage

### 1. Install

```bash
npm install -D generate-design-token
// or
yarn add -D generate-design-token
```

### 2. Generate a token defined in JSON.

```json
{
	"color": {
		"red": {
			"$type": "color",
			"$value": "#ff0000"
		},
		"yellow": {
			"$type": "color",
			"$value": "#f0f000"
		},
		"blue": {
			"$type": "color",
			"$value": "#0000ff"
		}
	},
	"border": {
		"{color}": {
			"thin": {
				"$type": "dimension",
				"$value": "1px solid {$value}"
			}
		}
	}
}
```

### 3. Use the generate-design-token module.

```javascript
import generateDesignToken from "generate-design-token";
import token from "<DIR_PATH>/global-token.json";

generateDesignToken(token, [token]); // result JSON
```

## Rules

This library is intended to make life easier when creating design tokens, so it has a few conventions for convenience.

### 1. You can compound properties by using reference values when defining values.

```json
{
	"color": {
		"black": {
			"$type": "color",
			"$value": "#000000"
		}
	},
	"border": {
		"width": {
			"1": {
				"$type": "dimension",
				"$value": "1px"
			}
		},
		"style": {
			"solid": {
				"$type": "string",
				"$value": "solid"
			}
		},
		"thin": {
			"$type": "string",
			"$value": "{border.width.1} {border.style.solid} {color.black}"
		}
	}
}
```

### 2. You can use reference values when defining the token structure.

```json
{
	"color": {
		"black": {
			"$type": "color",
			"$value": "#000000"
		}
	},
	"border": {
		"{color}": {
			"thin": {
				"$type": "string",
				"$value": "1px solid {$value}"
			}
		},
		"{color}": {
			"$type": "string",
			"$value": "1px solid {$value}"
		}
	}
}
```

- When using structural references, you need to define **{$value}** where you want to use it in the value.
- There are four ways you can use it structurally.
  1.  If the value being viewed by the reference is a token object and the value is a reference value, the
  ```json
  // before
  {
    "color": {
        "black": {
            "$type": "color",
            "$value": "#000000"
        },
        "white": {
            "$type": "color",
            "$value": "#ffffff"
        }
    },
    "border": {
        "{color.black}": {
            "$type": "string",
            "$value": "1px solid {$value}"
        }
    }
  }
  // after
  {
    "color": {
        "black": {
            "$type": "color",
            "$value": "#000000"
        },
        "white": {
            "$type": "color",
            "$value": "#ffffff"
        }
    },
    "border": {
        "black": {
            "$type": "string",
            "$value": "1px solid #000000"
        }
    }
  }
  ```
  2.  If the value the reference is looking at is not a token object and the value is a reference
  ```json
  //before
  {
    "color": {
        "black": {
            "$type": "color",
            "$value": "#000000"
        },
        "white": {
            "$type": "color",
            "$value": "#ffffff"
        }
    },
    "border": {
        "{color}": {
            "$type": "string",
            "$value": "1px solid {$value}"
        }
    }
  }
  //after
  {
    "color": {
        "black": {
            "$type": "color",
            "$value": "#000000"
        },
        "white": {
            "$type": "color",
            "$value": "#ffffff"
        }
    },
    "border": {
        "black": {
            "$type": "string",
            "$value": "1px solid #000000"
        },
        "white": {
            "$type": "string",
            "$value": "1px solid #ffffff"
        },
    }
  }
  ```
  3.  If the value being viewed by the reference is a token object and the value is not a reference
  ```json
  //before
  {
    "color": {
        "black": {
            "$type": "color",
            "$value": "#000000"
        },
        "white": {
            "$type": "color",
        "$value": "#ffffff"
        }
    },
    "border": {
        "{color.white}": {
            "thin": {
                "$type": "string",
                "$value": "1px solid {$value}"
            },
            "medium": {
                "$type": "string",
                "$value": "2px solid {$value}"
            }
        }
    }
  }
  //after
  {
    "color": {
        "black": {
            "$type": "color",
            "$value": "#000000"
        },
        "white": {
            "$type": "color",
            "$value": "#ffffff"
        }
    },
    "border": {
        "white": {
            "thin": {
                "$type": "string",
                "$value": "1px solid #ffffff"
            },
            "medium": {
                "$type": "string",
                "$value": "2px solid #ffffff"
            }
        },
    }
  }
  ```
  4.  If the value that the reference value looks at is not a token object and the value is not a reference value
  ```json
  //before
  {
    "color": {
        "black": {
            "$type": "color",
            "$value": "#000000"
        },
        "white": {
            "$type": "color",
            "$value": "#ffffff"
        }
        },
    "border": {
            "{color}": {
                "thin": {
                    "$type": "string",
                    "$value": "1px solid {$value}"
                },
                "medium": {
                    "$type": "string",
                    "$value": "2px solid {$value}"
                }
            }
    }
  }
  //after
  {
    "color": {
            "black": {
                "$type": "color",
                "$value": "#000000"
            },
            "white": {
                "$type": "color",
                "$value": "#ffffff"
            }
    },
    "border": {
            "white": {
                "thin": {
                    "$type": "string",
                    "$value": "1px solid #ffffff"
                },
                "medium": {
                    "$type": "string",
                    "$value": "2px solid #ffffff"
                }
            },
            "black": {
                "thin": {
                    "$type": "string",
                    "$value": "1px solid #000000"
                },
                "medium": {
                    "$type": "string",
                    "$value": "2px solid #000000"
                }
            }
        }
  }
  ```

## FAQ

1. What is a Token Object?
     - Token objects hold information to define the format and value of a token.
    ```json
    {
        "color": {
            "red": {
                "$type": "color",
                "$value": "#ff0000",
            }
        }
    }
    ```
    - The **color.red** token has the format color, and the value is red.

## Licence

[MIT](./LICENSE.md)