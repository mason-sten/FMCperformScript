declare global {
  var FM_WEBVIEWER_NAME: string;
  var FM_FILENAME: string;
  var FileMaker: FileMaker;
  var handleResults: (results: any) => void;
  var handleError: (error: any) => void;
}

type FileMaker = {
  PerformScript: Function;
  PerformScriptWithOption?: Function;
};

export {};
