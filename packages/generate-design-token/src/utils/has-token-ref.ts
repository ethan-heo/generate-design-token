import { TOKEN_REF_REGEXP } from "@constants";

const hasTokenRef = (tokenRef: string) => {
	return !!tokenRef.match(TOKEN_REF_REGEXP);
};

export default hasTokenRef;
