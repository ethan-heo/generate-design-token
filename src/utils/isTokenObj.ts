import { Token, TokenObj } from "../generateToken.types";

const isTokenObj = (token: Token | TokenObj): token is TokenObj => {
  const MUST_HAVE_PROPERTIES = ["$type", "$value"];
  const tokenKeys = Object.keys(token);

  return MUST_HAVE_PROPERTIES.every((prop: string) => tokenKeys.includes(prop));
};

export default isTokenObj;
