import { tryJsonParse } from "./tryJsonParse";

const runScript = (scriptOrScriptID, params, option) => {
  const paramString = JSON.stringify({
    scriptOrScriptID,
    params,
    webviewer: window.FM_WEBVIEWER_NAME,
  });
  let trys = 0;
  try {
    let intervalId = setInterval(() => {
      if (trys > 10) {
        clearInterval(intervalId);
        throw new Error("This can only be run from a web viewer");
      }

      if (FileMaker) {
        clearInterval(intervalId);
      }

      trys++;
    }, 100);
    if (FileMaker.PerformScriptWithOption) {
      FileMaker.PerformScriptWithOption(
        "fmc-performscript",
        paramString,
        option
      );
    } else {
      console.log(
        "FileMaker.PerformScriptWithOption not present, falling back to FileMaker.PerformScript"
      );
      FileMaker.PerformScript("fmc-performscript", paramString);
    }
  } catch (e) {
    console.error(e);
  }
};

export const fmScript = async (
  scriptOrScriptID,
  params,
  option = 5,
  timeout = null
) => {
  runScript(scriptOrScriptID, params, option);
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
