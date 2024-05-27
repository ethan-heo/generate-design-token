import { Button, Flex, Title } from "@ethanheo/ui";
import React, { useState } from "react";
import useMediaSection from "../../hooks/useMediaSection";
import JSONEditor from "./JSONEditor";
import "./TryitSection.styles.css";
import { REFERENCE_VALUE_TOKEN, REFERENCE_KEY_TOKEN } from "./constants";
import generateDesignToken from "generate-design-token";

const TryitSection = () => {
	const section = useMediaSection();
	const [value, setValue] = useState(
		JSON.stringify(REFERENCE_VALUE_TOKEN, null, 4)
	);
	const [token, setToken] = useState({});

	const transformObjToString = (obj: Record<any, any>) => {
		return JSON.stringify(obj, null, 4);
	};

	const transformStringToObj = (str: string) => {
		return JSON.parse(str);
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
					참조값
				</Button>
				<Button
					onClick={() =>
						handleSetValue(transformObjToString(REFERENCE_KEY_TOKEN))
					}
				>
					참조키
				</Button>
			</Flex>
			<Flex
				className="tryit-section__editor"
				justify="space-between"
				align="center"
				gap={2}
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
