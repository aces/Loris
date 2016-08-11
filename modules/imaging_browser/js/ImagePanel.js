ImagePanelHeader = React.createClass({
    displayName: 'ImagePanelHeader',

    mixins: [React.addons.PureRenderMixin],
    render: function () {
        var QCStatusLabel;
        if (this.props.QCStatus == 'Pass') {
            QCStatusLabel = React.createElement(
                'span',
                { className: 'label label-success' },
                this.props.QCStatus
            );
        } else if (this.props.QCStatus == 'Fail') {
            QCStatusLabel = React.createElement(
                'span',
                { className: 'label label-danger' },
                this.props.QCStatus
            );
        }

        var arrow;
        if (this.props.Expanded) {
            arrow = React.createElement('span', { onClick: this.props.onToggleBody, className: 'pull-right clickable glyphicon arrow glyphicon-chevron-up' });
        } else {
            arrow = React.createElement('span', { onClick: this.props.onToggleBody, className: 'pull-right clickable glyphicon arrow glyphicon-chevron-down' });
        }
        var headerButton = React.createElement(
            'div',
            { className: 'pull-right' },
            React.createElement(
                'div',
                { className: 'btn-group views' },
                React.createElement(
                    'button',
                    {
                        type: 'button',
                        className: 'btn btn-default btn-xs dropdown-toggle',
                        onClick: this.props.onToggleHeaders,
                        'aria-expanded': this.props.HeadersExpanded ? true : false },
                    'Header Info'
                ),
                React.createElement('span', { className: 'caret' })
            )
        );
        return React.createElement(
            'div',
            { className: 'panel-heading' },
            React.createElement('input', { type: 'checkbox', 'data-file-id': this.props.FileID, className: 'mripanel user-success' }),
            React.createElement(
                'h3',
                { className: 'panel-title' },
                this.props.Filename,
                ' '
            ),
            QCStatusLabel,
            arrow,
            headerButton
        );
    }

});

