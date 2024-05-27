import React, { useState } from "react";
import CodeEditor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css"; //Example style, you can use another
import "./JSONEditor.styles.css";

interface JSONEditorProps {
	value: string;
	onChangeValue?: (value: string) => void;
	className?: string;
	disabled?: boolean;
}

const JSONEditor: React.FC<JSONEditorProps> = ({
	value = "",
	className,
	disabled,
	onChangeValue = () => {},
}) => {
	return (
		<CodeEditor
			textareaClassName={className}
			value={value}
			onValueChange={onChangeValue}
			highlight={(code) => highlight(code, languages.json, "json")}
			tabSize={4}
			padding={16}
			className="json-editor"
			disabled={disabled}
		/>
	);
};

export default JSONEditor;
