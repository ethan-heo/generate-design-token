/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ actions }) => {
	const { createPage } = actions;
	createPage({
		path: "/",
		component: require.resolve("./src/pages/index.js"),
		context: {},
		defer: true,
	});
};
