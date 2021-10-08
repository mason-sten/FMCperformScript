import { fmScript } from "./fmScript";

export const setField = async (fieldName: string, value: string) => {
  try {
    const response = await fmScript("fmc-set-field", { fieldName, value });
    return response;
  } catch (e) {
    console.error(e);
    return e;
  }
};
