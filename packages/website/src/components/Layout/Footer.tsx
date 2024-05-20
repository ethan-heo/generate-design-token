import React from "react";

import "./Footer.styles.css";
import { Flex, useMediaQuery } from "@ethanheo/ui";

const Footer = () => {
	const platform = useMediaQuery();

	return (
		<footer>
			<Flex className={platform}>Footer????</Flex>
		</footer>
	);
};

export default Footer;
