/* exported ImagePanelHeader, ImagePanelHeadersTable, ImageQCDropdown, ImageQCStatic,
 ImagePanelQCStatusSelector, ImagePanelQCSelectedSelector, ImagePanelQCCaveatSelector,
 ImagePanelQCSNRValue, ImagePanelQCPanel, DownloadButton, ImageQCCommentsButton.
 LongitudinalViewButton, ImageDownloadButtons, ImagePanelBody, RImagePanel
* */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * Image panel header component
 */
class ImagePanelHeader extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let QCStatusLabel;
    if (this.props.QCStatus === 'Pass') {
      QCStatusLabel = <span className="label label-success">
                         {this.props.QCStatus}
                      </span>;
    } else if (this.props.QCStatus === 'Fail') {
      QCStatusLabel = <span className="label label-danger">
                         {this.props.QCStatus}
                      </span>;
    }

    let arrow;
    if (this.props.Expanded) {
      arrow = <span onClick={this.props.onToggleBody}
                    className="
                      pull-right
                      clickable
                      glyphicon
                      arrow
                      glyphicon-chevron-up
                    ">
              </span>;
    } else {
      arrow = <span onClick={this.props.onToggleBody}
                    className="
                      pull-right
                      clickable
                      glyphicon
                      arrow
                      glyphicon-chevron-down
                    ">
              </span>;
    }
    let headerButton = (
      <div className="btn-group views">
        <button
          type="button"
          className="btn btn-default btn-xs dropdown-toggle"
          onClick={this.props.onToggleHeaders}
          aria-expanded={this.props.HeadersExpanded}>
          Header Info
        </button>
        <span className="caret"></span>
      </div>
    );
    return (

      <div className="panel-heading clearfix">
        <input type="checkbox" data-file-id={this.props.FileID}
               className="mripanel user-success"/>
        <h3 className="panel-title"
            data-toggle="tooltip"
            title={this.props.Filename}
        >
          {this.props.Filename}
        </h3>
        {QCStatusLabel}
        {headerButton}
        {arrow}
      </div>
    );
  }
}

ImagePanelHeader.propTypes = {
  QCStatus: PropTypes.string,
  onToggleBody: PropTypes.func,
  onToggleHeaders: PropTypes.func,
  HeadersExpanded: PropTypes.bool,
  FileID: PropTypes.string,
  Filename: PropTypes.string,
  Expanded: PropTypes.bool,
};

/**
 * Image panel headers table component
 */
