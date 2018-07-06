/* exported ImagePanelHeader, ImagePanelHeadersTable, ImageQCDropdown, ImageQCStatic,
 ImagePanelQCStatusSelector, ImagePanelQCSelectedSelector, ImagePanelQCCaveatSelector,
 ImagePanelQCSNRValue, ImagePanelQCPanel, DownloadButton, ImageQCCommentsButton.
 LongitudinalViewButton, ImageDownloadButtons, ImagePanelBody, RImagePanel
* */

var ImagePanelHeader = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  componentDidMount: function() {
    $(".panel-title").tooltip();
  },
  render: function() {
    var QCStatusLabel;
    if (this.props.QCStatus === 'Pass') {
      QCStatusLabel = <span className="label label-success">
                         {this.props.QCStatus}
                      </span>;
    } else if (this.props.QCStatus === 'Fail') {
      QCStatusLabel = <span className="label label-danger">
                         {this.props.QCStatus}
                      </span>;
    }

    var arrow;
    if (this.props.Expanded) {
      arrow = <span onClick={this.props.onToggleBody}
         className="pull-right clickable glyphicon arrow glyphicon-chevron-up">
              </span>;
    } else {
      arrow = <span onClick={this.props.onToggleBody}
     className="pull-right clickable glyphicon arrow glyphicon-chevron-down">
              </span>;
    }
    var headerButton = (
            <div className="pull-right">
                <div className="btn-group views">
                    <button
                        type="button"
                        className="btn btn-default btn-xs dropdown-toggle"
                        onClick={this.props.onToggleHeaders}
                        aria-expanded={this.props.HeadersExpanded}>
                        Header Info
                        <span className="glyphicon glyphicon-chevron-right"/>
                        </button>
                </div>
            </div>
            );
    return (

            <div className="panel-heading clearfix">
            <input type="checkbox" data-file-id={this.props.FileID}
                     className="mripanel user-success" />
                <h3 className="panel-title" data-toggle="tooltip" title={this.props.Filename}>
                  {this.props.Filename}
                </h3>
                {QCStatusLabel}
                <ImageQCCommentsButton
                  FileID={this.props.FileID}
                  BaseURL={this.props.BaseURL}
                />
                <LongitudinalViewButton
                  FileID={this.props.FileID}
                  BaseURL={this.props.BaseURL}
                  OtherTimepoints={this.props.OtherTimepoints}
                />
                {arrow}
                {headerButton}
            </div>
        );
  }

});
var ImagePanelHeadersTable = React.createClass({
  componentDidMount: function() {
    $(ReactDOM.findDOMNode(this)).DynamicTable();
  },
  componentWillUnmount: function() {
    // Remove wrapper nodes so React is able to remove component
    $(ReactDOM.findDOMNode(this)).DynamicTable({
      removeDynamicTable: true
    });
  },
  render: function() {
    return (
            <table className=
         "table table-hover table-bordered header-info col-xs-12 dynamictable">
                <tbody>
                {/* SERIES UID */}
                    <tr>
                      <th className="col-xs-4 info">
                        Series Instance UID</th>
                      <td className="col-xs-8" colSpan="3">
                        {this.props.HeaderInfo.SeriesUID}
                      </td>
                    </tr>
                {/* VOXEL SIZE */}
                    <tr>
                        <th className="col-xs-4 info">Voxel Size</th>
                        <td className="col-xs-8" colSpan="3">
                            {this.props.HeaderInfo.XStep === '' ? ' ' : 'X: ' +
                                    this.props.HeaderInfo.XStep + " mm "}
                            {this.props.HeaderInfo.YStep === '' ? ' ' : 'Y: ' +
                                    this.props.HeaderInfo.YStep + " mm "}
                            {this.props.HeaderInfo.ZStep === '' ? ' ' : 'Z: ' +
                                    this.props.HeaderInfo.ZStep + " mm "}
                        </td>
                    </tr>
                {/* SERIES NUMBER x SNR */}
                <tr>
                  <th className="col-xs-4 info">Series Number</th>
                  <td className="col-xs-2">
                    {this.props.HeaderInfo.SeriesNumber}
                  </td>
                  <th className="col-xs-4 info">SNR</th>
                  <td className="col-xs-2">
                    {this.props.SNR}
                  </td>
                </tr>
                {/* SERIES DESCRIPTION x SERIES PROTOCOL */}
                    <tr>
                      <th className="col-xs-4 info">Series Description</th>
                      <td className="col-xs-2">
                        {this.props.HeaderInfo.SeriesDescription}
                      </td>

                      <th className="col-xs-4 info">Protocol</th>
                      <td className="col-xs-2">
                        {this.props.HeaderInfo.AcquisitionProtocol}
                      </td>
                    </tr>

                {/* ACQUISITION DATE x INSERTED DATE */}
                    <tr>
                        <th className="col-xs-4 info">Acquisition Date</th>
                        <td className="col-xs-2">
                                  {this.props.HeaderInfo.AcquisitionDate}
                        </td>

                      <th className="col-xs-4 info">Inserted Date</th>
                      <td className="col-xs-2">
                        {this.props.HeaderInfo.InsertedDate}
                      </td>
                    </tr>

                {/* OUTPUT TYPE x SPACE */}
                    <tr>
                      <th className="col-xs-4 info">Output Type</th>
                      <td className="col-xs-2">
                        {this.props.HeaderInfo.OutputType}
                      </td>

                      <th className="col-xs-4 info">Space</th>
                        <td className="col-xs-2">
                                  {this.props.HeaderInfo.CoordinateSpace}
                        </td>
                    </tr>

                {/* ECHO TIME x REPETITION */}
                <tr>
                  <th className="col-xs-4 info">Echo Time</th>
                  <td className="col-xs-2">
                    {this.props.HeaderInfo.EchoTime} ms
                  </td>

                  <th className="col-xs-4 info">Rep Time</th>
                  <td className="col-xs-2">
                    {this.props.HeaderInfo.RepetitionTime} ms
                  </td>
                </tr>

                {/* NUMBER OF VOLUMES x SLICE THICKNESS */}
                    <tr>
                      <th className="col-xs-4 info">Number of volumes</th>
                      <td className="col-xs-2">
                        {this.props.HeaderInfo.NumVolumes} volumes
                      </td>

                      <th className="col-xs-4 info">Slice Thick</th>
                      <td className="col-xs-2">
                        {this.props.HeaderInfo.SliceThickness} mm
                      </td>
                    </tr>

                { /* ALGORITHM x PIPELINE */}
                    <tr>
                      <th className="col-xs-4 info">Algorithm</th>
                      <td className="col-xs-2">
                        {this.props.HeaderInfo.Algorithm}
                      </td>

                        <th className="col-xs-4 info">Pipeline</th>
                        <td className="col-xs-2">
                             {this.props.HeaderInfo.Pipeline}
                        </td>
                    </tr>

                {/* SLICEWISE CORRELATIONS x GRAIDENT-WISE CORRELATIONS */}
                    <tr>
                      <th className="col-xs-4 info">
                        Number of Slicewise correlations
                      </th>
                      <td className="col-xs-2">
                        {this.props.HeaderInfo.SlicewiseRejected}
                      </td>

                      <th className="col-xs-4 info">
                        Number of Gradient-wise correlations
                      </th>
                      <td className="col-xs-2">
                        {this.props.HeaderInfo.IntergradientRejected}
                      </td>
                    </tr>

                {/* INTERLACE CORRELATIONS x REJECTED DIRECTIONS */}
                    <tr>
                        <th className="col-xs-4 info">
                              Number of Interlace correlations
                        </th>
                        <td className="col-xs-2">
                             {this.props.HeaderInfo.InterlaceRejected}
                        </td>

                      <th className="col-xs-4 info">
                        Number of rejected directions
                      </th>
                      <td className="col-xs-2">
                        {this.props.HeaderInfo.TotalRejected}
                      </td>
                    </tr>
                </tbody>
            </table>
        );
  }
});

