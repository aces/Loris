/* exported ImagePanelHeader, ImagePanelHeadersTable, ImageQCDropdown, ImageQCStatic,
 ImagePanelQCStatusSelector, ImagePanelQCSelectedSelector, ImagePanelQCCaveatSelector,
 ImagePanelQCSNRValue, ImagePanelQCPanel, DownloadButton, ImageQCCommentsButton.
 LongitudinalViewButton, ImageDownloadButtons, ImagePanelBody, RImagePanel
* */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withTranslation} from 'react-i18next';
import i18n from 'I18nSetup';
import hiStrings from '../locale/hi/LC_MESSAGES/imaging_browser.json';
import jaStrings from '../locale/ja/LC_MESSAGES/imaging_browser.json';

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
    i18n.addResourceBundle('hi', 'imaging_browser', hiStrings);
    i18n.addResourceBundle('ja', 'imaging_browser', jaStrings);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    let QCStatusLabel;
    if (this.props.QCStatus === t('Pass', {ns: 'loris'})) {
      QCStatusLabel = <span className="label label-success">
        {t('Pass', {ns: 'loris'})}
      </span>;
    } else if (this.props.QCStatus === t('Fail', {ns: 'loris'})) {
      QCStatusLabel = <span className="label label-danger">
        {t('Fail', {ns: 'loris'})}
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
          {t('Header Info', {ns: 'imaging_browser'})}
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
  t: PropTypes.func,
};

