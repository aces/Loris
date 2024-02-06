import React, { Component, MouseEvent, ReactNode } from 'react';
import { ImageFiles } from './types';

interface ButtonProps {
  icon: string;
  children: ReactNode;
  url?: string;
  onClick?: (e: MouseEvent) => void;
}

function Button(props: ButtonProps) {
  let element = (children: ReactNode) => props.url ?
    (
      <a href={props.url} className="btn btn-default" onClick={props.onClick} style={{margin: 0}}>
        {children}
      </a>
    ) : (
      <div className="btn btn-default" onClick={props.onClick} style={{margin: 0}}>
        {children}
      </div>
    );

  return element(
    <>
      <span className={`glyphicon glyphicon-${props.icon}`} style={{marginRight: '5px'}} />
      <span className="hidden-xs">{props.children}</span>
    </>
  )
}

interface DownloadButtonProps {
  label: string,
  url?: string,
  fileName?: string,
}

/**
 * Image Longitudinal View Button component
 */
function LongitudinalViewButton(props: LongitudinalViewButtonProps) {
  const url = `${window.location.origin}/brainbrowser/?minc_id=${props.OtherTimepoints}`;
  const openWindowHandler = (e: MouseEvent) => {
    e.preventDefault();
    window.open(
      url,
      'BrainBrowser Volume Viewer',
      'location = 0,width = auto, height = auto, scrollbars=yes'
    );
  }

  return (
    <Button icon="eye-open" url={url} onClick={openWindowHandler}>
      Longitudinal View
    </Button>
  );
}

interface QcButtonProps {
  FileID: number;
}

/**
 * Image Quality Control comments button component
 */
function QcButton(props: QcButtonProps) {
  const url = `${window.location.origin}/imaging_browser/feedback_mri_popup/fileID=${props.FileID}`;
  const openWindowHandler = (e: MouseEvent) => {
    e.preventDefault();
    window.open(
      url,
      'feedback_mri',
      'width=700,height=800,toolbar=no,location=no,status=yes,scrollbars=yes,resizable=yes'
    );
  };

  return (
    <Button icon="pencil" url={url} onClick={openWindowHandler}>
      QC Comments
    </Button>
  );
}

interface HeadersButtonProps {
  headersExpanded: boolean;
  toggleHeaders?: () => void;
}

/**
 * Image Longitudinal View Button component
 */
function HeadersButton(props: HeadersButtonProps) {
  return (
    <Button icon="th-list" onClick={props.toggleHeaders}>
      {!props.headersExpanded ? 'Show Headers' : 'Hide Headers'}
    </Button>
  );
}

/**
 * Download button component
 */
function DownloadButton(props: DownloadButtonProps) {
  const url = props.url || `${window.location.origin}/mri/jiv/get_file.php?file=${props.fileName}`;
  return (
    <Button icon="download-alt" url={url}>
      {props.label}
    </Button>
  );
}

interface LongitudinalViewButtonProps {
  OtherTimepoints: number,
}

interface ImageButtonsProps {
  FileID: number;
  APIFile: string;
  OtherTimepoints: number;
  files: ImageFiles;
  headersExpanded: boolean;
  toggleHeaders?: () => void;
}

/**
 * Image Buttons component
 */
function ImageButtons(props: ImageButtonsProps) {
  return (
    <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '5px', paddingBottom: '10px'}}>
      <LongitudinalViewButton
        OtherTimepoints={props.OtherTimepoints}
      />
      <QcButton
        FileID={props.FileID}
      />
      <HeadersButton
        headersExpanded={props.headersExpanded}
        toggleHeaders={props.toggleHeaders}
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

export default ImageButtons;
