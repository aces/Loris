ImagePanelHeader = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    render: function() {
        var QCStatusLabel;
        if(this.props.QCStatus == 'Pass') {
            QCStatusLabel = <span className="label label-success">{this.props.QCStatus}</span>;

        } else if(this.props.QCStatus == 'Fail') {
            QCStatusLabel = <span className="label label-danger">{this.props.QCStatus}</span>;
        }

        var arrow;
        if(this.props.Expanded) {
            arrow = <span onClick={this.props.onToggleBody} className="pull-right clickable glyphicon arrow glyphicon-chevron-up"></span>;
        }    else {
            arrow = <span onClick={this.props.onToggleBody} className="pull-right clickable glyphicon arrow glyphicon-chevron-down"></span>;
        }
        var headerButton = (
            <div className="pull-right">
                <div className="btn-group views">
                    <button
                        type="button"
                        className="btn btn-default btn-xs dropdown-toggle"
                        onClick={this.props.onToggleHeaders}
                        aria-expanded={this.props.HeadersExpanded ? true : false}>
                        Header Info
                        </button>
                    <span className="caret"></span>
                </div>
            </div>
            );
        return (

            <div className="panel-heading">
                <input type="checkbox" data-file-id={this.props.FileID} className="mripanel user-success" />
                <h3 className="panel-title">{this.props.Filename} </h3>
                {QCStatusLabel}
                {arrow}
                {headerButton}
            </div>
        );
    }

});

