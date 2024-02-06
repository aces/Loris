import React, { Component, MouseEvent, useEffect, useState } from 'react';
import { QcStatus } from './types';
import ImagePanelInfos from './ImagePanelInfos';
import ImagePanelQc from './ImagePanelQc';
import ImagePanelButtons from './ImagePanelButtons';
import { Image } from './types';

interface ImagePanelHeaderProps {
  fileId: number;
  filename: string;
  qcStatus: QcStatus;
  headerExpanded: boolean;
  bodyExpanded: boolean;
  onToggleBody: () => void;
  onToggleHeaders: () => void;
}

function ImagePanelHeader(props: ImagePanelHeaderProps) {
  let qcLabel;
  switch (props.qcStatus) {
    case 'Pass':
      qcLabel = "success";
      break;
    case 'Fail':
      qcLabel = "danger";
      break;
  }

  const expandDirection = props.bodyExpanded ? "up" : "down";
  return (
    <div className="panel-heading clearfix">
      <input type="checkbox" data-file-id={props.fileId} className="mripanel user-success"/>
      <h3 className="panel-title" data-toggle="tooltip" title={props.filename}>
        {props.filename}
      </h3>
      <span className={`label label-${qcLabel}`}>{props.qcStatus}</span>
      <div className="btn-group views">
        <button
          type="button"
          className="btn btn-default btn-xs dropdown-toggle"
          onClick={props.onToggleHeaders}
          aria-expanded={props.headerExpanded}
        >
          Header Info
        </button>
        <span className="caret" />
      </div>
      <span onClick={props.onToggleBody}
        className={`pull-right clickable glyphicon arrow glyphicon-chevron-${expandDirection}`}
      />
    </div>
  );
}

interface ImagePanelBodyProps {
  image: Image;
  HeadersExpanded: boolean;
}

/**
 * Image Panel Body component
 */
class ImagePanelBody extends Component<ImagePanelBodyProps, {}> {
  constructor(props: ImagePanelBodyProps) {
    super(props);
    this.openWindowHandler = this.openWindowHandler.bind(this);
  }

  openWindowHandler(e: MouseEvent) {
    e.preventDefault();
    window.open(
      `${window.location.origin}/brainbrowser/?minc_id=${this.props.image.FileID}`,
      'BrainBrowser Volume Viewer',
      'location = 0,width = auto, height = auto, scrollbars=yes'
    );
  }

  render() {
    return (
      <div className="panel-body">
        <div className="row">
          <div className="col-xs-9 imaging_browser_pic">
            <a href="#noID" onClick={this.openWindowHandler}>
              <img className="img-checkpic img-responsive"
                   src={this.props.image.APIFile + '/format/thumbnail'}/>
            </a>
          </div>
          <div className="col-xs-3 mri-right-panel">
            <ImagePanelQc
              fileID={this.props.image.FileID}
              fileNew={this.props.image.New}
              hasQcPerm={this.props.image.HasQCPerm}
              qcStatus={this.props.image.QCStatus}
              caveat={this.props.image.Caveat}
              selected={this.props.image.Selected}
              snr={this.props.image.SNR}
              seriesUID={this.props.image.headers.SeriesUID}
              editableCaveat={this.props.image.EditableCaveat}
              fullName={this.props.image.FullFilename}
            />
          </div>
        </div>
        <ImagePanelButtons
          FileID={this.props.image.FileID}
          APIFile={this.props.image.APIFile}
          OtherTimepoints={this.props.image.OtherTimepoints}
          files={this.props.image.files}
        />
        {this.props.HeadersExpanded ? <ImagePanelInfos infos={this.props.image.headers} /> : ''}
      </div>
    );
  }
}

interface ImagePanelProps {
  image: Image;
}

interface ImagePanelState {
  BodyCollapsed: boolean;
  HeadersCollapsed: boolean;
}

/**
 * Image Panel component
 */
class ImagePanel extends Component<ImagePanelProps, ImagePanelState> {
  constructor(props: ImagePanelProps) {
    super(props);
    this.state = {
      BodyCollapsed: false,
      HeadersCollapsed: true,
    };
    this.toggleBody = this.toggleBody.bind(this);
    this.toggleHeaders = this.toggleHeaders.bind(this);
  }

  toggleBody() {
    this.setState({
      BodyCollapsed: !this.state.BodyCollapsed,
    });
  }

  toggleHeaders() {
    this.setState({
      HeadersCollapsed: !this.state.HeadersCollapsed,
    });
  }

  render() {
    return (
      <div className="col-xs-12 col-md-6">
        <div className="panel panel-default">
          <ImagePanelHeader
            fileId={this.props.image.FileID}
            filename={this.props.image.Filename}
            qcStatus={this.props.image.QCStatus}
            headerExpanded={!this.state.HeadersCollapsed}
            bodyExpanded={!this.state.BodyCollapsed}
            onToggleBody={this.toggleBody}
            onToggleHeaders={this.toggleHeaders}
          />
          {this.state.BodyCollapsed ? '' :
            <ImagePanelBody
              image={this.props.image}
              HeadersExpanded={!this.state.HeadersCollapsed}
            />}
        </div>
      </div>
    );
  }
}

interface ImagePanelWrapperProps {
  fileId: number;
}

function ImagePanelWrapper(props: ImagePanelWrapperProps) {
  const [image, setImage] = useState<Image | null>(null);

  useEffect(() => {
    fetch(`${window.location.origin}/imaging_browser/getimagefile?fileID=${props.fileId}`,
      {credentials: 'same-origin'})
      .then((response) => response.json())
      .then((image) => { setImage(image); console.log(image) })
  }, []);

  return image ? (
    <ImagePanel image={image} />
  ) : null;
}

interface ImagePanelsProps {
  fileIds: number[];
}

function ImagePanels(props: ImagePanelsProps) {
  return (
    <>
      {props.fileIds.map((fileId, key) => (
        <ImagePanelWrapper key={key} fileId={fileId} />
      ))}
    </>
  );
}

let RImagePanels = React.createFactory(ImagePanels);

(window as any).RImagePanels = RImagePanels;

export default RImagePanels;