class ImagePanelHeadersTable extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let inversionTime = null;
    if (this.props.HeaderInfo.InversionTime !== '0.00') {
      inversionTime = this.props.HeaderInfo.InversionTime + ' ms';
    }
    let numVolumes = null;
    if (this.props.HeaderInfo.NumVolumes !== '0.00') {
      numVolumes = parseInt(this.props.HeaderInfo.NumVolumes) + ' volumes';
    }

    return (
      <table className="
        table
        table-hover
        table-bordered
        header-info
        col-xs-12
        dynamictable
      ">
        <tbody>
        <tr>
          <th className="col-xs-2 info">Series Instance UID</th>
          <td className="col-xs-10" colSpan="5">
            {this.props.HeaderInfo.SeriesUID}
          </td>
        </tr>
        <tr>
          <th className="col-xs-2 info">Voxel Size</th>
          <td className="col-xs-6" colSpan="3">
            {this.props.HeaderInfo.XStep === '' ? ' ' : 'X: ' +
              this.props.HeaderInfo.XStep + ' mm, '}
            {this.props.HeaderInfo.YStep === '' ? ' ' : 'Y: ' +
              this.props.HeaderInfo.YStep + ' mm, '}
            {this.props.HeaderInfo.ZStep === '' ? ' ' : 'Z: ' +
              this.props.HeaderInfo.ZStep + ' mm '}
          </td>
          <th className="col-xs-2 info">Output Type</th>
          <td className="col-xs-2">
            {this.props.HeaderInfo.OutputType}
          </td>
        </tr>
        <tr>
          <th className="col-xs-2 info">Protocol</th>
          <td className="col-xs-2">
            {this.props.HeaderInfo.AcquisitionProtocol}
          </td>
          <th className="col-xs-2 info">Acquisition Date</th>
          <td className="col-xs-2">
            {this.props.HeaderInfo.AcquisitionDate}
          </td>
          <th className="col-xs-2 info">Inserted Date</th>
          <td className="col-xs-2">
            {this.props.HeaderInfo.InsertedDate}
          </td>
        </tr>
        <tr>
          <th className="col-xs-2 info">Series Number</th>
          <td className="col-xs-2">
            {this.props.HeaderInfo.SeriesNumber}
          </td>
          <th className="col-xs-2 info">Series Description</th>
          <td className="col-xs-2">
            {this.props.HeaderInfo.SeriesDescription}
          </td>
          <th className="col-xs-2 info">Slice Thick</th>
          <td className="col-xs-2">
            {this.props.HeaderInfo.SliceThickness} mm
          </td>
        </tr>
        <tr>
          <th className="col-xs-2 info">TR</th>
          <td className="col-xs-2">
            {this.props.HeaderInfo.RepetitionTime} ms
          </td>
          <th className="col-xs-2 info">TE</th>
          <td className="col-xs-2">
            {this.props.HeaderInfo.EchoTime} ms
          </td>
          <th className="col-xs-2 info">TI</th>
          <td className="col-xs-2">
            {inversionTime}
          </td>
        </tr>
        <tr>
          <th className="col-xs-2 info">Phase Encoding Direction</th>
          <td className="col-xs-2">
            {this.props.HeaderInfo.PhaseEncodingDirection}
          </td>
          <th className="col-xs-2 info">Image Type</th>
          <td className="col-xs-2">
            {this.props.HeaderInfo.ImageType}
          </td>
          <th className="col-xs-2 info">Echo Number</th>
          <td className="col-xs-2">
            {this.props.HeaderInfo.EchoNumber}
          </td>
        </tr>
        <tr>
          <th className="col-xs-2 info">Number of volumes</th>
          <td className="col-xs-2">
            {numVolumes}
          </td>
          {this.props.HeaderInfo.ProcessingPipeline ?
          <th className="col-xs-2 info">Processing Pipeline</th>
            : null}
          {this.props.HeaderInfo.ProcessingPipeline ?
          <td className="col-xs-2">
            {this.props.HeaderInfo.ProcessingPipeline}
          </td>
            : null}
          {this.props.HeaderInfo.ProcDate ?
          <th className="col-xs-2 info">Processing Pipeline Date</th>
            : null }
          {this.props.HeaderInfo.ProcDate ?
          <td className="col-xs-2">
            {this.props.HeaderInfo.ProcDate}
          </td>
            : null }
        </tr>
        {this.props.HeaderInfo.ProcessingPipeline === 'DTIPrepPipeline' ?
        <tr>
          <th className="col-xs-2 info">Number of rejected directions</th>
          <td className="col-xs-2">
            {this.props.HeaderInfo.TotalRejected}
          </td>
          <th className="col-xs-2 info">Number of Interlace correlations</th>
          <td className="col-xs-2">
            {this.props.HeaderInfo.InterlaceRejected}
          </td>
          <th className="col-xs-2 info">
            Number of Gradient-wise correlations
          </th>
          <td className="col-xs-2">
            {this.props.HeaderInfo.IntergradientRejected}
          </td>
        </tr>
          : null}
        {this.props.HeaderInfo.ProcessingPipeline === 'DTIPrepPipeline' ?
        <tr>
          <th className="col-xs-2 info">Number of Slicewise correlations</th>
          <td className="col-xs-2">
            {this.props.HeaderInfo.SlicewiseRejected}
          </td>
        </tr>
          : null}
        </tbody>
      </table>
    );
  }
}
ImagePanelHeadersTable.propTypes = {
  HeaderInfo: PropTypes.object,
};


/**
 * Image quality control dropdown component
 */
class ImageQCDropdown extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let label = <label>{this.props.Label}</label>;
    if (this.props.url) {
      label = <label>
        <a href={this.props.url}>{this.props.Label}</a>
      </label>;
    }
    let dropdown;
    if (this.props.editable) {
      let options = [];
      for (let key in this.props.options) {
        if (this.props.options.hasOwnProperty(key)) {
          options.push(
            <option key={this.props.FormName + this.props.FileID + key}
                    className="form-control input-sm option"
                    value={key}>{this.props.options[key]}
            </option>
          );
        }
      }
      dropdown = (
        <select name={this.props.FormName +
        '[' + this.props.FileID + ']'}
                defaultValue={this.props.defaultValue}
                className="form-control input-sm"
        >
          {options}
        </select>
      );
    } else {
      dropdown = (
        <div className="col-xs-12">
          {this.props.options[this.props.defaultValue]}
        </div>
      );
    }
    return (
      <div className="row">
        {label}
        {dropdown}
      </div>
    );
  }
}
ImageQCDropdown.propTypes = {
  Label: PropTypes.string,
  url: PropTypes.string,
  editable: PropTypes.bool,
  options: PropTypes.object,
  FileID: PropTypes.string,
  FormName: PropTypes.string,
  defaultValue: PropTypes.string,
};


