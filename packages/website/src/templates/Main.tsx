import React from "react";
import Layout from "../components/Layout";
import { Flex, Paragraph, Title } from "@ethanheo/ui";
import TitleSection from "../components/TitleSection";

function Main() {
	return (
		<Layout>
			<TitleSection />
			<Flex vertical>
				<Title level={2} variant="primary">
					Overview
				</Title>
				이미지 추가
			</Flex>
			<Flex vertical>
				<Paragraph variant="accent" strong>
					Rule 1.
				</Paragraph>
				<Paragraph variant="accent" strong>
					Rule 2.
				</Paragraph>
				<Paragraph variant="accent" strong>
					Rule 3.
				</Paragraph>
				<Paragraph variant="accent" strong>
					Rule 4.
				</Paragraph>
			</Flex>
		</Layout>
	);
}

export default Main;
