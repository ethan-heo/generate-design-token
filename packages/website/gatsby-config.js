/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

const { languages, defaultLanguage } = require("./languages");

/**
 * @type {import('gatsby').GatsbyConfig}
 */

module.exports = {
	pathPrefix: "/generate-design-token",
	siteMetadata: {
		title: `generate-design-token`,
		description: `디자인 토큰을 손쉽게 다룰 수 있는 라이브러리인 generate-design-token을 소개합니다.`,
		author: `ethan-heo`,
		siteUrl: `https://ethan-heo.github.io/generate-design-token`,
	},
	plugins: [
		`gatsby-plugin-image`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/images`,
			},
		},
		`gatsby-transformer-sharp`,
		`gatsby-plugin-sharp`,
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `gatsby-starter-default`,
				short_name: `starter`,
				start_url: `/`,
				// This will impact how browsers show your PWA/website
				// https://css-tricks.com/meta-theme-color-and-trickery/
				// theme_color: `#663399`,
				display: `minimal-ui`,
				icon: `src/images/logo-icon.webp`, // This path is relative to the root of the site.
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/locales`,
				name: `locale`,
			},
		},
		{
			resolve: "gatsby-plugin-react-i18next",
			options: {
				languages,
				defaultLanguage,
				siteUrl: "https://ethan-heo.github.io/generate-design-token/",
				redirect: true,
				fallbackLanguage: defaultLanguage,
				i18nextOptions: {
					// debug: true,
					fallbackLng: defaultLanguage,
					supportedLngs: languages,
					defaultNS: "common",
					interpolation: {
						escapeValue: false, // not needed for react as it escapes by default
					},
				},
			},
		},
	],
};