/**
 * Image quality control static component
 */
class ImageQCStatic extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let staticInfo;
    staticInfo = (
      <div className="col-xs-12">
        {this.props.defaultValue}
      </div>
    );
    return (
      <div className="row">
        <label>{this.props.Label}</label>
        {staticInfo}
      </div>
    );
  }
}
ImageQCStatic.propTypes = {
  defaultValue: PropTypes.string,
  Label: PropTypes.string,
};


/**
 * Image panel quality control
 * status selector component
 */
class ImagePanelQCStatusSelector extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let qcStatusLabel;
    if (this.props.HasQCPerm && this.props.FileNew) {
      qcStatusLabel = <span>
                        QC Status <span className="text-info">
                             ( <span className="glyphicon glyphicon-star">
                           </span> New )
                         </span>
                      </span>;
    } else {
      qcStatusLabel = 'QC Status';
    }

    return (
      <ImageQCDropdown
        Label={qcStatusLabel}
        FormName="status"
        FileID={this.props.FileID}
        editable={this.props.HasQCPerm}
        defaultValue={this.props.QCStatus}
        options={{'': '', 'Pass': 'Pass', 'Fail': 'Fail'}}
      />
    );
  }
}
ImagePanelQCStatusSelector.propTypes = {
  FileNew: PropTypes.bool,
  HasQCPerm: PropTypes.bool,
  QCStatus: PropTypes.string,
  FileID: PropTypes.string,
};


/**
 * Image panel quality control
 * selected selector component
 */
class ImagePanelQCSelectedSelector extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <ImageQCDropdown
        Label="Selected"
        FormName="selectedvol"
        FileID={this.props.FileID}
        editable={this.props.HasQCPerm}
        options={{'': '', 'true': 'True', 'false': 'False'}}
        defaultValue={this.props.Selected}
      />
    );
  }
}
ImagePanelQCSelectedSelector.propTypes = {
  FileID: PropTypes.string,
  HasQCPerm: PropTypes.bool,
  Selected: PropTypes.string,
};


/**
 * Image panel quality control
 * caveat selector component
 */
class ImagePanelQCCaveatSelector extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    // Link caveat to MRI Violations if set true
    let mriViolationsLink = null;
    if (this.props.FullName && this.props.Caveat === '1') {
        mriViolationsLink = '/mri_violations/?' +
          'mincFile=' + this.props.FullName +
          '&seriesUID=' + this.props.SeriesUID;
    }

    return (
      <ImageQCDropdown
        Label="Caveat"
        FormName="caveat"
        FileID={this.props.FileID}
        editable={this.props.HasQCPerm && this.props.EditableCaveat}
        options={
          {
            '': '',
            '1': 'True',
            '0': 'False',
          }
        }
        defaultValue={this.props.Caveat}
        url={mriViolationsLink}
      />
    );
  }
}
ImagePanelQCCaveatSelector.propTypes = {
  FileID: PropTypes.string,
  HasQCPerm: PropTypes.bool,
  SeriesUID: PropTypes.string,
  Caveat: PropTypes.string,
  EditableCaveat: PropTypes.bool,
  FullName: PropTypes.string,
};


/**
 * Image panel quality control SNR value component
 */
class ImagePanelQCSNRValue extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let label = null;
    if (this.props.SNR) {
      label = 'SNR';
    }
    return (
      <ImageQCStatic
        Label={label}
        FormName="snr"
        FileID={this.props.FileID}
        defaultValue={this.props.SNR}
      />
    );
  }
}
ImagePanelQCSNRValue.propTypes = {
  FileID: PropTypes.string,
  SNR: PropTypes.string,
};


/**
 * Image panel quality control panel component
 */
