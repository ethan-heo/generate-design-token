import React from "react";
import "./Header.styles.css";
import { Flex, useMediaQuery } from "@ethanheo/ui";
import { StaticImage } from "gatsby-plugin-image";
import { Link } from "gatsby";

const Header = () => {
	const platform = useMediaQuery();

	return (
		<header>
			<Flex
				className={`header__inner ${platform}`}
				justify="space-between"
				align="center"
			>
				<Link to="/">
					<StaticImage
						src="../../images/logo-icon.webp"
						alt="generate-design-token logo"
						width={60}
						height={60}
					/>
				</Link>
				<Flex>
					<Link
						to="https://github.com/ethan-heo/generate-design-token"
						target="_blank"
						referrerPolicy="no-referrer"
					>
						<StaticImage
							src="../../images/github-icon.webp"
							alt="ethan-heo github"
							width={24}
							height={24}
						/>
					</Link>
				</Flex>
			</Flex>
		</header>
	);
};

export default Header;
