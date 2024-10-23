/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react";
import "./Layout.styles.css";

import { Flex, GridLine } from "@ethanheo/ui";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<Flex
			className="layout"
			vertical
			column={["col-10", "col-ml-12", "col-mp-11", "col-tl-11", "col-tp-11"]}
		>
			{/* <GridLine /> */}
			<Header />
			<Main>{children}</Main>
			<Footer />
		</Flex>
	);
};

export default Layout;
