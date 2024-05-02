import { Token } from "../generateToken.token";

const findToken = (token: Token, ref: string[]) => {
	return ref.reduce(
		(result, tokenName) => result?.[tokenName] as any,
		token,
	) as Token | undefined;
};

export default findToken;