const TranslatedImagePanelHeader = withTranslation(
  ['imaging_browser'])(ImagePanelHeader);

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
    i18n.addResourceBundle('hi', 'imaging_browser', hiStrings);
    i18n.addResourceBundle('ja', 'imaging_browser', jaStrings);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
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
            <th className="col-xs-2 info">{t('Series Instance UID',
              {ns: 'imaging_browser'})}</th>
            <td className="col-xs-10" colSpan="5">
              {this.props.HeaderInfo.SeriesUID}
            </td>
          </tr>
          <tr>
            <th className="col-xs-2 info">{t('Voxel Size',
              {ns: 'imaging_browser'})}</th>
            <td className="col-xs-6" colSpan="3">
              {this.props.HeaderInfo.XStep === '' ? ' ' : 'X: ' +
              this.props.HeaderInfo.XStep + ' mm, '}
              {this.props.HeaderInfo.YStep === '' ? ' ' : 'Y: ' +
              this.props.HeaderInfo.YStep + ' mm, '}
              {this.props.HeaderInfo.ZStep === '' ? ' ' : 'Z: ' +
              this.props.HeaderInfo.ZStep + ' mm '}
            </td>
            <th className="col-xs-2 info">{t('Output Type',
              {ns: 'imaging_browser'})}</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.OutputType}
            </td>
          </tr>
          <tr>
            <th className="col-xs-2 info">{t('Protocol',
              {ns: 'imaging_browser'})}</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.AcquisitionProtocol}
            </td>
            <th className="col-xs-2 info">{t('Acquisition Date',
              {ns: 'imaging_browser'})}</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.AcquisitionDate}
            </td>
            <th className="col-xs-2 info">{t('Inserted Date',
              {ns: 'imaging_browser'})}</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.InsertedDate}
            </td>
          </tr>
          <tr>
            <th className="col-xs-2 info">{t('Series Number',
              {ns: 'imaging_browser'})}</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.SeriesNumber}
            </td>
            <th className="col-xs-2 info">{t('Series Description',
              {ns: 'imaging_browser'})}</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.SeriesDescription}
            </td>
            <th className="col-xs-2 info">{t('Slice Thick',
              {ns: 'imaging_browser'})}</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.SliceThickness} mm
            </td>
          </tr>
          <tr>
            <th className="col-xs-2 info">{t('TR',
              {ns: 'imaging_browser'})}</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.RepetitionTime} ms
            </td>
            <th className="col-xs-2 info">{t('TE',
              {ns: 'imaging_browser'})}</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.EchoTime} ms
            </td>
            <th className="col-xs-2 info">{t('TI',
              {ns: 'imaging_browser'})}</th>
            <td className="col-xs-2">
              {inversionTime}
            </td>
          </tr>
          <tr>
            <th className="col-xs-2 info">{t('Phase Encoding Direction',
              {ns: 'imaging_browser'})}</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.PhaseEncodingDirection}
            </td>
            <th className="col-xs-2 info">{t('Image Type',
              {ns: 'imaging_browser'})}</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.ImageType}
            </td>
            <th className="col-xs-2 info">{t('Echo Number',
              {ns: 'imaging_browser'})}</th>
            <td className="col-xs-2">
              {this.props.HeaderInfo.EchoNumber}
            </td>
          </tr>
          <tr>
            <th className="col-xs-2 info">{t('Number of volumes',
              {ns: 'imaging_browser'})}</th>
            <td className="col-xs-2">
              {numVolumes}
            </td>
            {this.props.HeaderInfo.ProcessingPipeline ?
              <th className="col-xs-2 info">{t('Processing Pipeline',
                {ns: 'imaging_browser'})}</th>
              : null}
            {this.props.HeaderInfo.ProcessingPipeline ?
              <td className="col-xs-2">
                {this.props.HeaderInfo.ProcessingPipeline}
              </td>
              : null}
            {this.props.HeaderInfo.ProcDate ?
              <th className="col-xs-2 info">{t('Processing Pipeline Date',
                {ns: 'imaging_browser'})}</th>
              : null }
            {this.props.HeaderInfo.ProcDate ?
              <td className="col-xs-2">
                {this.props.HeaderInfo.ProcDate}
              </td>
              : null }
          </tr>
          {this.props.HeaderInfo.ProcessingPipeline === 'DTIPrepPipeline' ?
            <tr>
              <th className="col-xs-2 info">{t('Number of rejected directions',
                {ns: 'imaging_browser'})}</th>
              <td className="col-xs-2">
                {this.props.HeaderInfo.TotalRejected}
              </td>
              <th className="col-xs-2 info">
                {t('Number of Interlace correlations',
                  {ns: 'imaging_browser'})}
              </th>
              <td className="col-xs-2">
                {this.props.HeaderInfo.InterlaceRejected}
              </td>
              <th className="col-xs-2 info">
                {t('Number of Gradient-wise correlations',
                  {ns: 'imaging_browser'})}
              </th>
              <td className="col-xs-2">
                {this.props.HeaderInfo.IntergradientRejected}
              </td>
            </tr>
            : null}
          {this.props.HeaderInfo.ProcessingPipeline === 'DTIPrepPipeline' ?
            <tr>
              <th className="col-xs-2 info">
                {t('Number of Slicewise correlations',
                  {ns: 'imaging_browser'})}
              </th>
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
  t: PropTypes.func,
};

const TranslatedImagePanelHeadersTable = withTranslation(
  ['imaging_browser'])(ImagePanelHeadersTable);

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
    i18n.addResourceBundle('hi', 'imaging_browser', hiStrings);
    i18n.addResourceBundle('ja', 'imaging_browser', jaStrings);
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
  t: PropTypes.func,
};

const TranslatedImageQCDropdown = withTranslation(
  ['imaging_browser'])(ImageQCDropdown);

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
    i18n.addResourceBundle('hi', 'imaging_browser', hiStrings);
    i18n.addResourceBundle('ja', 'imaging_browser', jaStrings);
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
  t: PropTypes.func,
};

