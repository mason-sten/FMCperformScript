import { tryJsonParse } from "./tryJsonParse";

export const fmScript = async (
  scriptOrScriptID: string | number,
  params?: any,
  option = 5,
  timeout: null | number = null
): Promise<unknown> => {
  try {
    await checkForFileMaker();
  } catch (e) {
    console.log(e);
    return e;
  }
  sendToFmcConnect(scriptOrScriptID, params, option);
  return new Promise(function (resolve, reject) {
    //RESOLVE
    const handleResolve = (results) => resolve(tryJsonParse(results));
    window.handleResults = handleResolve;

    //REJECT
    const handleReject = (error) => reject(new Error(tryJsonParse(error)));
    window.handleError = handleReject;

    //SET TIMEOUT IF VALUE IS PASSED
    if (timeout) {
      setTimeout(() => handleReject({ error: "Timeout" }), timeout);
    }
  });
};

const sendToFmcConnect = (
  scriptOrScriptID: string | number,
  params?: any,
  option = 5
) => {
  const paramString = JSON.stringify({
    scriptOrScriptID,
    params,
    webviewer: window.FM_WEBVIEWER_NAME,
  });

  if (FileMaker.PerformScriptWithOption) {
    FileMaker.PerformScriptWithOption("fmc-performscript", paramString, option);
    return;
  }

  if (FileMaker.PerformScript) {
    console.log(
      "FileMaker.PerformScriptWithOption not present, falling back to FileMaker.PerformScript"
    );
    FileMaker.PerformScript("fmc-performscript", paramString);
    return;
  }
};

const checkForFileMaker = async (): Promise<"SUCCESS" | Error> => {
  return new Promise((resolve, reject) => {
    let trys = 0;
    let id = setInterval(() => {
      if (typeof FileMaker !== "undefined") {
        clearInterval(id);
        resolve("SUCCESS");
      } else if (trys > 9) {
        clearInterval(id);
        reject(new Error("This can only be run from a FileMaker WebViewer"));
      }
      console.log(`Attempt #${trys} to invoke FileMaker`);
      trys++;
    }, 100);
  });
};
