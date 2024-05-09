## generate-design-token

![version](./assets/version.svg)
![node](./assets/node.svg)
![environment](./assets/env.svg)

> 디자인 토큰을 편리하게 정의할 수 있게 해주는 라이브러리입니다.

## Goal

디자인 토큰을 구성할 때 단일 속성 뿐만아니라 복합 속성을 만들어 사용하기도 합니다. 그리고 여러 단계를 나누어 구현하기도 합니다. 이러한 상황에서 여러 속성의 값을 중복해서 사용하기도 하고 참조해서 사용하기도 합니다. 하지만 수기로 작성했을 때 이러한 과정은 꽤나 불편함을 줄 수 있습니다. 이 라이브러리는 이러한 불편함을 해결하기위한 목적으로 만들어졌습니다.

## Useage

### 1. Install

```bash
npm install -D generate-design-token
// or
yarn add -D generate-design-token
```

### 2. JSON으로 정의된 토큰을 생성합니다.

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

### 3. generate-design-token 모듈을 사용합니다.

```javascript
import generateDesignToken from "generate-design-token";
import token from "<DIR_PATH>/global-token.json";

generateDesignToken(token, [token]); // result JSON
```

## Rules

이 라이브러리는 디자인 토큰을 만들때 편의성을 주기위한 목적으로 만들어졌습니다. 그래서 편의성을 위한 몇가지 규칙을 가지고 있습니다.

### 1. 값을 정의할 때 참조값을 사용하여 속성을 복합적으로 구성할 수 있습니다.

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

### 2. 토큰 구조를 정의할 때 참조값을 사용할 수 있습니다.

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

- 구조적으로 참조값을 사용할 때는 값에서 사용할 위치에 **{$value}**를 정의해주어야 합니다.
- 구조적으로 사용할 수 있는 방법은 4가지가 있습니다.
  1.  참조값이 바라보는 값이 토큰 객체이고 값이 참조값인 경우
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
  2.  참조값이 바라보는 값이 토큰 객체가 아니고 값이 참조값인 경우
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
  3.  참조값이 바라보는 값이 토큰 객체이고 값이 참조값이 아닌 경우
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
  4.  참조값이 바라보는 값이 토큰 객체가 아니고 값이 참조값이 아닌 경우
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

1. 토큰 객체란?
     - 토큰 객체는 토큰의 형식와 값을 정의하기 위한 정보를 가지고 있습니다.
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
    - **color.red** 토큰의 형식은 색상이고, 값은 빨강색입니다.

## Licence

[MIT](./LICENSE.md)