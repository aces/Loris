import {MouseEvent, useEffect, useState, useContext} from 'react';
import {Image, QcStatus} from './types';
import {ScannerContext} from './Session';
import ImageQc from './SessionImageQc';
import ImageButtons from './SessionImageButtons';
import ImageHeaders from './SessionImageHeaders';

interface ImagePanelHeaderProps {
  fileId: number;
  filename: string;
  qcStatus: QcStatus | null;
  bodyExpanded: boolean;
  toggleBody: () => void;
}

function ImagePanelHeader(props: ImagePanelHeaderProps) {
  const expandDirection = props.bodyExpanded ? 'up' : 'down';

  let qcLabel;
  switch (props.qcStatus) {
    case 'Pass':
      qcLabel = 'success';
      break;
    case 'Fail':
      qcLabel = 'danger';
      break;
  }

  return (
    <div className="panel-heading clearfix">
      <input type="checkbox" data-file-id={props.fileId} className="mripanel user-success"/>
      <h3 className="panel-title" data-toggle="tooltip" title={props.filename}>
        {props.filename}
      </h3>
      <span className={`label label-${qcLabel}`}>{props.qcStatus}</span>
      <span onClick={props.toggleBody}
        className={`pull-right clickable glyphicon arrow glyphicon-chevron-${expandDirection}`}
      />
    </div>
  );
}

interface ImagePanelBodyProps {
  image: Image;
}

function ImagePanelBody(props: ImagePanelBodyProps) {
  const [headersExpanded, setHeadersExpanded] = useState<boolean>(false);
  const toggleHeaders = () => setHeadersExpanded(!headersExpanded);

  const openWindowHandler = (e: MouseEvent) => {
    e.preventDefault();
    window.open(
      `${window.location.origin}/brainbrowser/?minc_id=${props.image.FileID}`,
      'BrainBrowser Volume Viewer',
      'location = 0,width = auto, height = auto, scrollbars=yes'
    );
  };

  return (
    <div className="panel-body">
      <div className="row" style={{marginBottom: '10px'}}>
        <div className="col-xs-9 imaging_browser_pic">
          <a href="#noID" onClick={openWindowHandler}>
            <img className="img-checkpic img-responsive"
              src={props.image.APIFile + '/format/thumbnail'}
            />
          </a>
        </div>
        <div className="col-xs-3 mri-right-panel">
          <ImageQc
            fileID={props.image.FileID}
            fileNew={props.image.New}
            hasQcPerm={props.image.HasQCPerm}
            qcStatus={props.image.QCStatus}
            caveat={props.image.Caveat}
            selected={props.image.Selected}
            snr={props.image.SNR}
            seriesUID={props.image.headers.SeriesUID}
            editableCaveat={props.image.EditableCaveat}
            fullName={props.image.FullFilename}
          />
        </div>
      </div>
      <ImageButtons
        FileID={props.image.FileID}
        APIFile={props.image.APIFile}
        OtherTimepoints={props.image.OtherTimepoints}
        files={props.image.files}
        headersExpanded={headersExpanded}
        toggleHeaders={toggleHeaders}
      />
      {headersExpanded ? <ImageHeaders infos={props.image.headers} /> : null}
    </div>
  );
}

interface ImagePanelProps {
  image: Image;
}

/**
 * Image Panel component
 */
function ImagePanel(props: ImagePanelProps) {
  const [bodyExpanded, setBodyExpanded] = useState<boolean>(true);
  const toggleBody = () => setBodyExpanded(!bodyExpanded);

  return (
    <div className="col-xs-12 col-md-6">
      <div className="panel panel-default">
        <ImagePanelHeader
          fileId={props.image.FileID}
          filename={props.image.Filename}
          qcStatus={props.image.QCStatus}
          bodyExpanded={!bodyExpanded}
          toggleBody={toggleBody}
        />
        {bodyExpanded ? <ImagePanelBody image={props.image} /> : null}
      </div>
    </div>
  );
}

interface ImageWrapperProps {
  fileId: number;
}

function ImageWrapper(props: ImageWrapperProps) {
  const [image, setImage] = useState<Image | null>(null);
  const [_, setScanner] = useContext(ScannerContext);
  useEffect(() => {
    fetch(`${window.location.origin}/imaging_browser/getimagedata?fileID=${props.fileId}`,
      {credentials: 'same-origin'})
      .then((response) => response.json())
      .then((image) => {
        setImage(image);
        setScanner(image.ScannerID);
      });
  }, []);

  return image ? <ImagePanel image={image} /> : null;
}

export default ImageWrapper;