class ImagePanelQCPanel extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <div className="form-group">
        <ImagePanelQCStatusSelector
          FileID={this.props.FileID}
          HasQCPerm={this.props.HasQCPerm}
          QCStatus={this.props.QCStatus}
          FileNew={this.props.FileNew}
        />
        <ImagePanelQCSelectedSelector
          FileID={this.props.FileID}
          HasQCPerm={this.props.HasQCPerm}
          Selected={this.props.Selected}
        />
        <ImagePanelQCCaveatSelector
          FileID={this.props.FileID}
          HasQCPerm={this.props.HasQCPerm}
          Caveat={this.props.Caveat}
          SeriesUID={this.props.SeriesUID}
          EditableCaveat={this.props.EditableCaveat}
          FullName={this.props.FullName}
        />
        <ImagePanelQCSNRValue
          FileID={this.props.FileID}
          SNR={this.props.SNR}
        />
      </div>
    );
  }
}
ImagePanelQCPanel.propTypes = {
  FileID: PropTypes.string,
  HasQCPerm: PropTypes.bool,
  QCStatus: PropTypes.string,
  FileNew: PropTypes.bool,
  Selected: PropTypes.string,
  Caveat: PropTypes.string,
  SeriesUID: PropTypes.string,
  SNR: PropTypes.string,
  EditableCaveat: PropTypes.bool,
  FullName: PropTypes.string,
};


/**
 * Download button component
 */
class DownloadButton extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const empty = (prop) => {
        return !prop || prop == '';
    };
    if (empty(this.props.FileName) && empty(this.props.URL)) {
      return <span/>;
    }
    let style = {
      margin: 6,
    };
    const url = this.props.URL ||
        (this.props.BaseURL
           + '/mri/jiv/get_file.php?file=' + this.props.FileName);
    return (
      <a href={url}
         className="btn btn-default" style={style}>
        <span className="glyphicon glyphicon-download-alt"></span>
        <span className="hidden-xs">{this.props.Label}</span>
      </a>
    );
  }
}
DownloadButton.propTypes = {
  FileName: PropTypes.string,
  BaseURL: PropTypes.string,
  Label: PropTypes.string,
  URL: PropTypes.string,
};


/**
 * Image quality control comments button component
 */
class ImageQCCommentsButton extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.openWindowHandler = this.openWindowHandler.bind(this);
  }

  /**
   * Open window handler
   *
   * @param {object} e - Event object
   */
  openWindowHandler(e) {
    e.preventDefault();
    window.open(
      this.props.BaseURL +
      '/imaging_browser/feedback_mri_popup/fileID=' +
      this.props.FileID,
      'feedback_mri',
      'width=700,height=800,toolbar=no,location=no,' +
      'status=yes,scrollbars=yes,resizable=yes'
    );
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    if (!this.props.FileID || this.props.FileID === '') {
      return <span/>;
    }
    return (
      <a className="btn btn-default"
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
ImageQCCommentsButton.propTypes = {
  FileID: PropTypes.string,
  BaseURL: PropTypes.string,
};


/**
 * Longitudinal view button component
 */
class LongitudinalViewButton extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.openWindowHandler = this.openWindowHandler.bind(this);
  }

  /**
   * Open window handler
   *
   * @param {object} e - Event object
   */
  openWindowHandler(e) {
    e.preventDefault();
    window.open(
      this.props.BaseURL + '/brainbrowser/?minc_id=' +
      this.props.OtherTimepoints,
      'BrainBrowser Volume Viewer',
      'location = 0,width = auto, height = auto, scrollbars=yes'
    );
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    if (!this.props.FileID || this.props.FileID === '') {
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
LongitudinalViewButton.propTypes = {
  FileID: PropTypes.string,
  BaseURL: PropTypes.string,
  OtherTimepoints: PropTypes.string,
};


/**
 * Image download buttons component
 */
class ImageDownloadButtons extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <div className="row mri-second-row-panel col-xs-12">
        <ImageQCCommentsButton FileID={this.props.FileID}
                               BaseURL={this.props.BaseURL}
        />
        <DownloadButton URL={this.props.APIFile}
                        Label='Download Image'
                        BaseURL={this.props.BaseURL}
        />
        <DownloadButton FileName={this.props.XMLProtocol}
                        BaseURL={this.props.BaseURL}
                        Label="Download XML Protocol"
        />
        <DownloadButton FileName={this.props.XMLReport}
                        BaseURL={this.props.BaseURL}
                        Label="Download XML Report"
        />
        <DownloadButton FileName={this.props.NrrdFile}
                        BaseURL={this.props.BaseURL}
                        Label="Download NRRD"
        />
        { this.props.NiiFile ?
          <DownloadButton URL={this.props.APIFile + '/format/nifti'}
                          Label="Download NIfTI"
          /> :
          null
        }
        {this.props.BvalFile ?
          <DownloadButton URL={this.props.APIFile + '/format/bval'}
                          Label="Download BVAL"
          /> :
          null
        }
        {this.props.BvecFile ?
          <DownloadButton URL={this.props.APIFile + '/format/bvec'}
                          Label="Download BVEC"
          /> :
          null
        }
        {this.props.JsonFile ?
          <DownloadButton URL={this.props.APIFile + '/format/bidsjson'}
                          Label="Download BIDS JSON"
          /> :
          null
        }
        <LongitudinalViewButton FileID={this.props.FileID}
                                BaseURL={this.props.BaseURL}
                                OtherTimepoints={this.props.OtherTimepoints}
        />
      </div>
    );
  }
}
ImageDownloadButtons.propTypes = {
  FileID: PropTypes.string,
  BaseURL: PropTypes.string,
  APIFile: PropTypes.string,
  Fullname: PropTypes.string,
  XMLProtocol: PropTypes.string,
  XMLReport: PropTypes.string,
  NrrdFile: PropTypes.string,
  NiiFile: PropTypes.string,
  BvalFile: PropTypes.string,
  BvecFile: PropTypes.string,
  JsonFile: PropTypes.string,
  OtherTimepoints: PropTypes.string,
};


