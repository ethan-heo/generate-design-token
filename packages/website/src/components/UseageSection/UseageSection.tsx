import { Flex, Paragraph, Title } from "@ethanheo/ui";
import React from "react";
import useMediaSection from "../../hooks/useMediaSection";
import "./UseageSection.styles.css";
import { useI18next } from "gatsby-plugin-react-i18next";

const UseageSection = () => {
	const section = useMediaSection();
	const { t } = useI18next();

	return (
		<Flex className={`useage-section ${section}`} vertical>
			<Title
				className="useage-section__title"
				level={2}
				variant="primary"
				strong
			>
				Useage
			</Title>
			<ul className="useage-section__list">
				<li>
					<Paragraph>{t("useage-section.list.item1")}</Paragraph>
				</li>
				<li>
					<Paragraph>{t("useage-section.list.item2")}</Paragraph>
				</li>
				<li>
					<Paragraph>{t("useage-section.list.item3")}</Paragraph>
				</li>
			</ul>
		</Flex>
	);
};

export default UseageSection;
