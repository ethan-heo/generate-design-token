import { Flex, Paragraph, Text, Title } from "@ethanheo/ui";
import React from "react";
import "./TitleSection.styles.css";
import pkg from "../../../../generate-design-token/package.json";

const TitleSection = () => {
	return (
		<Flex className="title-section section" align="center" vertical>
			<Title className="title-section__title" variant="accent" strong>
				Generate Design Token
			</Title>
			<Flex className="title-section__version" justify="center">
				<Text variant="accent" strong>
					v{pkg.version}
				</Text>
			</Flex>
			<Flex justify="center">
				<Paragraph className="title-section__descripton" variant="accent">
					generate design token 라이브러리는 JSON 형식으로 디자인 토큰을 정의할
					때 편의성을 제공하는 라이브러리입니다.
				</Paragraph>
			</Flex>
		</Flex>
	);
};

export default TitleSection;