const TranslatedImageQCStatic = withTranslation(
  ['imaging_browser'])(ImageQCStatic);

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
    i18n.addResourceBundle('hi', 'imaging_browser', hiStrings);
    i18n.addResourceBundle('ja', 'imaging_browser', jaStrings);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    let qcStatusLabel;
    if (this.props.HasQCPerm && this.props.FileNew) {
      qcStatusLabel = <span>
        {t('QC Status', {ns: 'imaging_browser'})} <span className="text-info">
                             ( <span className="glyphicon glyphicon-star">
          </span> {t('New', {ns: 'loris'})} )
        </span>
      </span>;
    } else {
      qcStatusLabel = t('QC Status', {ns: 'imaging_browser'});
    }

    return (
      <TranslatedImageQCDropdown
        Label={qcStatusLabel}
        FormName="status"
        FileID={this.props.FileID}
        editable={this.props.HasQCPerm}
        defaultValue={this.props.QCStatus}
        options={{'': '', 'Pass': t('Pass', {ns: 'loris'}),
          'Fail': t('Fail', {ns: 'loris'})}}
      />
    );
  }
}
ImagePanelQCStatusSelector.propTypes = {
  FileNew: PropTypes.bool,
  HasQCPerm: PropTypes.bool,
  QCStatus: PropTypes.string,
  FileID: PropTypes.string,
  t: PropTypes.func,
};

const TranslatedImagePanelQCStatusSelector = withTranslation(
  ['imaging_browser'])(ImagePanelQCStatusSelector);

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
    i18n.addResourceBundle('hi', 'imaging_browser', hiStrings);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    return (
      <TranslatedImageQCDropdown
        Label={t('Selected', {ns: 'loris'})}
        FormName="selectedvol"
        FileID={this.props.FileID}
        editable={this.props.HasQCPerm}
        options={{'': '', 'true': t('True', {ns: 'loris'}),
          'false': t('False', {ns: 'loris'})}}
        defaultValue={this.props.Selected}
      />
    );
  }
}
ImagePanelQCSelectedSelector.propTypes = {
  FileID: PropTypes.string,
  HasQCPerm: PropTypes.bool,
  Selected: PropTypes.string,
  t: PropTypes.func,
};

const TranslatedImagePanelQCSelectedSelector = withTranslation(
  ['imaging_browser'])(ImagePanelQCSelectedSelector);

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
    i18n.addResourceBundle('hi', 'imaging_browser', hiStrings);
    i18n.addResourceBundle('ja', 'imaging_browser', jaStrings);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    // Link caveat to MRI Violations if set true
    let mriViolationsLink = null;
    if (this.props.FullName && this.props.Caveat === '1') {
      mriViolationsLink = '/mri_violations/?' +
          'mincFile=' + this.props.FullName +
          '&seriesUID=' + this.props.SeriesUID;
    }

    return (
      <TranslatedImageQCDropdown
        Label={t('Caveat', {ns: 'imaging_browser'})}
        FormName="caveat"
        FileID={this.props.FileID}
        editable={this.props.HasQCPerm && this.props.EditableCaveat}
        options={
          {
            '': '',
            '1': t('True', {ns: 'loris'}),
            '0': t('False', {ns: 'loris'}),
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
  t: PropTypes.func,
};

const TranslatedImagePanelQCCaveatSelector = withTranslation(
  ['imaging_browser'])(ImagePanelQCCaveatSelector);

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
    i18n.addResourceBundle('hi', 'imaging_browser', hiStrings);
    i18n.addResourceBundle('ja', 'imaging_browser', jaStrings);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    let label = null;
    if (this.props.SNR) {
      label = t('SNR', {ns: 'imaging_browser'});
    }
    return (
      <TranslatedImageQCStatic
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
  t: PropTypes.func,
};

const TranslatedImagePanelQCSNRValue = withTranslation(
  ['imaging_browser'])(ImagePanelQCSNRValue);

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
    i18n.addResourceBundle('hi', 'imaging_browser', hiStrings);
    i18n.addResourceBundle('ja', 'imaging_browser', jaStrings);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <div className="form-group">
        <TranslatedImagePanelQCStatusSelector
          FileID={this.props.FileID}
          HasQCPerm={this.props.HasQCPerm}
          QCStatus={this.props.QCStatus}
          FileNew={this.props.FileNew}
        />
        <TranslatedImagePanelQCSelectedSelector
          FileID={this.props.FileID}
          HasQCPerm={this.props.HasQCPerm}
          Selected={this.props.Selected}
        />
        <TranslatedImagePanelQCCaveatSelector
          FileID={this.props.FileID}
          HasQCPerm={this.props.HasQCPerm}
          Caveat={this.props.Caveat}
          SeriesUID={this.props.SeriesUID}
          EditableCaveat={this.props.EditableCaveat}
          FullName={this.props.FullName}
        />
        <TranslatedImagePanelQCSNRValue
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
  t: PropTypes.func,
};

const TranslatedImagePanelQCPanel = withTranslation(
  ['imaging_browser'])(ImagePanelQCPanel);

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
    i18n.addResourceBundle('hi', 'imaging_browser', hiStrings);
    i18n.addResourceBundle('ja', 'imaging_browser', jaStrings);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
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
        <span className="hidden-xs">{t('Download Image',
          {ns: 'imaging_browser'})}</span>
      </a>
    );
  }
}
DownloadButton.propTypes = {
  FileName: PropTypes.string,
  BaseURL: PropTypes.string,
  Label: PropTypes.string,
  URL: PropTypes.string,
  t: PropTypes.func,
};

