import { Button, Flex, Platform, Title, useMediaQuery } from "@ethanheo/ui";
import React, { useState } from "react";
import useMediaSection from "../../hooks/useMediaSection";
import JSONEditor from "./JSONEditor";
import "./TryitSection.styles.css";
import { REFERENCE_VALUE_TOKEN, REFERENCE_KEY_TOKEN } from "./constants";
import generateDesignToken from "generate-design-token";
import { useI18next } from "gatsby-plugin-react-i18next";

const transformObjToString = (obj: Record<any, any>) => {
	return JSON.stringify(obj, null, 4);
};
const transformStringToObj = (str: string) => {
	return JSON.parse(str);
};

const TryitSection = () => {
	const section = useMediaSection();
	const platform = useMediaQuery();
	const [value, setValue] = useState(
		transformObjToString(REFERENCE_VALUE_TOKEN)
	);
	const [token, setToken] = useState({});
	const { t } = useI18next();
	const TRYIT_LAYOUT_BY_PLATFORM: Record<Platform, any> = {
		desktop: {
			gap: 2,
			align: "center",
		},
		tablet: {
			gap: 2,
			align: "center",
		},
		"mobile-landscape": {
			gap: 2,
			justify: "center",
			align: "center",
			vertical: true,
		},
		"mobile-portrait": {
			gap: 2,
			justify: "center",
			align: "center",
			vertical: true,
		},
	};

	const handleGenerateToken = () => {
		try {
			const parsedToken = transformStringToObj(value);
			const generatedToken = generateDesignToken(parsedToken, [parsedToken]);

			setToken(generatedToken);
		} catch (e) {
			console.error(e);
		}
	};
	const handleSetValue = (value: string) => {
		setValue(value);
	};

	return (
		<Flex
			className={`tryit-section ${section}`}
			vertical
			justify="space-between"
		>
			<Title
				className="tryit-section__title"
				variant="primary"
				strong
				level={2}
			>
				Try it
			</Title>
			<Flex className="tryit-section__examples" gap={1}>
				<Button
					onClick={() =>
						handleSetValue(transformObjToString(REFERENCE_VALUE_TOKEN))
					}
				>
					{t("tryit-section.example1")}
				</Button>
				<Button
					onClick={() =>
						handleSetValue(transformObjToString(REFERENCE_KEY_TOKEN))
					}
				>
					{t("tryit-section.example2")}
				</Button>
			</Flex>
			<Flex
				className="tryit-section__editor"
				{...TRYIT_LAYOUT_BY_PLATFORM[platform]}
			>
				<JSONEditor value={value} onChangeValue={setValue} />
				<Button variant="primary" onClick={handleGenerateToken}>
					Try
				</Button>
				<JSONEditor
					disabled
					value={transformObjToString(generateDesignToken(token, [token]))}
				/>
			</Flex>
		</Flex>
	);
};

export default TryitSection;
