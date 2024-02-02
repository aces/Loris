import React, { Component, MouseEvent } from 'react';
import { ImageInfos, ImageFiles, QcStatus } from './types';
import ImagePanelInfos from './ImagePanelInfos';
import ImagePanelQc from './ImagePanelQc';
import ImagePanelButtons from './ImagePanelButtons';

interface ImagePanelHeaderProps {
  fileId: string;
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
  FileID: string;
  FileNew: boolean;
  HasQCPerm: boolean;
  QCStatus: string;
  Caveat: string;
  Selected: string;
  SNR: string;
  SeriesUID: string;
  BaseURL: string;
  Fullname: string;
  OtherTimepoints: string;
  HeadersExpanded: boolean;
  EditableCaveat: boolean;
  infos: ImageInfos;
  files: ImageFiles;
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
      `${this.props.BaseURL}/brainbrowser/?minc_id=${this.props.FileID}`,
      'BrainBrowser Volume Viewer',
      'location = 0,width = auto, height = auto, scrollbars=yes'
    );
  }

  render() {
    return (
      <div className="panel-body">
        <div className="row">
          <div className="col-xs-9 imaging_browser_pic">
            <a href="#noID" onClick={(e) => this.openWindowHandler(e)}>
              <img className="img-checkpic img-responsive"
                   src={this.props.files.minc + '/format/thumbnail'}/>
            </a>
          </div>
          <div className="col-xs-3 mri-right-panel">
            <ImagePanelQc
              fileID={this.props.FileID}
              fileNew={this.props.FileNew}
              hasQcPerm={this.props.HasQCPerm}
              qcStatus={this.props.QCStatus}
              caveat={this.props.Caveat}
              selected={this.props.Selected}
              snr={this.props.SNR}
              seriesUID={this.props.SeriesUID}
              editableCaveat={this.props.EditableCaveat}
              fullName={this.props.Fullname}
            />
          </div>
        </div>
        <ImagePanelButtons
          baseUrl={this.props.BaseURL}
          fileID={this.props.FileID}
          files={this.props.files}
          otherTimepoints={this.props.OtherTimepoints}
        />
        {this.props.HeadersExpanded ? <ImagePanelInfos infos={this.props.infos} /> : ''}
      </div>
    );
  }
}

interface ImagePanelProps {
  FileID: string;
  Filename: string;
  FileNew: boolean;
  HasQCPerm: boolean;
  QCStatus: QcStatus;
  Caveat: string;
  Selected: string;
  SNR: string;
  SeriesUID: string;
  BaseURL: string;
  Fullname: string;
  OtherTimepoints: string;
  HeadersExpanded: string;
  EditableCaveat: boolean;
  infos: ImageInfos;
  files: ImageFiles;
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
            fileId={this.props.FileID}
            filename={this.props.Filename}
            qcStatus={this.props.QCStatus}
            headerExpanded={!this.state.HeadersCollapsed}
            bodyExpanded={!this.state.BodyCollapsed}
            onToggleBody={this.toggleBody}
            onToggleHeaders={this.toggleHeaders}
          />
          {this.state.BodyCollapsed ? '' :
            <ImagePanelBody
              BaseURL={this.props.BaseURL}

              FileID={this.props.FileID}
              HeadersExpanded={!this.state.HeadersCollapsed}
              infos={this.props.infos}
              FileNew={this.props.FileNew}
              HasQCPerm={this.props.HasQCPerm}
              QCStatus={this.props.QCStatus}
              Caveat={this.props.Caveat}
              EditableCaveat={this.props.EditableCaveat}
              Selected={this.props.Selected}
              SNR={this.props.SNR}

              Fullname={this.props.Fullname}
              files={this.props.files}
              OtherTimepoints={this.props.OtherTimepoints}
              SeriesUID={this.props.SeriesUID}
            />}
        </div>
      </div>
    );
  }
}

let RImagePanel = React.createFactory(ImagePanel);

(window as any).RImagePanel = RImagePanel;

export default RImagePanel;
