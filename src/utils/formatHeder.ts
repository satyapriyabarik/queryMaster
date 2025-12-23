const formatHeader = (key: string) =>
  key
    .replace(/_/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase());
export default formatHeader;