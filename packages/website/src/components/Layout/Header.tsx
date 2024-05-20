import React from "react";
import "./Header.styles.css";
import { Flex, Title } from "@ethanheo/ui";

const Header = () => {
	// const data = useStaticQuery(graphql`
	// 	query SiteTitleQuery {
	// 		site {
	// 			siteMetadata {
	// 				title
	// 			}
	// 		}
	// 	}
	// `);
	return (
		<header>
			<Flex justify="space-between" align="center">
				<Title className="logo" level={2}>
					generate-design-token
				</Title>
				<Flex>
					<div>github</div>
				</Flex>
			</Flex>
		</header>
	);
};

export default Header;