ImagePanelHeadersTable = React.createClass({
    displayName: 'ImagePanelHeadersTable',

    componentDidMount: function () {
        $(this.getDOMNode()).DynamicTable();
    },
    render: function () {
        return React.createElement(
            'table',
            { className: 'table table-hover table-bordered header-info col-xs-12 dynamictable' },
            React.createElement(
                'tr',
                null,
                React.createElement(
                    'th',
                    { className: 'info col-xs-2' },
                    'Voxel Size'
                ),
                React.createElement(
                    'td',
                    { className: 'col-xs-6', colSpan: '3' },
                    this.props.HeaderInfo.XStep != '' ? 'X: ' + this.props.HeaderInfo.XStep + " mm " : ' ',
                    this.props.HeaderInfo.YStep != '' ? 'Y: ' + this.props.HeaderInfo.YStep + " mm " : ' ',
                    this.props.HeaderInfo.ZStep != '' ? 'Z: ' + this.props.HeaderInfo.ZStep + " mm " : ' '
                ),
                React.createElement(
                    'th',
                    { className: 'col-xs-2 info' },
                    'Output Type'
                ),
                React.createElement(
                    'td',
                    { className: 'col-xs-2' },
                    this.props.HeaderInfo.OutputType
                )
            ),
            React.createElement(
                'tr',
                null,
                React.createElement(
                    'th',
                    { className: 'col-xs-2 info' },
                    'Acquisition Date'
                ),
                React.createElement(
                    'td',
                    { className: 'col-xs-2' },
                    this.props.HeaderInfo.AcquisitionDate
                ),
                React.createElement(
                    'th',
                    { className: 'col-xs-2 info' },
                    'Space'
                ),
                React.createElement(
                    'td',
                    { className: 'col-xs-2' },
                    this.props.HeaderInfo.CoordinateSpace
                ),
                React.createElement(
                    'th',
                    { className: 'col-xs-2 info' },
                    'Inserted Date'
                ),
                React.createElement(
                    'td',
                    { className: 'col-xs-2' },
                    this.props.HeaderInfo.InsertedDate
                )
            ),
            React.createElement(
                'tr',
                null,
                React.createElement(
                    'th',
                    { className: 'col-xs-2 info' },
                    'Protocol'
                ),
                React.createElement(
                    'td',
                    { className: 'col-xs-2' },
                    this.props.HeaderInfo.AcquisitionProtocol
                ),
                React.createElement(
                    'th',
                    { className: 'col-xs-2 info' },
                    'Series Description'
                ),
                React.createElement(
                    'td',
                    { className: 'col-xs-2' },
                    this.props.HeaderInfo.SeriesDescription
                ),
                React.createElement(
                    'th',
                    { className: 'col-xs-2 info' },
                    'Series Number'
                ),
                React.createElement(
                    'td',
                    { className: 'col-xs-2' },
                    this.props.HeaderInfo.SeriesNumber
                )
            ),
            React.createElement(
                'tr',
                null,
                React.createElement(
                    'th',
                    { className: 'col-xs-2 info' },
                    'Echo Time'
                ),
                React.createElement(
                    'td',
                    { className: 'col-xs-2' },
                    this.props.HeaderInfo.EchoTime,
                    ' ms'
                ),
                React.createElement(
                    'th',
                    { className: 'col-xs-2 info' },
                    'Rep Time'
                ),
                React.createElement(
                    'td',
                    { className: 'col-xs-2' },
                    this.props.HeaderInfo.RepetitionTime,
                    ' ms'
                ),
                React.createElement(
                    'th',
                    { className: 'col-xs-2 info' },
                    'Slice Thick'
                ),
                React.createElement(
                    'td',
                    { className: 'col-xs-2' },
                    this.props.HeaderInfo.SliceThickness,
                    ' mm'
                )
            ),
            React.createElement(
                'tr',
                null,
                React.createElement(
                    'th',
                    { className: 'col-xs-2 info' },
                    'Number of volumes'
                ),
                React.createElement(
                    'td',
                    { className: 'col-xs-2' },
                    this.props.HeaderInfo.Time,
                    ' volumes'
                ),
                React.createElement(
                    'th',
                    { className: 'col-xs-2 info' },
                    'Pipeline'
                ),
                React.createElement(
                    'td',
                    { className: 'col-xs-2' },
                    this.props.HeaderInfo.Pipeline
                ),
                React.createElement(
                    'th',
                    { className: 'col-xs-2 info' },
                    'Algorithm'
                ),
                React.createElement(
                    'td',
                    { className: 'col-xs-2' },
                    this.props.HeaderInfo.Algorithm
                )
            ),
            React.createElement(
                'tr',
                null,
                React.createElement(
                    'th',
                    { className: 'col-xs-2 info' },
                    'Number of rejected directions'
                ),
                React.createElement(
                    'td',
                    { className: 'col-xs-2' },
                    this.props.HeaderInfo.TotalRejected
                ),
                React.createElement(
                    'th',
                    { className: 'col-xs-2 info' },
                    'Number of Interlace correlations'
                ),
                React.createElement(
                    'td',
                    { className: 'col-xs-2' },
                    this.props.HeaderInfo.InterlaceRejected
                ),
                React.createElement(
                    'th',
                    { className: 'col-xs-2 info' },
                    'Number of Gradient-wise correlations'
                ),
                React.createElement(
                    'td',
                    { className: 'col-xs-2' },
                    this.props.HeaderInfo.IntergradientRejected
                )
            ),
            React.createElement(
                'tr',
                null,
                React.createElement(
                    'th',
                    { className: 'col-xs-2 info' },
                    'Number of Slicewise correlations'
                ),
                React.createElement(
                    'td',
                    { className: 'col-xs-2' },
                    this.props.HeaderInfo.SlicewiseRejected
                ),
                React.createElement(
                    'td',
                    { className: 'col-xs-4', colSpan: '4' },
                    ' '
                )
            )
        );
    }
});
ImageQCDropdown = React.createClass({
    displayName: 'ImageQCDropdown',

    render: function () {
        var dropdown;
        if (this.props.editable) {
            var options = [];
            for (var key in this.props.options) {
                if (this.props.options.hasOwnProperty(key)) {
                    options.push(React.createElement(
                        'option',
                        { key: this.props.FormName + this.props.FileID + key, className: 'form-control input-sm option', value: key },
                        this.props.options[key]
                    ));
                }
            }
            dropdown = React.createElement(
                'select',
                { name: this.props.FormName + "[" + this.props.FileID + "]",
                    defaultValue: this.props.defaultValue,
                    className: 'form-control input-sm'
                },
                options
            );
        } else {
            dropdown = React.createElement(
                'div',
                { className: 'col-xs-12' },
                this.props.defaultValue
            );
        }
        return React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'label',
                null,
                this.props.Label
            ),
            dropdown
        );
    }
});
ImageQCStatic = React.createClass({
    displayName: 'ImageQCStatic',

    render: function () {
        var staticInfo;
            staticInfo = React.createElement(
                'div',
                { className: 'col-xs-12' },
                this.props.defaultValue
            );
        return React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'label',
                null,
                this.props.Label
            ),
            staticInfo
        );
    }
});