const TranslatedDownloadButton = withTranslation(
  ['imaging_browser'])(DownloadButton);

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
    i18n.addResourceBundle('hi', 'imaging_browser', hiStrings);
    i18n.addResourceBundle('ja', 'imaging_browser', jaStrings);
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
    const {t} = this.props;
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
          <span className="hidden-xs">
            {t('QC Comments', {ns: 'imaging_browser'})}
          </span>
        </span>
      </a>
    );
  }
}
ImageQCCommentsButton.propTypes = {
  FileID: PropTypes.string,
  BaseURL: PropTypes.string,
  t: PropTypes.func,
};

const TranslatedImageQCCommentsButton = withTranslation(
  ['imaging_browser'])(ImageQCCommentsButton);

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
    i18n.addResourceBundle('hi', 'imaging_browser', hiStrings);
    i18n.addResourceBundle('ja', 'imaging_browser', jaStrings);
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
    const {t} = this.props;
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
          <span className="hidden-xs">{t('Longitudinal View',
            {ns: 'imaging_browser'})}</span>
        </span>
      </a>
    );
  }
}
LongitudinalViewButton.propTypes = {
  FileID: PropTypes.string,
  BaseURL: PropTypes.string,
  OtherTimepoints: PropTypes.string,
  t: PropTypes.func,
};

const TranslatedLongitudinalViewButton = withTranslation(
  ['imaging_browser'])(LongitudinalViewButton);

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
    i18n.addResourceBundle('hi', 'imaging_browser', hiStrings);
    i18n.addResourceBundle('ja', 'imaging_browser', jaStrings);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    return (
      <div className="row mri-second-row-panel col-xs-12">
        <TranslatedImageQCCommentsButton FileID={this.props.FileID}
          BaseURL={this.props.BaseURL}
        />
        <TranslatedDownloadButton URL={this.props.APIFile}
          Label={t('Download Image', {ns: 'imaging_browser'})}
          BaseURL={this.props.BaseURL}
        />
        <TranslatedDownloadButton FileName={this.props.XMLProtocol}
          BaseURL={this.props.BaseURL}
          Label={t('Download XML Protocol', {ns: 'imaging_browser'})}
        />
        <TranslatedDownloadButton FileName={this.props.XMLReport}
          BaseURL={this.props.BaseURL}
          Label={t('Download XML Report', {ns: 'imaging_browser'})}
        />
        <TranslatedDownloadButton FileName={this.props.NrrdFile}
          BaseURL={this.props.BaseURL}
          Label={t('Download NRRD', {ns: 'imaging_browser'})}
        />
        { this.props.NiiFile ?
          <TranslatedDownloadButton URL={this.props.APIFile + '/format/nifti'}
            Label={t('Download NIfTI', {ns: 'imaging_browser'})}
          /> :
          null
        }
        {this.props.BvalFile ?
          <TranslatedDownloadButton URL={this.props.APIFile + '/format/bval'}
            Label={t('Download BVAL', {ns: 'imaging_browser'})}
          /> :
          null
        }
        {this.props.BvecFile ?
          <TranslatedDownloadButton URL={this.props.APIFile + '/format/bvec'}
            Label={t('Download BVEC', {ns: 'imaging_browser'})}
          /> :
          null
        }
        {this.props.JsonFile ?
          <TranslatedDownloadButton URL=
            {this.props.APIFile + '/format/bidsjson'}
          Label={t('Download BIDS JSON', {ns: 'imaging_browser'})}
          /> :
          null
        }
        <TranslatedLongitudinalViewButton FileID={this.props.FileID}
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
  t: PropTypes.func,
};

