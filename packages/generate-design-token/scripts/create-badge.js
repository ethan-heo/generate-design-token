const packages = require("../package.json") 
const { makeBadge } = require("badge-maker");
const fs = require("fs/promises");

const LABEL = {
	version: {
		label: "version",
		message: packages.version,
		labelColor: "#555",
		color: "#4c1",
		style: "flat",
	},
	node: {
		label: "node",
		message: packages.engines.node,
		labelColor: "#555",
		color: "#4c1",
		style: "flat",
	},
	env: {
		label: "environment",
		message: "node",
		labelColor: "#555",
		color: "#4c1",
		style: "flat",
	},
};

const OUTPUT_PATH = "./assets";

const create = async () => {
	for (const [name, option] of Object.entries(LABEL)) {
		const svg = makeBadge(option);
		await fs.mkdir(OUTPUT_PATH, { recursive: true });
		await fs.writeFile(`${OUTPUT_PATH}/${name}.svg`, svg, "utf-8");
	}
};

create();
