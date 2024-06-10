## generate-design-token

![version](./packages/generate-design-token/assets/version.svg)
![node](./packages/generate-design-token/assets/node.svg)

> 디자인 토큰을 정의할 때 불필요한 중복 작업을 줄이기 위해 만들어 졌습니다.

## Goal

객체 형태로 정의된 스타일 속성을 하드코딩 할 필요 없이 몇몇 규칙을 사용하여 편리하게 정의할 수 있게 만듭니다.

## Useage

1. 값에 참조값을 사용하는 방법
   - 이미 정의된 스타일 속성을 하드 코딩하지 않고 사용하기 위해 사용합니다.
   - 객체 형식으로 정의된 스타일 속성을 점 표기법으로 정의합니다.. ex) color.red
   - 유의할 내용
     - 값에 참조값을 사용하는 경우 참조값이 가리키는 속성은 토큰 객체여야만 합니다.
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
2. 키에 참조값을 사용하는 방법
   - 특정 스타일 속성과 연관하여 구성할 때 사용합니다.
   - CASE1
     - 참조값이 가리키는 값이 토큰 객체이고 하위에 구성된 값이 토큰 객체 일 때
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
     - 참조값이 가리키는 값이 토큰 객체이고 하위에 구성된 값이 토큰 구조 객체 일 때
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
     - 참조값이 가리키는 값이 토큰 구조 객체이고 하위에 구성된 값이 토큰 객체 일 때
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
     - 참조값이 가리키는 값이 토큰 구조 객체이고 하위에 구성된 값이 토큰 구조 객체 일 때
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

- 토큰 객체
  - [디자인 토큰 포맷](https://tr.designtokens.org/format/)을 참고하여 만들어 졌습니다.
    ```json
    {
    	"$type": "",
    	"$value": ""
    }
    ```
- 토큰 구조 객체
  - 토큰 구조 객체는 토큰 객체를 구성하는 객체 구조입니다.
    ```json
    {
    	"color": {
    		"$type": "",
    		"$value": ""
    	}
    }
    ```
- 단일 속성
  - 단일 속성은 단 하나의 스타일 속성만 정의된 것을 말합니다.
    ```json
    {
    	"$type": "color",
    	"$value": "#ffffff"
    }
    ```
- 복합 속성
  - 복합 속성은 단일 속성을 여러개로 구성한 것을 말합니다. ex) border.thin
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
