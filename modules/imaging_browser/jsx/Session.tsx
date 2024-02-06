import React from 'react';
import Table from './SessionTable';
import Image from './SessionImage';

interface ImagesProps {
  fileIds: number[];
}

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
      <h3 id="panel-main-heading" style={{fontSize: '16px'}}>{title}</h3>
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

function Session(props: SessionProps) {
	return (
		<div style={{display: 'flex', flexDirection: 'column'}}>
			<Table />
			<Images fileIds={props.fileIDs} />
		</div>
	);
}

const RSession = React.createFactory(Session);

(window as any).RSession = RSession;

export default RSession;
