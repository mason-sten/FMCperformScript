import { tryJsonParse } from "./src/tryJsonParse";

export const fmScript = async (
  scriptOrScriptID,
  params,
  option = 5,
  timeout = null
) => {
  FileMaker.PerformScriptWithOption(
    "fm-bridge",
    JSON.stringify({
      scriptOrScriptID,
      params,
      webviewer: window.FM_WEBVIEWER_NAME,
    }),
    option
  );
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
