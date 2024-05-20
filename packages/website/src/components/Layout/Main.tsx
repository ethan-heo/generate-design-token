import React from "react";
import "./Main.styles.css";
import { useMediaQuery } from "@ethanheo/ui";

const Main: React.FC<React.PropsWithChildren> = ({ children }) => {
	const platform = useMediaQuery();

	return <main className={platform}></main>;
};

export default Main;
