export const REFERENCE_VALUE_TOKEN = {
	color: {
		red: {
			$type: "color",
			$value: "#ff0000",
		},
		blue: {
			$type: "color",
			$value: "#0000ff",
		},
		primary: {
			$type: "color",
			$value: "{color.red}",
		},
	},
	border: {
		thin: {
			$type: "string",
			$value: "1px solid {color.red}",
		},
	},
	"box-shadow": {
		$type: "string",
		$value: "2px 5px 5px {color.primary}",
	},
};

export const REFERENCE_KEY_TOKEN = {
	color: {
		red: {
			$type: "color",
			$value: "#ff0000",
		},
		blue: {
			$type: "color",
			$value: "#0000ff",
		},
	},
	border: {
		"{color}": {
			$type: "string",
			$value: "1px solid {$value}",
		},
	},
	"box-shadow": {
		"{color.red}": {
			$type: "string",
			$value: "2px 5px 5px {$value}",
		},
	},
};