/**
 * Image panel body component
 */
class ImagePanelBody extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.openWindowHandler = this.openWindowHandler.bind(this);
  }

  /**
   * Open window handler
   *
   * @param {object} e - Event object
   */
  openWindowHandler(e) {
    e.preventDefault();
    window.open(this.props.BaseURL + '/brainbrowser/?minc_id=' +
      this.props.FileID, 'BrainBrowser Volume Viewer',
      'location = 0,width = auto, height = auto, scrollbars=yes');
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <div className="panel-body">
        <div className="row">
          <div className="col-xs-9 imaging_browser_pic">
            <a href="#noID" onClick={this.openWindowHandler}>
              <img className="img-checkpic img-responsive"
                   src={this.props.APIFile + '/format/thumbnail'}/>
            </a>
          </div>
          <div className="col-xs-3 mri-right-panel">
            <ImagePanelQCPanel
              FileID={this.props.FileID}
              FileNew={this.props.FileNew}
              HasQCPerm={this.props.HasQCPerm}
              QCStatus={this.props.QCStatus}
              Caveat={this.props.Caveat}
              Selected={this.props.Selected}
              SNR={this.props.SNR}
              SeriesUID={this.props.SeriesUID}
              EditableCaveat={this.props.EditableCaveat}
              FullName={this.props.Fullname}
            />
          </div>
        </div>
        <ImageDownloadButtons
          BaseURL={this.props.BaseURL}
          FileID={this.props.FileID}
          APIFile={this.props.APIFile}
          XMLProtocol={this.props.XMLProtocol}
          XMLReport={this.props.XMLReport}
          NrrdFile={this.props.NrrdFile}
          NiiFile={this.props.NiiFile}
          BvalFile={this.props.BvalFile}
          BvecFile={this.props.BvecFile}
          JsonFile={this.props.JsonFile}
          OtherTimepoints={this.props.OtherTimepoints}
        />
        {this.props.HeadersExpanded ? <ImagePanelHeadersTable
          HeaderInfo={this.props.HeaderInfo}/> : ''}
      </div>
    );
  }
}
ImagePanelBody.propTypes = {
  FileID: PropTypes.string,
  FileNew: PropTypes.bool,
  HasQCPerm: PropTypes.bool,
  QCStatus: PropTypes.string,
  Caveat: PropTypes.string,
  Selected: PropTypes.string,
  SNR: PropTypes.string,
  SeriesUID: PropTypes.string,
  BaseURL: PropTypes.string,
  Fullname: PropTypes.string,
  APIFile: PropTypes.string,
  XMLProtocol: PropTypes.string,
  XMLReport: PropTypes.string,
  NrrdFile: PropTypes.string,
  NiiFile: PropTypes.string,
  BvalFile: PropTypes.string,
  BvecFile: PropTypes.string,
  JsonFile: PropTypes.string,
  OtherTimepoints: PropTypes.string,
  HeadersExpanded: PropTypes.bool,
  HeaderInfo: PropTypes.object,
  EditableCaveat: PropTypes.bool,
};


/**
 * Image panel component
 */
