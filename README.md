## generate-design-token

![version](./packages/generate-design-token/assets/version.svg)
![node](./packages/generate-design-token/assets/node.svg)

> It was created to reduce unnecessary duplication of effort when defining design tokens.

## Goal

Makes it convenient to define style properties defined in object form using some rules without having to hardcode them.

## Useage

1. How to use reference values for values
   - Use to use already defined style properties without hard coding them.
   - Define style properties defined in object format in dot notation... ex) color.red
   - Things to keep in mind
     - If you use a reference for a value, the property that the reference points to must be a token object.
       ```json
       {
           "color": {
               "white": {
                   "$type": "color",
                   "$value": "#ffffff",
               },
               "black": {
                   "$type": "color",
                   "$value": "#000000",
               }
           }
           "border-white-thin": {
               "$type": "string",
               "$value": "1px solid {color.white}"
           }
       }
       ```
2. How to use reference values for keys
   - Use when configuring in association with a specific style property.
   - CASE1
     - When the value pointed to by the reference value is a token object and the value configured under it is also a token object, use the
       - before
       ```json
       {
       	"color": {
       		"white": {
       			"$type": "color",
       			"$value": "#ffffff"
       		},
       		"black": {
       			"$type": "color",
       			"$value": "#000000"
       		}
       	},
       	"border": {
       		"{color.white}": {
       			"$type": "string",
       			"$value": "1px solid {$value}"
       		}
       	}
       }
       ```
       - after
       ```json
       {
       	"color": {
       		"white": {
       			"$type": "color",
       			"$value": "#ffffff"
       		},
       		"black": {
       			"$type": "color",
       			"$value": "#000000"
       		}
       	},
       	"border": {
       		"white": {
       			"$type": "string",
       			"$value": "1px solid #ffffff"
       		}
       	}
       }
       ```
   - CASE2
     - When the value pointed to by the reference is a token object and the value constructed under it is a token struct object
       - before
       ```json
       {
       	"color": {
       		"white": {
       			"$type": "color",
       			"$value": "#ffffff"
       		},
       		"black": {
       			"$type": "color",
       			"$value": "#000000"
       		}
       	},
       	"border": {
       		"{color.white}": {
       			"thin": {
       				"$type": "string",
       				"$value": "1px solid {$value}"
       			}
       		}
       	}
       }
       ```
       - after
       ```json
       {
       	"color": {
       		"white": {
       			"$type": "color",
       			"$value": "#ffffff"
       		},
       		"black": {
       			"$type": "color",
       			"$value": "#000000"
       		}
       	},
       	"border": {
       		"white": {
       			"thin": {
       				"$type": "string",
       				"$value": "1px solid #ffffff"
       			}
       		}
       	}
       }
       ```
   - CASE3
     - When the value pointed to by the reference is a token structure object and the value configured in the child is a token object
       - before
       ```json
       {
       	"color": {
       		"white": {
       			"$type": "color",
       			"$value": "#ffffff"
       		},
       		"black": {
       			"$type": "color",
       			"$value": "#000000"
       		}
       	},
       	"border": {
       		"{color}": {
       			"$type": "string",
       			"$value": "1px solid {$value}"
       		}
       	}
       }
       ```
       - after
       ```json
       {
       	"color": {
       		"white": {
       			"$type": "color",
       			"$value": "#ffffff"
       		},
       		"black": {
       			"$type": "color",
       			"$value": "#000000"
       		}
       	},
       	"border": {
       		"white": {
       			"$type": "string",
       			"$value": "1px solid #ffffff"
       		},
       		"black": {
       			"$type": "string",
       			"$value": "1px solid #000000"
       		}
       	}
       }
       ```
   - CASE4
     - When the value pointed to by the reference is a token-structured object and the value configured in the child is a token-structured object
       - before
       ```json
       {
       	"color": {
       		"white": {
       			"$type": "color",
       			"$value": "#ffffff"
       		},
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
       		}
       	}
       }
       ```
       - after
       ```json
       {
       	"color": {
       		"white": {
       			"$type": "color",
       			"$value": "#ffffff"
       		},
       		"black": {
       			"$type": "color",
       			"$value": "#000000"
       		}
       	},
       	"border": {
       		"white": {
       			"thin": {
       				"$type": "string",
       				"$value": "1px solid #ffffff"
       			}
       		},
       		"black": {
       			"thin": {
       				"$type": "string",
       				"$value": "1px solid #000000"
       			}
       		}
       	}
       }
       ```

## Glossary of Terms

- Token Objects
  - Based on the [Design Token Format](https://tr.designtokens.org/format/).
    ```json
    {
    	"$type": "",
    	"$value": ""
    }
    ```
- Token Structure Objects
  - A token structure object is the object structure that makes up a token object.
    ```json
    {
    	"color": {
    		"$type": "",
    		"$value": ""
    	}
    }
    ```
- Single property
  - A single property is when only one style attribute is defined.
    ```json
    {
    	"$type": "color",
    	"$value": "#ffffff"
    }
    ```
- Composite properties
  - A composite property is a single property composed of multiple properties. ex) border.thin
    ```json
    {
    	"color": {
    		"white": {
    			"$type": "color",
    			"$value": "#ffffff"
    		}
    	},
    	"size": {
    		"thin": {
    			"$type": "dimension",
    			"$value": "1px"
    		}
    	},
    	"border": {
    		"thin": {
    			"$type": "string",
    			"$value": "{size.thin} solid {color.white}"
    		}
    	}
    }
    ```

## Licence

[MIT](./LICENSE.md)
