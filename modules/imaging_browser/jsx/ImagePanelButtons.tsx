import { Component, MouseEvent } from 'react';
import { ImageFiles } from './types';

interface DownloadButtonProps {
  label: string,
  url?: string,
  fileName?: string,
}

/**
 * Download button component
 */
function DownloadButton(props: DownloadButtonProps) {
  const url = props.url || `${window.location.origin}/mri/jiv/get_file.php?file=${props.fileName}`;

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
  FileID: number;
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
      `${window.location.origin}/imaging_browser/feedback_mri_popup/fileID=${this.props.FileID}`,
      'feedback_mri',
      'width=700,height=800,toolbar=no,location=no,status=yes,scrollbars=yes,resizable=yes'
    );
  }

  render() {
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
  FileID: number,
  OtherTimepoints: number,
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
      `${window.location.origin}/brainbrowser/?minc_id=${this.props.OtherTimepoints}`,
      'BrainBrowser Volume Viewer',
      'location = 0,width = auto, height = auto, scrollbars=yes'
    );
  }

  render() {
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
  FileID: number;
  APIFile: string;
  OtherTimepoints: number;
  files: ImageFiles;
}

/**
 * Image Panel Buttons component
 */
function ImagePanelButtons(props: ImagePanelButtonsProps) {
  return (
    <div className="row mri-second-row-panel col-xs-12">
      <LongitudinalViewButton
        FileID={props.FileID}
        OtherTimepoints={props.OtherTimepoints}
      />
      <ImageQcButton
        FileID={props.FileID}
      />
      <DownloadButton
        url={props.APIFile}
        label='Download Image'
      />
      { props.files.protocol ?
        <DownloadButton
          fileName={props.files.protocol}
          label="Download XML Protocol"
        /> : null
      }
      { props.files.report ?
        <DownloadButton
          fileName={props.files.report}
          label="Download XML Report"
        /> : null
      }
      { props.files.nrrd ?
        <DownloadButton
          fileName={props.files.nrrd}
          label="Download NRRD"
        /> : null
      }
      { props.files.nii ?
        <DownloadButton
          url={props.APIFile + '/format/nifti'}
          label="Download NIfTI"
        /> : null
      }
      { props.files.bval ?
        <DownloadButton
          url={props.APIFile + '/format/bval'}
          label="Download BVAL"
        /> : null
      }
      { props.files.bvec ?
        <DownloadButton
          url={props.APIFile + '/format/bvec'}
          label="Download BVEC"
        /> : null
      }
      { props.files.json ?
        <DownloadButton
          url={props.APIFile + '/format/bidsjson'}
          label="Download BIDS JSON"
        /> : null
      }
    </div>
  );
}

export default ImagePanelButtons;