ImagePanelQCStatusSelector = React.createClass({
    displayName: 'ImagePanelQCStatusSelector',

    render: function () {
        var qcStatusLabel;
        if (this.props.HasQCPerm && this.props.FileNew) {
            qcStatusLabel = React.createElement(
                'span',
                null,
                'QC Status ',
                React.createElement(
                    'span',
                    { className: 'text-info' },
                    '( ',
                    React.createElement('span', { className: 'glyphicon glyphicon-star' }),
                    ' New )'
                )
            );
        } else {
            qcStatusLabel = "QC Status";
        }

        return React.createElement(ImageQCDropdown, {
            Label: qcStatusLabel,
            FormName: 'status',
            FileID: this.props.FileID,
            editable: this.props.HasQCPerm,
            defaultValue: this.props.QCStatus,
            options: { "": "", "Pass": "Pass", "Fail": "Fail" }
        });
    }
});
ImagePanelQCSelectedSelector = React.createClass({
    displayName: 'ImagePanelQCSelectedSelector',

    render: function () {
        return React.createElement(ImageQCDropdown, {
            Label: 'Selected',
            FormName: 'selectedvol',
            FileID: this.props.FileID,
            editable: this.props.HasQCPerm,
            options: this.props.SelectedOptions,
            defaultValue: this.props.Selected
        });
    }
});
ImagePanelQCCaveatSelector = React.createClass({
    displayName: 'ImagePanelQCCaveatSelector',

    render: function () {
        return React.createElement(ImageQCDropdown, {
            Label: 'Caveat',
            FormName: 'caveat',
            FileID: this.props.FileID,
            editable: this.props.HasQCPerm,
            options: {
                "": "",
                "1": "True",
                "0": "False"
            },
            defaultValue: this.props.Caveat
        });
    }
});
ImagePanelQCSNRValue = React.createClass({
    displayName: 'ImagePanelQCSNRValue',

    render: function () {
        return React.createElement(ImageQCStatic, {
            Label: 'SNR',
            FormName: 'snr',
            FileID: this.props.FileID,
            defaultValue: this.props.SNR
        });
    }
});
ImagePanelQCPanel = React.createClass({
    displayName: 'ImagePanelQCPanel',

    mixins: [React.addons.PureRenderMixin],
    render: function () {
        return React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(ImagePanelQCStatusSelector, {
                FileID: this.props.FileID,
                HasQCPerm: this.props.HasQCPerm,
                QCStatus: this.props.QCStatus,
                FileNew: this.props.FileNew
            }),
            React.createElement(ImagePanelQCSelectedSelector, {
                FileID: this.props.FileID,
                HasQCPerm: this.props.HasQCPerm,
                SelectedOptions: this.props.SelectedOptions,
                Selected: this.props.Selected
            }),
            React.createElement(ImagePanelQCCaveatSelector, {
                FileID: this.props.FileID,
                HasQCPerm: this.props.HasQCPerm,
                Caveat: this.props.Caveat
            }),
            React.createElement(ImagePanelQCSNRValue, {
                FileID: this.props.FileID,
                SNR: this.props.SNR
            })
        );
    }
});