class ImagePanel extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      BodyCollapsed: false,
      HeadersCollapsed: true,
    };
    this.toggleBody = this.toggleBody.bind(this);
    this.toggleHeaders = this.toggleHeaders.bind(this);
  }

  /**
   * Toggle body
   *
   * @param {object} e - Event object
   */
  toggleBody(e) {
    this.setState({
      BodyCollapsed: !this.state.BodyCollapsed,
    });
  }

  /**
   * Toggle headers
   *
   * @param {object} e - Event object
   */
  toggleHeaders(e) {
    this.setState({
      HeadersCollapsed: !this.state.HeadersCollapsed,
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <div className="col-xs-12 col-md-6">
        <div className="panel panel-default">
          <ImagePanelHeader
            FileID={this.props.FileID}
            Filename={this.props.Filename}
            QCStatus={this.props.QCStatus}
            onToggleBody={this.toggleBody}
            onToggleHeaders={this.toggleHeaders}
            Expanded={!this.state.BodyCollapsed}
            HeadersExpanded={!this.state.HeadersCollapsed}
          />
          {this.state.BodyCollapsed ? '' :
            <ImagePanelBody
              BaseURL={this.props.BaseURL}

              FileID={this.props.FileID}
              Filename={this.props.Filename}
              APIFile={this.props.APIFile}
              HeadersExpanded={!this.state.HeadersCollapsed}

              HeaderInfo={this.props.HeaderInfo}

              FileNew={this.props.FileNew}
              HasQCPerm={this.props.HasQCPerm}
              QCStatus={this.props.QCStatus}
              Caveat={this.props.Caveat}
              EditableCaveat={this.props.EditableCaveat}
              Selected={this.props.Selected}
              SNR={this.props.SNR}

              Fullname={this.props.Fullname}
              XMLProtocol={this.props.XMLProtocol}
              XMLReport={this.props.XMLReport}
              NrrdFile={this.props.NrrdFile}
              NiiFile={this.props.NiiFile}
              BvalFile={this.props.BvalFile}
              BvecFile={this.props.BvecFile}
              JsonFile={this.props.JsonFile}
              OtherTimepoints={this.props.OtherTimepoints}
              SeriesUID={this.props.SeriesUID}
            />}
        </div>
      </div>
    );
  }
}
ImagePanel.propTypes = {
  FileID: PropTypes.string,
  Filename: PropTypes.string,
  FileNew: PropTypes.bool,
  HasQCPerm: PropTypes.bool,
  QCStatus: PropTypes.string,
  Caveat: PropTypes.string,
  Selected: PropTypes.string,
  SNR: PropTypes.string,
  SeriesUID: PropTypes.string,
  BaseURL: PropTypes.string,
  Fullname: PropTypes.string,
  XMLProtocol: PropTypes.string,
  XMLReport: PropTypes.string,
  NrrdFile: PropTypes.string,
  NiiFile: PropTypes.string,
  BvalFile: PropTypes.string,
  BvecFile: PropTypes.string,
  JsonFile: PropTypes.string,
  OtherTimepoints: PropTypes.string,
  HeaderInfo: PropTypes.object,
  HeadersExpanded: PropTypes.string,
  APIFile: PropTypes.string,
  EditableCaveat: PropTypes.bool,
};

let RImagePanel = React.createFactory(ImagePanel);

window.ImagePanelHeader = ImagePanelHeader;
window.ImagePanelHeadersTable = ImagePanelHeadersTable;
window.ImageQCDropdown = ImageQCDropdown;
window.ImageQCStatic = ImageQCStatic;
window.ImagePanelQCStatusSelector = ImagePanelQCStatusSelector;
window.ImagePanelQCSelectedSelector = ImagePanelQCSelectedSelector;
window.ImagePanelQCCaveatSelector = ImagePanelQCCaveatSelector;
window.ImagePanelQCSNRValue = ImagePanelQCSNRValue;
window.ImagePanelQCPanel = ImagePanelQCPanel;
window.DownloadButton = DownloadButton;
window.ImageQCCommentsButton = ImageQCCommentsButton;
window.LongitudinalViewButton = LongitudinalViewButton;
window.ImageDownloadButtons = ImageDownloadButtons;
window.ImagePanelBody = ImagePanelBody;
window.RImagePanel = RImagePanel;

export default {
  ImagePanelHeader,
  ImagePanelHeadersTable,
  ImageQCDropdown,
  ImageQCStatic,
  ImagePanelQCStatusSelector,
  ImagePanelQCSelectedSelector,
  ImagePanelQCCaveatSelector,
  ImagePanelQCSNRValue,
  ImagePanelQCPanel,
  DownloadButton,
  ImageQCCommentsButton,
  LongitudinalViewButton,
  ImageDownloadButtons,
  ImagePanelBody,
  RImagePanel,
};
