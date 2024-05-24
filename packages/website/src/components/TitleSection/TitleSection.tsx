import { Flex, Text, Title } from "@ethanheo/ui";
import React from "react";
import "./TitleSection.styles.css";
import pkg from "../../../../generate-design-token/package.json";

const TitleSection = () => {
	return (
		<Flex className="title" align="center" vertical>
			<Title variant="accent" strong>
				Generate Design Token
			</Title>
			<Flex justify="center">
				<Text strong>v{pkg.version}</Text>
			</Flex>
		</Flex>
	);
};

export default TitleSection;
