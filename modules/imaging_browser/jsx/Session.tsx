import {createContext, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import Table from './SessionTable';
import Image from './SessionImage';

/**
 * State of the scanner ID used in the context below. It is `null` on initialization and updated
 * once the ID has been retrieved.
 */
type ScannerState = [number | null, (scanner: number) => void];

/**
 * Context used to pass the scanner ID from the image file panels, where it is obtained from the API,
 * to the session table, where the scanner is displayed.
 */
const ScannerContext = createContext<ScannerState>(
  [null, () => {/* Placeholder */}]
);

interface ImagesProps {
  fileIDs: number[];
}

/**
 * View Session Image Panels component
 *
 * @returns The React Element
 */
function Images(props: ImagesProps) {
  const count = props.fileIDs.length;
  let title: string;
  switch (count) {
    case 0:
      title = 'No data available';
      break;
    case 1:
      title = count + ' file displayed';
      break;
    default:
      title = count + ' files displayed';
      break;
  }

  return (
    <>
      <h3 id="panel-main-heading" style={{marginTop: 0, fontSize: '16px'}}>
        {title}
      </h3>
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
      {props.fileIDs.map((fileID, key) => (
        <Image key={key} fileID={fileID} />
      ))}
      </div>
    </>
  );
}

interface SessionProps {
  fileIDs: number[];
}

/**
 * View Session component
 *
 * @returns The React element
 */
function Session(props: SessionProps) {
  const scannerState = useState<number | null>(null);
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <ScannerContext.Provider value={scannerState}>
        <Table />
        <Images fileIDs={props.fileIDs} />
      </ScannerContext.Provider>
    </div>
  );
}

interface SessionWrapperProps {
  sessionID: number;
  output: string | null;
  selected: string | null;
}

/**
 * View Session Wrapper component
 *
 * @returns The React element
 */
function SessionWrapper(props: SessionWrapperProps) {
  const [fileIDs, setFileIDs] = useState<number[] | null>(null);
  useEffect(() => {
    let url = window.location.origin
      + `/imaging_browser/getfiles?sessionID=${props.sessionID}`;

    if (props.output !== null) {
      url += `&output=${props.output}`;
    }

    if (props.selected !== null) {
      url += `&selected=${props.selected}`;
    }

    fetch(url,
      {credentials: 'same-origin'})
      .then((response) => response.json())
      .then((data) => setFileIDs(data.fileIDs));
  }, [props]);

  return fileIDs !== null
    ? <Session fileIDs={fileIDs} />
    : null;
}

window.addEventListener('load', () => {
  const params = new URLSearchParams(window.location.search);
  const sessionID = params.get('sessionID');
  const output = params.get('outputType');
  const selected = params.get('selectedOnly');
  if (sessionID === null) {
    return;
  }

  createRoot(
    document.getElementById('lorisworkspace') as HTMLElement
  ).render(
    <SessionWrapper
      sessionID={parseInt(sessionID)}
      output={output}
      selected={selected}
    />
  );
});

export {
  ScannerContext,
};