// generic component for QC selectors (QC Status, Selected, Caveat)
var ImageQCDropdown = React.createClass({

  render: function() {
    var label = <label>{this.props.Label}</label>;
    if (this.props.url) {
      label = <label>
                 <a href={this.props.url}>{this.props.Label}</a>
              </label>;
    }
    var dropdown;
    if (this.props.editable) {
      var options = [];
      for (var key in this.props.options) {
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
                      "[" + this.props.FileID + "]"}
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
            <p>
                {label}
                {dropdown}
            </p>
        );
  }
});
var ImageQCStatic = React.createClass({
  render: function() {
    var staticInfo;
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
});
var ImagePanelQCStatusSelector = React.createClass({
  render: function() {
    var qcStatusLabel;
    if (this.props.HasQCPerm && this.props.FileNew) {
      qcStatusLabel = <span>
                        QC Status <span className="text-info">
                             (<span className="glyphicon glyphicon-star"/> New)
                         </span>
                      </span>;
    } else {
      qcStatusLabel = "QC Status";
    }

    return (
            <ImageQCDropdown
                    Label={qcStatusLabel}
                    FormName="status"
                    FileID={this.props.FileID}
                    editable={this.props.HasQCPerm}
                    defaultValue={this.props.QCStatus}
                    options={ {"": "", "Pass": "Pass", "Fail": "Fail"} }
            />
        );
  }
});
var ImagePanelQCSelectedSelector = React.createClass({
  render: function() {
    return (
            <ImageQCDropdown
                Label="Selected"
                FormName="selectedvol"
                FileID={this.props.FileID}
                editable={this.props.HasQCPerm}
                options={ {"": "", "true": "True", "false": "False"} }
                defaultValue={this.props.Selected}
            />
        );
  }
});
var ImagePanelQCCaveatSelector = React.createClass({
  render: function() {
        // Link caveat to MRI Violations if set true
    var mriViolationsLink = null;
    if (this.props.SeriesUID && this.props.Caveat === "1") {
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
                  "": "",
                  "1": "True",
                  "0": "False"
                }
                }
                defaultValue={this.props.Caveat}
                url={mriViolationsLink}
            />
        );
  }
});
var ImagePanelQCSNRValue = React.createClass({
  render: function() {
    return (
            <ImageQCStatic
                Label="SNR"
                FormName="snr"
                FileID={this.props.FileID}
                defaultValue={this.props.SNR}
            />
        );
  }
});
var ImagePanelQCPanel = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  render: function() {
    return (
            <div>
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
            </div>
        );
  }
});

