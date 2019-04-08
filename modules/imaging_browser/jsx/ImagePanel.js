/* exported ImagePanelHeader, ImagePanelHeadersTable, ImageQCDropdown, ImageQCStatic,
 ImagePanelQCStatusSelector, ImagePanelQCSelectedSelector, ImagePanelQCCaveatSelector,
 ImagePanelQCSNRValue, ImagePanelQCPanel, DownloadButton, ImageQCCommentsButton.
 LongitudinalViewButton, ImageDownloadButtons, ImagePanelBody, RImagePanel
* */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ImagePanelHeader extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $('.panel-title').tooltip();
  }

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
        className="pull-right clickable glyphicon arrow glyphicon-chevron-up">
      </span>;
    } else {
      arrow = <span onClick={this.props.onToggleBody}
        className="pull-right clickable glyphicon arrow glyphicon-chevron-down">
      </span>;
    }
    const headerButton = (
      <div className="pull-right">
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
      </div>
    );
    return (

      <div className="panel-heading clearfix">
        <input type="checkbox" data-file-id={this.props.FileID}
          className="mripanel user-success"/>
        <h3 className="panel-title" data-toggle="tooltip" title={this.props.Filename}>
          {this.props.Filename}
        </h3>
        {QCStatusLabel}
        {arrow}
        {headerButton}
      </div>
    );
  }
}

ImagePanelHeader.propTypes = {
  QCStatus: PropTypes.string,
  onToggleBody: PropTypes.string,
  onToggleHeaders: PropTypes.string,
  HeadersExpanded: PropTypes.string,
  FileID: PropTypes.string,
  Filename: PropTypes.string,
};

class ImagePanelHeadersTable extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this)).DynamicTable();
  }

  componentWillUnmount() {
    // Remove wrapper nodes so React is able to remove component
    $(ReactDOM.findDOMNode(this)).DynamicTable({
      removeDynamicTable: true,
    });
  }

  render() {
    return (
      <table className=
        "table table-hover table-bordered header-info col-xs-12 dynamictable">
        <tbody>
          <tr>
            <th className="info col-xs-2">Voxel Size</th>
            <td className="col-xs-6" colSpan="3">
              {this.props.HeaderInfo.XStep === '' ? ' ' : 'X: ' +
              this.props.HeaderInfo.XStep + ' mm '}
              {this.props.HeaderInfo.YStep === '' ? ' ' : 'Y: ' +
              this.props.HeaderInfo.YStep + ' mm '}
              {this.props.HeaderInfo.ZStep === '' ? ' ' : 'Z: ' +
              this.props.HeaderInfo.ZStep + ' mm '}
            </td>
            <th className="col-xs-2 info">Output Type</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.OutputType}
            </td>
          </tr>
          <tr>
            <th className="col-xs-2 info">Acquisition Date</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.AcquisitionDate}
            </td>

            <th className="col-xs-2 info">Space</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.CoordinateSpace}
            </td>

            <th className="col-xs-2 info">Inserted Date</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.InsertedDate}
            </td>
          </tr>
          <tr>
            <th className="col-xs-2 info">Protocol</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.AcquisitionProtocol}
            </td>

            <th className="col-xs-2 info">Series Description</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.SeriesDescription}
            </td>

            <th className="col-xs-2 info">Series Number</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.SeriesNumber}
            </td>
          </tr>
          <tr>
            <th className="col-xs-2 info">Echo Time</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.EchoTime} ms
            </td>

            <th className="col-xs-2 info">Rep Time</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.RepetitionTime} ms
            </td>

            <th className="col-xs-2 info">Slice Thick</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.SliceThickness} mm
            </td>
          </tr>
          <tr>
            <th className="col-xs-2 info">Number of volumes</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.NumVolumes} volumes
            </td>

            <th className="col-xs-2 info">Pipeline</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.Pipeline}
            </td>

            <th className="col-xs-2 info">Algorithm</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.Algorithm}
            </td>
          </tr>
          <tr>
            <th className="col-xs-2 info">
            Number of rejected directions
            </th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.TotalRejected}
            </td>

            <th className="col-xs-2 info">
            Number of Interlace correlations
            </th>
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
          <tr>
            <th className="col-xs-2 info">
            Number of Slicewise correlations
            </th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.SlicewiseRejected}
            </td>
            <th className="col-xs-2 info">
            Series Instance UID
            </th>
            <td className="col-xs-2" colSpan="2">
              {this.props.HeaderInfo.SeriesUID}
            </td>
            <td className="col-xs-4" colSpan="4">&nbsp;</td>
          </tr>
        </tbody>
      </table>
    );
  }
}
ImagePanelHeadersTable.propTypes = {
  HeaderInfo: PropTypes.object,
};

