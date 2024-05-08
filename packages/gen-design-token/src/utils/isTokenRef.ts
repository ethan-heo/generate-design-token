const isTokenRef = (tokenRef: string) => {
  return /^\{[^{}\s]+\}$/.test(tokenRef);
};

export default isTokenRef;