var DownloadButton = React.createClass({
  render: function() {
    if (!this.props.FileName || this.props.FileName === '') {
      return <span />;
    }
    var style = {
      margin: 6
    };
    return (
      <div className="row">
        <a href={this.props.BaseURL + "/mri/jiv/get_file.php?file=" +
              this.props.FileName}
           className="btn btn-default" style={style}>
            <span className="glyphicon glyphicon-download-alt"></span>
            <span className="hidden-xs">{this.props.Label}</span>
        </a>
       </div>
    );
  }
});

var ImageQCCommentsButton = React.createClass({
  openWindowHandler: function(e) {
    e.preventDefault();
    window.open(
            this.props.BaseURL + "/feedback_mri_popup.php?fileID=" +
            this.props.FileID,
            "feedback_mri",
            "width=500,height=800,toolbar=no,location=no," +
            "status=yes,scrollbars=yes,resizable=yes"
        );
  },
  render: function() {
    if (!this.props.FileID || this.props.FileID === '') {
      return <span />;
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
});

var LongitudinalViewButton = React.createClass({
  openWindowHandler: function(e) {
    e.preventDefault();
    window.open(
            this.props.BaseURL + "/brainbrowser/?minc_id=[" +
            this.props.OtherTimepoints + "]",
            "BrainBrowser Volume Viewer",
            "location = 0,width = auto, height = auto, scrollbars=yes"
        );
  },
  render: function() {
    if (!this.props.FileID || this.props.FileID === '') {
      return <span />;
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
});

var ImageDownloadButtons = React.createClass({
  render: function() {
    return (
            <div className="row mri-second-row-panel col-xs-12">
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
            </div>
        );
  }
});
var ImagePanelBody = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  openWindowHandler: function(e) {
    e.preventDefault();
    window.open(this.props.BaseURL + "/brainbrowser/?minc_id=[" +
                 this.props.FileID + "]", "BrainBrowser Volume Viewer",
                 "location = 0,width = auto, height = auto, scrollbars=yes");
  },
  render: function() {
    return (
                <div className="panel-body">
                    <div className="row">
                        <div className="col-xs-8 imaging_browser_pic">
                            <a href="#noID" onClick={this.openWindowHandler}>
                                <img className="img-responsive"
                                  src={this.props.Checkpic} />
                            </a>
                        </div>
                        <div className="col-xs-4 mri-right-panel">
                          <ImagePanelQCPanel
                            FileID={this.props.FileID}
                            FileNew={this.props.FileNew}
                            HasQCPerm={this.props.HasQCPerm}
                            QCStatus={this.props.QCStatus}
                            Caveat={this.props.Caveat}
                            Selected={this.props.Selected}
                            SeriesUID={this.props.SeriesUID}
                          />
                          <ImageDownloadButtons
                            BaseURL={this.props.BaseURL}
                            FileID={this.props.FileID}
                            Fullname={this.props.Fullname}
                            XMLProtocol={this.props.XMLProtocol}
                            XMLReport={this.props.XMLReport}
                            NrrdFile={this.props.NrrdFile}
                            OtherTimepoints={this.props.OtherTimepoints}
                          />
                        </div>
                    </div>
                </div>
        );
  }
});

var ImagePanel = React.createClass({
  getInitialState: function() {
    return {
      BodyCollapsed: false,
      HeadersCollapsed: false
    };
  },
  toggleBody: function(e) {
    this.setState({
      BodyCollapsed: !this.state.BodyCollapsed
    });
  },
  toggleHeaders: function(e) {
    this.setState({
      HeadersCollapsed: !this.state.HeadersCollapsed
    });
  },
  render: function() {
    return (
      <div className="col-xs-12">
            <div className="col-md-12 col-lg-12">
                <div className="panel panel-default">
                <ImagePanelHeader
                    BaseURL={this.props.BaseURL}
                    FileID={this.props.FileID}
                    Filename={this.props.Filename}
                    QCStatus={this.props.QCStatus}
                    onToggleBody={this.toggleBody}
                    onToggleHeaders={this.toggleHeaders}
                    Expanded={!this.state.BodyCollapsed}
                    HeadersExpanded={!this.state.HeadersCollapsed}
                    OtherTimepoints={this.props.OtherTimepoints}
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
                    /> }
                </div>
            </div>

            <div className="col-md-12 col-lg-12">
            {!this.state.HeadersCollapsed && !this.state.BodyCollapsed ? <ImagePanelHeadersTable
                HeaderInfo={this.props.HeaderInfo}
                SNR={this.props.SNR}
              /> : ''
            }
            </div>
      </div>
        );
  }
});
var RImagePanel = React.createFactory(ImagePanel);

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
  RImagePanel
};