ImagePanelHeadersTable = React.createClass({
    componentDidMount: function() {
        $(this.getDOMNode()).DynamicTable();
    },
    render: function() {
        return (
            <table className="table table-hover table-bordered header-info col-xs-12 dynamictable">
                <tr>
                    <th className="info col-xs-2">Voxel Size</th>
                    <td className="col-xs-6" colSpan="3">
                        {this.props.HeaderInfo.XStep != '' ? 'X: ' + this.props.HeaderInfo.XStep + " mm ": ' '}
                        {this.props.HeaderInfo.YStep != '' ? 'Y: ' + this.props.HeaderInfo.YStep + " mm ": ' '}
                        {this.props.HeaderInfo.ZStep != '' ? 'Z: ' + this.props.HeaderInfo.ZStep + " mm ": ' '}
                    </td>
                    <th className="col-xs-2 info">Output Type</th>
                    <td className="col-xs-2">{this.props.HeaderInfo.OutputType}</td>
                </tr>
                <tr>
                    <th className="col-xs-2 info">Acquisition Date</th>
                    <td className="col-xs-2">{this.props.HeaderInfo.AcquisitionDate}</td>

                    <th className="col-xs-2 info">Space</th>
                    <td className="col-xs-2">{this.props.HeaderInfo.CoordinateSpace}</td>

                    <th className="col-xs-2 info">Inserted Date</th>
                    <td className="col-xs-2">{this.props.HeaderInfo.InsertedDate}</td>
                </tr>
                <tr>
                    <th className="col-xs-2 info">Protocol</th>
                    <td className="col-xs-2">{this.props.HeaderInfo.AcquisitionProtocol}</td>

                    <th className="col-xs-2 info">Series Description</th>
                    <td className="col-xs-2">{this.props.HeaderInfo.SeriesDescription}</td>

                    <th className="col-xs-2 info">Series Number</th>
                    <td className="col-xs-2">{this.props.HeaderInfo.SeriesNumber}</td>
                </tr>
                <tr>
                    <th className="col-xs-2 info">Echo Time</th>
                    <td className="col-xs-2">{this.props.HeaderInfo.EchoTime} ms</td>

                    <th className="col-xs-2 info">Rep Time</th>
                    <td className="col-xs-2">{this.props.HeaderInfo.RepetitionTime} ms</td>

                    <th className="col-xs-2 info">Slice Thick</th>
                    <td className="col-xs-2">{this.props.HeaderInfo.SliceThickness} mm</td>
                </tr>
                <tr>
                    <th className="col-xs-2 info">Number of volumes</th>
                    <td className="col-xs-2">{this.props.HeaderInfo.NumVolumes} volumes</td>

                    <th className="col-xs-2 info">Pipeline</th>
                    <td className="col-xs-2">{this.props.HeaderInfo.Pipeline}</td>

                    <th className="col-xs-2 info">Algorithm</th>
                    <td className="col-xs-2">{this.props.HeaderInfo.Algorithm}</td>
                </tr>
                <tr>
                    <th className="col-xs-2 info">Number of rejected directions</th>
                    <td className="col-xs-2">{this.props.HeaderInfo.TotalRejected}</td>

                    <th className="col-xs-2 info">Number of Interlace correlations</th>
                    <td className="col-xs-2">{this.props.HeaderInfo.InterlaceRejected}</td>

                    <th className="col-xs-2 info">Number of Gradient-wise correlations</th>
                    <td className="col-xs-2">{this.props.HeaderInfo.IntergradientRejected}</td>
                </tr>
                <tr>
                    <th className="col-xs-2 info">Number of Slicewise correlations</th>
                    <td className="col-xs-2">{this.props.HeaderInfo.SlicewiseRejected}</td>
                    <td className="col-xs-4" colSpan="4">&nbsp;</td>
                </tr>

            </table>
        );
    }
});
ImageQCDropdown = React.createClass({
    render: function() {
        var dropdown;
        if(this.props.editable) {
            var options = [];
            for (var key in this.props.options) {
                if(this.props.options.hasOwnProperty(key)) {
                    options.push(<option key={this.props.FormName + this.props.FileID + key} className="form-control input-sm option" value={key}>{this.props.options[key]}</option>);
                }
            }
            dropdown = (
                <select name={this.props.FormName + "[" + this.props.FileID + "]"}
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
                <label>{this.props.Label}</label>
                {dropdown}
            </div>
        );
    }
});
ImageQCStatic = React.createClass({
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

ImagePanelQCStatusSelector = React.createClass({
    render: function() {
        var qcStatusLabel;
        if(this.props.HasQCPerm && this.props.FileNew) {
            qcStatusLabel = <span>QC Status <span className="text-info">( <span className="glyphicon glyphicon-star"></span> New )</span></span>
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
                    options={ { "" : "", "Pass" : "Pass", "Fail" : "Fail" } }
            />
        );
    }
});
ImagePanelQCSelectedSelector = React.createClass({
    render: function () {
        return (
            <ImageQCDropdown
                Label="Selected"
                FormName="selectedvol"
                FileID={this.props.FileID}
                editable={this.props.HasQCPerm}
                options={this.props.SelectedOptions}
                defaultValue={this.props.Selected}
            />
        );
    }
});
ImagePanelQCCaveatSelector = React.createClass({
    render: function () {
        return (
            <ImageQCDropdown
                Label="Caveat"
                FormName="caveat"
                FileID={this.props.FileID}
                editable={this.props.HasQCPerm}
                options={
                    {
                        "" : "",
                        "1" : "True",
                        "0" : "False"
                    }
                } 
                defaultValue={this.props.Caveat}
            />
        );
    }
});
ImagePanelQCSNRValue = React.createClass({
    render: function () {
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
ImagePanelQCPanel = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    render: function() {
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
                    SelectedOptions={this.props.SelectedOptions}
                    Selected={this.props.Selected}
                />
                <ImagePanelQCCaveatSelector
                    FileID={this.props.FileID}
                    HasQCPerm={this.props.HasQCPerm}
                    Caveat={this.props.Caveat}
                />
                <ImagePanelQCSNRValue
                    FileID={this.props.FileID}
                    SNR={this.props.SNR}
                />
            </div>
        );
    }
});

DownloadButton = React.createClass({
    render: function() {
        if (!this.props.FileName || this.props.FileName == '') {
            return <span />;
        };
        var style = {
            margin: 6
        }
        return (
            <a href={this.props.BaseURL + "/mri/jiv/get_file.php?file=" + this.props.FileName} className="btn btn-default" style={style}>
                <span className="glyphicon glyphicon-download-alt"></span>
                <span className="hidden-xs">{this.props.Label}</span>
            </a>
        );
    }
});

ImageQCCommentsButton = React.createClass({
    openWindowHandler: function(e) {
        e.preventDefault();
        window.open(
            this.props.BaseURL + "/feedback_mri_popup.php?fileID=" + this.props.FileID,
            "feedback_mri",
            "width=500,height=800,toolbar=no,location=no,status=yes,scrollbars=yes,resizable=yes"
        );
    },
    render: function() {
        if (!this.props.FileID || this.props.FileID == '') {
            return <span />;
        };
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

LongitudinalViewButton = React.createClass({
    openWindowHandler: function(e) {
        e.preventDefault();
        window.open(
            this.props.BaseURL + "/brainbrowser/?minc_id=[" + this.props.OtherTimepoints + "]",
            "BrainBrowser Volume Viewer",
            "location = 0,width = auto, height = auto, scrollbars=yes"
        );
    },
    render: function() {
        if (!this.props.FileID || this.props.FileID == '') {
            return <span />;
        };
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

ImageDownloadButtons = React.createClass({
    render: function() {
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
});
ImagePanelBody = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    openWindowHandler: function (e) {
        e.preventDefault();
        window.open(this.props.BaseURL + "/brainbrowser/?minc_id=[" + this.props.FileID + "]", "BrainBrowser Volume Viewer", "location = 0,width = auto, height = auto, scrollbars=yes");
    },
    render: function() {
        return (
                <div className="panel-body">
                    <div className="row">
                        <div className="col-xs-9 imaging_browser_pic">
                            <a href="#noID" onClick={this.openWindowHandler}>
                                <img className="img-checkpic img-responsive" src={this.props.Checkpic} />
                            </a>
                        </div>
                        <div className="col-xs-3 mri-right-panel">
                            <ImagePanelQCPanel
                                FileID={this.props.FileID}
                                FileNew={this.props.FileNew}
                                HasQCPerm={this.props.HasQCPerm}
                                QCStatus={this.props.QCStatus}
                                Caveat={this.props.Caveat}
                                SelectedOptions={this.props.SelectedOptions}
                                Selected={this.props.Selected}
                                SNR={this.props.SNR}
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
                    {this.props.HeadersExpanded ? <ImagePanelHeadersTable HeaderInfo={this.props.HeaderInfo} /> : ''}
                </div>
        );
    }
});

ImagePanel = React.createClass({
    getInitialState: function() {
        return {
            'BodyCollapsed' : false,
            'HeadersCollapsed' : true
        }
    },
    toggleBody: function(e) {
        this.setState({
            'BodyCollapsed' : !this.state.BodyCollapsed
        });
    },
    toggleHeaders: function(e) {
        this.setState({
            'HeadersCollapsed' : !this.state.HeadersCollapsed
        });
    },
    render: function() {
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
                        SelectedOptions={this.props.SelectedOptions}
                        Selected={this.props.Selected}
                        SNR={this.props.SNR}

                        Fullname={this.props.Fullname}
                        XMLProtocol={this.props.XMLProtocol}
                        XMLReport={this.props.XMLReport}
                        NrrdFile={this.props.NrrdFile}
                        OtherTimepoints={this.props.OtherTimepoints}
                    /> }
                </div>
            </div>
        );
    }
});
RImagePanel = React.createFactory(ImagePanel);