const TranslatedImageDownloadButtons = withTranslation(
  ['imaging_browser'])(ImageDownloadButtons);

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
    i18n.addResourceBundle('hi', 'imaging_browser', hiStrings);
    i18n.addResourceBundle('ja', 'imaging_browser', jaStrings);
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
            <TranslatedImagePanelQCPanel
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
        <TranslatedImageDownloadButtons
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
        {this.props.HeadersExpanded ? <TranslatedImagePanelHeadersTable
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
  t: PropTypes.func,
};

const TranslatedImagePanelBody = withTranslation(
  ['imaging_browser'])(ImagePanelBody);

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
          <TranslatedImagePanelHeader
            FileID={this.props.FileID}
            Filename={this.props.Filename}
            QCStatus={this.props.QCStatus}
            onToggleBody={this.toggleBody}
            onToggleHeaders={this.toggleHeaders}
            Expanded={!this.state.BodyCollapsed}
            HeadersExpanded={!this.state.HeadersCollapsed}
          />
          {this.state.BodyCollapsed ? '' :
            <TranslatedImagePanelBody
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
  t: PropTypes.func,
};

let RImagePanel = React.createFactory(ImagePanel);

window.ImagePanelHeader = TranslatedImagePanelHeader;
window.ImagePanelHeadersTable = TranslatedImagePanelHeadersTable;
window.ImageQCDropdown = TranslatedImageQCDropdown;
window.ImageQCStatic = TranslatedImageQCStatic;
window.ImagePanelQCStatusSelector = TranslatedImagePanelQCStatusSelector;
window.ImagePanelQCSelectedSelector = TranslatedImagePanelQCSelectedSelector;
window.ImagePanelQCCaveatSelector = TranslatedImagePanelQCCaveatSelector;
window.ImagePanelQCSNRValue = TranslatedImagePanelQCSNRValue;
window.ImagePanelQCPanel = TranslatedImagePanelQCPanel;
window.DownloadButton = TranslatedDownloadButton;
window.ImageQCCommentsButton = TranslatedImageQCCommentsButton;
window.LongitudinalViewButton = TranslatedLongitudinalViewButton;
window.ImageDownloadButtons = TranslatedImageDownloadButtons;
window.ImagePanelBody = TranslatedImagePanelBody;
window.RImagePanel = RImagePanel;

export default {
  ImagePanelHeader: TranslatedImagePanelHeader,
  ImagePanelHeadersTable: TranslatedImagePanelHeadersTable,
  ImageQCDropdown: TranslatedImageQCDropdown,
  ImageQCStatic: TranslatedImageQCStatic,
  ImagePanelQCStatusSelector: TranslatedImagePanelQCStatusSelector,
  ImagePanelQCSelectedSelector: TranslatedImagePanelQCSelectedSelector,
  ImagePanelQCCaveatSelector: TranslatedImagePanelQCCaveatSelector,
  ImagePanelQCSNRValue: TranslatedImagePanelQCSNRValue,
  ImagePanelQCPanel: TranslatedImagePanelQCPanel,
  DownloadButton: TranslatedDownloadButton,
  ImageQCCommentsButton: TranslatedImageQCCommentsButton,
  LongitudinalViewButton: TranslatedLongitudinalViewButton,
  ImageDownloadButtons: TranslatedImageDownloadButtons,
  ImagePanelBody: TranslatedImagePanelBody,
  RImagePanel,
};
