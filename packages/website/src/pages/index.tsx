import * as React from "react";
import "@ethanheo/ui/styles/components.css";
import "@ethanheo/ui/styles/light-theme.css";
import "../styles/reset.css";
import "../styles/normalize.css";
import Main from "../templates/Main";
import Seo from "../components/Seo";

const IndexPage = () => <Main />;

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Home" />;

export default IndexPage;
