import React, {createContext, useState} from 'react';
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
  fileIds: number[];
}

/**
 * View Session Image Panels component
 *
 * @returns The React Element
 */
function Images(props: ImagesProps) {
  const count = props.fileIds.length;
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
      {props.fileIds.map((fileId, key) => (
        <Image key={key} fileId={fileId} />
      ))}
      </div>
    </>
  );
}

interface SessionProps {
  sessionID: number;
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
        <Images fileIds={props.fileIDs} />
      </ScannerContext.Provider>
    </div>
  );
}

const RSession = React.createFactory(Session);

(window as any).RSession = RSession;

export default RSession;
export {
  ScannerContext,
};
