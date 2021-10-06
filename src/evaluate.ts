import { fmScript } from "./fmScript";

export const evaluate = async (statement: string) => {
  try {
    const response = await fmScript("fmc-evaluate", statement);
    return response;
  } catch (e) {
    console.error(e);
    return e;
  }
};
