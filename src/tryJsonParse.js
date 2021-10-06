export const tryJsonParse = (string) => {
  try {
    return JSON.parse(string);
  } catch (e) {
    return string;
  }
};
