export type TokenObj = {
  $type: "composition" | string;
  $value: string;
};

export type Token = {
  [key: string]: Token | TokenObj;
};

export type SequenceFunction<Result = any, Options = any> = (
  token: Token,
  baseTokens: Token[],
  options?: Options,
) => Result;
