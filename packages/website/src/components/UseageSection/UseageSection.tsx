import { Flex, Paragraph, Text, Title } from "@ethanheo/ui";
import React from "react";
import useMediaSection from "../../hooks/useMediaSection";
import "./UseageSection.styles.css";

const UseageSection = () => {
	const section = useMediaSection();

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
					<Paragraph>
						<Text variant="accent" strong>
							참조값
						</Text>
						을 사용하여 정의되어 있는 토큰의 값을 사용할 수 있습니다.
					</Paragraph>
				</li>
				<li>
					<Paragraph>
						단일 속성 뿐만 아니라 복합 속성을 만들 때 서로다른 토큰을 참조할 수
						있습니다.
					</Paragraph>
				</li>
				<li>
					<Paragraph>
						간단한{" "}
						<Text variant="accent" strong>
							규칙
						</Text>
						을 통해 중복내용을 다시 작성하는 수고를 덜 수 있습니다.
					</Paragraph>
				</li>
			</ul>
		</Flex>
	);
};

export default UseageSection;