DownloadButton = React.createClass({
    displayName: 'DownloadButton',

    render: function () {
        if (!this.props.FileName || this.props.FileName == '') {
            return React.createElement('span', null);
        };
        var style = {
            margin: 6
        };
        return React.createElement(
            'a',
            { href: this.props.BaseURL + "/mri/jiv/get_file.php?file=" + this.props.FileName, className: 'btn btn-default', style: style },
            React.createElement('span', { className: 'glyphicon glyphicon-download-alt' }),
            React.createElement(
                'span',
                { className: 'hidden-xs' },
                this.props.Label
            )
        );
    }
});

ImageQCCommentsButton = React.createClass({
    displayName: 'ImageQCCommentsButton',

    openWindowHandler: function (e) {
        e.preventDefault();
        window.open(this.props.BaseURL + "/feedback_mri_popup.php?fileID=" + this.props.FileID, "feedback_mri", "width=500,height=800,toolbar=no,location=no,status=yes,scrollbars=yes,resizable=yes");
    },
    render: function () {
        if (!this.props.FileID || this.props.FileID == '') {
            return React.createElement('span', null);
        };
        return React.createElement(
            'a',
            { className: 'btn btn-default',
                href: '#noID',
                onClick: this.openWindowHandler
            },
            React.createElement(
                'span',
                { className: 'text-default' },
                React.createElement('span', { className: 'glyphicon glyphicon-pencil' }),
                React.createElement(
                    'span',
                    { className: 'hidden-xs' },
                    'QC Comments'
                )
            )
        );
    }
});

LongitudinalViewButton = React.createClass({
    displayName: 'LongitudinalViewButton',

    openWindowHandler: function (e) {
        e.preventDefault();
        window.open(this.props.BaseURL + "/brainbrowser/?minc_id=[" + this.props.OtherTimepoints + "]", "BrainBrowser Volume Viewer", "location = 0,width = auto, height = auto, scrollbars=yes");
    },
    render: function () {
        if (!this.props.FileID || this.props.FileID == '') {
            return React.createElement('span', null);
        };
        return React.createElement(
            'a',
            { className: 'btn btn-default',
                href: '#noID',
                onClick: this.openWindowHandler
            },
            React.createElement(
                'span',
                { className: 'text-default' },
                React.createElement('span', { className: 'glyphicon glyphicon-eye-open' }),
                React.createElement(
                    'span',
                    { className: 'hidden-xs' },
                    'Longitudinal View'
                )
            )
        );
    }
});

