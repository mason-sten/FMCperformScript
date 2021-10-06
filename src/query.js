import { fmScript } from "./fmScript";

export const query = async (query) => {
  try {
    const response = await fmScript("fmc-query", query);
    return response;
  } catch (e) {
    console.error(e);
    return e;
  }
};
