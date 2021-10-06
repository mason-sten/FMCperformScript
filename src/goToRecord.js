import { fmScript } from "./fmScript";

export const goToRecord = async (layoutID, field, value) => {
  try {
    await fmScript("fmc-goto", { layoutID, field, value });
  } catch (e) {
    console.error(e);
    return e;
  }
};