ImageDownloadButtons = React.createClass({
    displayName: 'ImageDownloadButtons',

    render: function () {
        return React.createElement(
            'div',
            { className: 'row mri-second-row-panel col-xs-12' },
            React.createElement(ImageQCCommentsButton, { FileID: this.props.FileID,
                BaseURL: this.props.BaseURL
            }),
            React.createElement(DownloadButton, { FileName: this.props.Fullname,
                Label: 'Download Minc',
                BaseURL: this.props.BaseURL
            }),
            React.createElement(DownloadButton, { FileName: this.props.XMLProtocol,
                BaseURL: this.props.BaseURL,
                Label: 'Download XML Protocol'
            }),
            React.createElement(DownloadButton, { FileName: this.props.XMLReport,
                BaseURL: this.props.BaseURL,
                Label: 'Download XML Report'
            }),
            React.createElement(DownloadButton, { FileName: this.props.NrrdFile,
                BaseURL: this.props.BaseURL,
                Label: 'Download NRRD'
            }),
            React.createElement(LongitudinalViewButton, { FileID: this.props.FileID,
                BaseURL: this.props.BaseURL,
                OtherTimepoints: this.props.OtherTimepoints
            })
        );
    }
});
ImagePanelBody = React.createClass({
    displayName: 'ImagePanelBody',

    mixins: [React.addons.PureRenderMixin],
    openWindowHandler: function (e) {
        e.preventDefault();
        window.open(this.props.BaseURL + "/brainbrowser/?minc_id=[" + this.props.FileID + "]", "BrainBrowser Volume Viewer", "location = 0,width = auto, height = auto, scrollbars=yes");
    },
    render: function () {
        return React.createElement(
            'div',
            { className: 'panel-body' },
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-xs-9 imaging_browser_pic' },
                    React.createElement(
                        'a',
                        { href: '#noID', onClick: this.openWindowHandler },
                        React.createElement('img', { className: 'img-checkpic img-responsive', src: this.props.Checkpic })
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'col-xs-3 mri-right-panel' },
                    React.createElement(ImagePanelQCPanel, {
                        FileID: this.props.FileID,
                        FileNew: this.props.FileNew,
                        HasQCPerm: this.props.HasQCPerm,
                        QCStatus: this.props.QCStatus,
                        Caveat: this.props.Caveat,
                        SelectedOptions: this.props.SelectedOptions,
                        Selected: this.props.Selected,
                        SNR: this.props.SNR
                    })
                )
            ),
            React.createElement(ImageDownloadButtons, {
                BaseURL: this.props.BaseURL,
                FileID: this.props.FileID,
                Fullname: this.props.Fullname,
                XMLProtocol: this.props.XMLProtocol,
                XMLReport: this.props.XMLReport,
                NrrdFile: this.props.NrrdFile,
                OtherTimepoints: this.props.OtherTimepoints
            }),
            this.props.HeadersExpanded ? React.createElement(ImagePanelHeadersTable, { HeaderInfo: this.props.HeaderInfo }) : ''
        );
    }
});

ImagePanel = React.createClass({
    displayName: 'ImagePanel',

    getInitialState: function () {
        return {
            'BodyCollapsed': false,
            'HeadersCollapsed': true
        };
    },
    toggleBody: function (e) {
        this.setState({
            'BodyCollapsed': !this.state.BodyCollapsed
        });
    },
    toggleHeaders: function (e) {
        this.setState({
            'HeadersCollapsed': !this.state.HeadersCollapsed
        });
    },
    render: function () {
        return React.createElement(
            'div',
            { className: 'col-xs-12 col-md-6' },
            React.createElement(
                'div',
                { className: 'panel panel-default' },
                React.createElement(ImagePanelHeader, {
                    FileID: this.props.FileID,
                    Filename: this.props.Filename,
                    QCStatus: this.props.QCStatus,
                    onToggleBody: this.toggleBody,
                    onToggleHeaders: this.toggleHeaders,
                    Expanded: !this.state.BodyCollapsed,
                    HeadersExpanded: !this.state.HeadersCollapsed
                }),
                this.state.BodyCollapsed ? '' : React.createElement(ImagePanelBody, {
                    BaseURL: this.props.BaseURL,

                    FileID: this.props.FileID,
                    Filename: this.props.Filename,
                    Checkpic: this.props.Checkpic,
                    HeadersExpanded: !this.state.HeadersCollapsed,

                    HeaderInfo: this.props.HeaderInfo,

                    FileNew: this.props.FileNew,
                    HasQCPerm: this.props.HasQCPerm,
                    QCStatus: this.props.QCStatus,
                    Caveat: this.props.Caveat,
                    SelectedOptions: this.props.SelectedOptions,
                    Selected: this.props.Selected,
                    SNR: this.props.SNR,

                    Fullname: this.props.Fullname,
                    XMLProtocol: this.props.XMLProtocol,
                    XMLReport: this.props.XMLReport,
                    NrrdFile: this.props.NrrdFile,
                    OtherTimepoints: this.props.OtherTimepoints
                })
            )
        );
    }
});
RImagePanel = React.createFactory(ImagePanel);
