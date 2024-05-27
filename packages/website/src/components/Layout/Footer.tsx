import React from "react";

import "./Footer.styles.css";
import { Flex, useMediaQuery } from "@ethanheo/ui";

const Footer = () => {
	const platform = useMediaQuery();

	return (
		<footer>
			<Flex
				className={`footer__inner ${platform}`}
				align="center"
				justify="center"
			>
				Copyright (c) {new Date().getFullYear()} ethan-heo
			</Flex>
		</footer>
	);
};

export default Footer;
