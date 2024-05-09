const parseTokenRef = (refTokenName: string) => {
  return refTokenName.slice(1, refTokenName.length - 1).split(".");
};

export default parseTokenRef;
