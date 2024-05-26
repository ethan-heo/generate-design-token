import { useMediaQuery } from "@ethanheo/ui";

const useMediaSection = () => {
	const platform = useMediaQuery();

	return `section--width-${platform}`;
};

export default useMediaSection;
