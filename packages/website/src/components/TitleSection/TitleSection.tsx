import { Flex, Paragraph, Text, Title } from "@ethanheo/ui";
import React from "react";
import "./TitleSection.styles.css";
import pkg from "../../../../generate-design-token/package.json";
import useMediaSection from "../../hooks/useMediaSection";
import { useI18next } from "gatsby-plugin-react-i18next";

const TitleSection = () => {
	const section = useMediaSection();
	const { t } = useI18next();

	return (
		<Flex className={`title-section ${section}`} align="center" vertical>
			<Title className="title-section__title" variant="secondary" strong>
				{t("title-section.title")}
			</Title>
			<Flex className="title-section__version" justify="center">
				<Text variant="secondary" strong>
					v{pkg.version}
				</Text>
			</Flex>
			<Flex justify="center">
				<Paragraph className="title-section__description" variant="secondary">
					{t("title-section.description")}
				</Paragraph>
			</Flex>
		</Flex>
	);
};

export default TitleSection;
