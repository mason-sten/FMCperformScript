import { tryJsonParse } from "./tryJsonParse";

export const fmScript = async (
  scriptOrScriptID: string | number,
  params?: any,
  option = 5,
  timeout: null | number = null
): Promise<unknown> => {
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
  if (!FileMaker) {
    fetch(
      `fmp://$/${FM_FILENAME}?script=fmc-performscript&param=${paramString}`
    );
    return;
  }

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