class ImageQCDropdown extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let label = <label>{this.props.Label}</label>;
    if (this.props.url) {
      label = <label>
        <a href={this.props.url}>{this.props.Label}</a>
      </label>;
    }
    let dropdown;
    if (this.props.editable) {
      const options = [];
      for (const key in this.props.options) {
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
          {this.props.defaultValue}
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
  editable: PropTypes.string,
  options: PropTypes.object,
  FileID: PropTypes.string,
  FormName: PropTypes.string,
  defaultValue: PropTypes.string,
};

class ImageQCStatic extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const staticInfo = (
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

class ImagePanelQCStatusSelector extends Component {
  constructor(props) {
    super(props);
  }

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
  FileNew: PropTypes.string,
  HasQCPerm: PropTypes.string,
  QCStatus: PropTypes.string,
};

class ImagePanelQCSelectedSelector extends Component {
  constructor(props) {
    super(props);
  }

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
  HasQCPerm: PropTypes.string,
  Selected: PropTypes.string,
};

class ImagePanelQCCaveatSelector extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Link caveat to MRI Violations if set true
    let mriViolationsLink = null;
    if (this.props.SeriesUID && this.props.Caveat === '1') {
      mriViolationsLink = '/mri_violations/?' +
        'submenu=mri_protocol_check_violations&SeriesUID=' +
        this.props.SeriesUID + '&filter=true';
    }

    return (
      <ImageQCDropdown
        Label="Caveat"
        FormName="caveat"
        FileID={this.props.FileID}
        editable={this.props.HasQCPerm}
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
  HasQCPerm: PropTypes.string,
  SeriesUID: PropTypes.string,
  Caveat: PropTypes.string,
};

class ImagePanelQCSNRValue extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ImageQCStatic
        Label="SNR"
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

class ImagePanelQCPanel extends Component {
  constructor(props) {
    super(props);
  }

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
  HasQCPerm: PropTypes.string,
  QCStatus: PropTypes.string,
  FileNew: PropTypes.string,
  Selected: PropTypes.string,
  Caveat: PropTypes.string,
  SeriesUID: PropTypes.string,
  SNR: PropTypes.string,
};

class DownloadButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.FileName || this.props.FileName === '') {
      return <span/>;
    }
    const style = {
      margin: 6,
    };
    return (
      <a href={this.props.BaseURL + '/mri/jiv/get_file.php?file=' +
      this.props.FileName}
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
};

class ImageQCCommentsButton extends Component {
  constructor(props) {
    super(props);
    this.openWindowHandler = this.openWindowHandler.bind(this);
  }

  openWindowHandler(e) {
    e.preventDefault();
    window.open(
        this.props.BaseURL + '/feedback_mri_popup.php?fileID=' +
      this.props.FileID,
        'feedback_mri',
        'width=500,height=800,toolbar=no,location=no,' +
      'status=yes,scrollbars=yes,resizable=yes'
    );
  }

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
DownloadButton.propTypes = {
  FileID: PropTypes.string,
  BaseURL: PropTypes.string,
};

class LongitudinalViewButton extends Component {
  constructor(props) {
    super(props);
    this.openWindowHandler = this.openWindowHandler.bind(this);
  }

  openWindowHandler(e) {
    e.preventDefault();
    window.open(
        this.props.BaseURL + '/brainbrowser/?minc_id=[' +
      this.props.OtherTimepoints + ']',
        'BrainBrowser Volume Viewer',
        'location = 0,width = auto, height = auto, scrollbars=yes'
    );
  }

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

class ImageDownloadButtons extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row mri-second-row-panel col-xs-12">
        <ImageQCCommentsButton FileID={this.props.FileID}
          BaseURL={this.props.BaseURL}
        />
        <DownloadButton FileName={this.props.Fullname}
          Label="Download Minc"
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
  Fullname: PropTypes.string,
  XMLProtocol: PropTypes.string,
  XMLReport: PropTypes.string,
  NrrdFile: PropTypes.string,
  OtherTimepoints: PropTypes.string,
};

class ImagePanelBody extends Component {
  constructor(props) {
    super(props);
    this.openWindowHandler = this.openWindowHandler.bind(this);
  }


  openWindowHandler(e) {
    e.preventDefault();
    window.open(this.props.BaseURL + '/brainbrowser/?minc_id=[' +
      this.props.FileID + ']', 'BrainBrowser Volume Viewer',
    'location = 0,width = auto, height = auto, scrollbars=yes');
  }

  render() {
    return (
      <div className="panel-body">
        <div className="row">
          <div className="col-xs-9 imaging_browser_pic">
            <a href="#noID" onClick={this.openWindowHandler}>
              <img className="img-checkpic img-responsive"
                src={this.props.Checkpic}/>
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
            />
          </div>
        </div>
        <ImageDownloadButtons
          BaseURL={this.props.BaseURL}
          FileID={this.props.FileID}
          Fullname={this.props.Fullname}
          XMLProtocol={this.props.XMLProtocol}
          XMLReport={this.props.XMLReport}
          NrrdFile={this.props.NrrdFile}
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
  FileNew: PropTypes.string,
  HasQCPerm: PropTypes.string,
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
  OtherTimepoints: PropTypes.string,
  HeadersExpanded: PropTypes.string,
  Checkpic: PropTypes.string,
};

class ImagePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      BodyCollapsed: false,
      HeadersCollapsed: true,
    };
    this.toggleBody = this.toggleBody.bind(this);
    this.toggleHeaders = this.toggleHeaders.bind(this);
  }

  toggleBody(e) {
    this.setState({
      BodyCollapsed: !this.state.BodyCollapsed,
    });
  }

  toggleHeaders(e) {
    this.setState({
      HeadersCollapsed: !this.state.HeadersCollapsed,
    });
  }

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
              Checkpic={this.props.Checkpic}
              HeadersExpanded={!this.state.HeadersCollapsed}

              HeaderInfo={this.props.HeaderInfo}

              FileNew={this.props.FileNew}
              HasQCPerm={this.props.HasQCPerm}
              QCStatus={this.props.QCStatus}
              Caveat={this.props.Caveat}
              Selected={this.props.Selected}
              SNR={this.props.SNR}

              Fullname={this.props.Fullname}
              XMLProtocol={this.props.XMLProtocol}
              XMLReport={this.props.XMLReport}
              NrrdFile={this.props.NrrdFile}
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
  FileNew: PropTypes.string,
  HasQCPerm: PropTypes.string,
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
  OtherTimepoints: PropTypes.string,
  HeaderInfo: PropTypes.string,
  HeadersExpanded: PropTypes.string,
  Checkpic: PropTypes.string,
};

const RImagePanel = React.createFactory(ImagePanel);

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
