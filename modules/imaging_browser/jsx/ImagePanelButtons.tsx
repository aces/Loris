import { Component, MouseEvent } from 'react';
import { ImageFiles } from './types';

interface DownloadButtonProps {
  label: string,
  baseUrl?: string,
  url?: string,
  fileName?: string,
}

/**
 * Download button component
 */
function DownloadButton(props: DownloadButtonProps) {
  if (!props.fileName && !props.url) {
    return <span />;
  }

  const url = props.url || `${props.baseUrl}/mri/jiv/get_file.php?file=${props.fileName}`;

  const style = {
    margin: 6,
  };

  return (
    <a href={url} className="btn btn-default" style={style}>
      <span className="glyphicon glyphicon-download-alt" />
      <span className="hidden-xs">{props.label}</span>
    </a>
  );
}

interface ImageQcButtonProps {
  fileID: string;
  baseUrl: string;
}

/**
 * Image Quality Control comments button component
 */
class ImageQcButton extends Component<ImageQcButtonProps, {}> {
  constructor(props: ImageQcButtonProps) {
    super(props);

    this.openWindowHandler = this.openWindowHandler.bind(this);
  }

  openWindowHandler(e: MouseEvent) {
    e.preventDefault();
    window.open(
      `${this.props.baseUrl}/imaging_browser/feedback_mri_popup/fileID=${this.props.fileID}`,
      'feedback_mri',
      'width=700,height=800,toolbar=no,location=no,status=yes,scrollbars=yes,resizable=yes'
    );
  }

  render() {
    if (!this.props.fileID) {
      return <span/>;
    }

    return (
      <a
        className="btn btn-default"
        href="#noID"
        onClick={this.openWindowHandler}
      >
        <span className="text-default">
            <span className="glyphicon glyphicon-pencil"></span>
            <span className="hidden-xs">QC Comments</span>
        </span>
      </a>
    );
  }
}

interface LongitudinalViewButtonProps {
  fileID: string,
  baseUrl: string,
  otherTimepoints: string,
}

/**
 * Image Longitudinal View Button component
 */
class LongitudinalViewButton extends Component<LongitudinalViewButtonProps, {}> {
  constructor(props: LongitudinalViewButtonProps) {
    super(props);

    this.openWindowHandler = this.openWindowHandler.bind(this);
  }

  openWindowHandler(e: MouseEvent) {
    e.preventDefault();
    window.open(
      `${this.props.baseUrl}/brainbrowser/?minc_id=${this.props.otherTimepoints}`,
      'BrainBrowser Volume Viewer',
      'location = 0,width = auto, height = auto, scrollbars=yes'
    );
  }

  render() {
    if (!this.props.fileID) {
      return <span/>;
    }

    return (
      <a className="btn btn-default"
         href="#noID"
         onClick={this.openWindowHandler}
      >
        <span className="text-default">
            <span className="glyphicon glyphicon-eye-open"></span>
            <span className="hidden-xs">Longitudinal View</span>
        </span>
      </a>
    );
  }
}

interface ImagePanelButtonsProps {
  fileID: string;
  baseUrl: string;
  otherTimepoints: string;
  files: ImageFiles;
}

/**
 * Image Panel Buttons component
 */
function ImagePanelButtons(props: ImagePanelButtonsProps) {
  return (
    <div className="row mri-second-row-panel col-xs-12">
      <LongitudinalViewButton
        fileID={props.fileID}
        baseUrl={props.baseUrl}
        otherTimepoints={props.otherTimepoints}
      />
      <ImageQcButton
        fileID={props.fileID}
        baseUrl={props.baseUrl}
      />
      <DownloadButton
        url={props.files.minc}
        baseUrl={props.baseUrl}
        label='Download Image'
      />
      { props.files.xmlProtocol ?
        <DownloadButton
          baseUrl={props.baseUrl}
          fileName={props.files.xmlProtocol}
          label="Download XML Protocol"
        /> : null
      }
      { props.files.xmlReport ?
        <DownloadButton
          fileName={props.files.xmlReport}
          baseUrl={props.baseUrl}
          label="Download XML Report"
        /> : null
      }
      { props.files.nrrd ?
        <DownloadButton
          fileName={props.files.nrrd}
          baseUrl={props.baseUrl}
          label="Download NRRD"
        /> : null
      }
      { props.files.nifti ?
        <DownloadButton
          url={props.files.minc + '/format/nifti'}
          label="Download NIfTI"
        /> : null
      }
      { props.files.bval ?
        <DownloadButton
          url={props.files.minc + '/format/bval'}
          label="Download BVAL"
        /> : null
      }
      { props.files.bvec ?
        <DownloadButton
          url={props.files.minc + '/format/bvec'}
          label="Download BVEC"
        /> : null
      }
      { props.files.json ?
        <DownloadButton
          url={props.files.minc + '/format/bidsjson'}
          label="Download BIDS JSON"
        /> : null
      }
    </div>
  );
}

export default ImagePanelButtons;
