import * as React from "react";

import "@ethanheo/ui/styles/components.css";
import "@ethanheo/ui/styles/light-theme.css";
import "../styles/reset.css";
import "../styles/normalize.css";
import Main from "../templates/Main";
import Seo from "../components/Seo";
import { graphql } from "gatsby";

const IndexPage = () => <Main />;

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = (props) => {
	return <Seo title="Home" />;
};

export default IndexPage;

export const query = graphql`
	query ($language: String!) {
		locales: allLocale(
			filter: { ns: { in: ["common", "index"] }, language: { eq: $language } }
		) {
			edges {
				node {
					ns
					data
					language
				}
			}
		}
	}
`;
