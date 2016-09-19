GenomicFileUploadModal = React.createClass({
    displayName: 'GenomicFileUploadModal',


    propTypes: {
        baseURL: React.PropTypes.string.isRequired
    },

    getInitialState: function () {
        return {
            readyForUpload: false,
            submited: false,
            uploadSummary: {}
        };
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return nextState.readyForUpload !== this.state.readyForUpload || nextState.submited !== this.state.submited || nextProps.id !== this.props.id;
    },

    validateForm: function (requiredInputs) {
        // this is always returning true... for now
        requiredInputs = requiredInputs || [];
        this.setState({ readyForUpload: requiredInputs.reduce(function (previousValue, currentValue, currentIndex, array) {
                var input = document.getElementById(currentValue);
                return previousValue;
            }, true) });
    },

    reloadPage: function () {
        $('#modalContainer').modal('hide');
        $('#showdata').click();
    },

    handleUploadSubmit: function (event) {
        event.preventDefault();
        var self = this;
        var formData = new FormData(document.getElementById('uploadForm'));

        var xhr = new XMLHttpRequest();
        xhr.previous_text = '';
        xhr.onerror = function () {
            console.error("[XHR] Fatal Error.");
        };
        xhr.onreadystatechange = function () {
            try {
                switch (xhr.readyState) {
                    case 0:
                        console.log('0: request not initialized');
                        break;
                    case 1:
                        console.log('1: server connection established');
                        break;
                    case 2:
                        console.log('2: request received');
                        break;
                    case 3:
                        console.log('3: processing request');

                        var new_response = xhr.responseText.substring(xhr.previous_text.length);
                        var result = JSON.parse(new_response);
                        console.log(result);

                        //document.getElementById("uploadStatus").innerHTML = result.message + '';
                        //document.getElementById('progressBar').style.width = result.progress + "%";
                        //if (result.error != undefined) {
                        //    document.getElementById('progressBar').style.backgroundColor = 'red';
                        //}

                        xhr.previous_text = xhr.responseText;
                        break;
                    case 4:
                        console.log('4: request finished and response is ready');
                        self.setState({ submited: true });
                        break;
                    default:
                        console.log('?');
                        break;
                }
            } catch (e) {
                console.error("[XHR STATECHANGE] Exception: " + e);
            }
        };
        var url = this.props.baseURL + "/genomic_browser/ajax/genomic_file_upload.php";
        xhr.open("POST", url, true);
        xhr.send(formData);
    },

    render: function () {
        var footerButtons = [];

        if (this.state.submited) {
            footerButtons.push(React.createElement(
                'button',
                { className: 'btn btn-default', onClick: this.reloadPage, 'data-dismiss': 'modal' },
                'Ok'
            ));
        } else {

            if (this.state.readyForUpload) {
                footerButtons.push(React.createElement(
                    'button',
                    { className: 'btn btn-primary', onClick: this.handleUploadSubmit, role: 'button', 'aria-disabled': 'false' },
                    'Upload'
                ));
            }

            footerButtons.push(React.createElement(
                'button',
                { className: 'btn btn-default', id: 'cancelButton', role: 'reset', type: 'reset', 'data-dismiss': 'modal' },
                'Cancel'
            ));
        }
        return React.createElement(
            'div',
            { className: 'modal fade', id: 'fileUploadModal', tabindex: '-1', role: 'dialog', 'aria-labelledby': 'myModalLabel', 'aria-hidden': 'true' },
            React.createElement(
                'div',
                { className: 'modal-dialog' },
                React.createElement(
                    'div',
                    { className: 'modal-content' },
                    React.createElement(
                        'div',
                        { className: 'modal-header' },
                        React.createElement(
                            'button',
                            { type: 'button', className: 'close', 'data-dismiss': 'modal' },
                            React.createElement(
                                'span',
                                { 'aria-hidden': 'true' },
                                '×'
                            ),
                            React.createElement(
                                'span',
                                { className: 'sr-only' },
                                'Close'
                            )
                        ),
                        React.createElement(
                            'h3',
                            { className: 'modal-title', id: 'myModalLabel' },
                            'Upload File'
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'modal-body' },
                        React.createElement(UploadForm, { baseURL: this.props.baseURL, validate: this.validateForm })
                    ),
                    React.createElement(
                        'div',
                        { className: 'modal-footer' },
                        footerButtons
                    )
                )
            )
        );
    }
});

RGenomicFileUploadModal = React.createFactory(GenomicFileUploadModal);

UploadForm = React.createClass({
    displayName: 'UploadForm',


    getInitialState: function () {
        return {
            baseURL: '',
            fileType: "",
            useColumnHeaders: true };
    },

    getDefaultProps: function () {
        return {
            validate: null
        };
    },

    handleFileTypeChange: function (event) {
        event.preventDefault();
        this.setState({ 'fileType': event.target.value });
    },

    handleCheckboxChange: function (event) {
        if (event.target.name == 'pscidColumn') {
            this.setState({ 'useColumnHeaders': !this.state.useColumnHeaders });
        }
    },

    componentWillUpdate: function (prevProps, prevState) {
        this.props.validate();
    },

    render: function () {
        var instructions = [];
        var inputs = [];

        inputs.push(React.createElement(FileTypeSelect, { baseURL: this.props.baseURL, multiple: false, onFileTypeChange: this.handleFileTypeChange, name: 'fileType', label: 'File type:' }));

        switch (this.state.fileType) {
            case 'Methylation beta-values':
                inputs.push(React.createElement(FileInput, { name: 'fileData', label: 'File :' }));
                inputs.push(React.createElement(TextAreaInput, { name: 'description', label: 'Description :' }));
                if (!this.state.useColumnHeaders) {
                    inputs.push(React.createElement(FileInput, { name: 'fileMapping', label: 'Mapping :' }));
                }
                inputs.push(React.createElement(CheckboxInput, { handleChange: this.handleCheckboxChange, checked: this.state.useColumnHeaders, name: 'pscidColumn' }));
                break;
            case 'Other':
                inputs.push(React.createElement(FileInput, { name: 'fileData', label: 'File :' }));
                inputs.push(React.createElement(TextAreaInput, { name: 'description', label: 'Description :' }));
                break;
        }

        return React.createElement(
            'form',
            { name: 'uploadForm', id: 'uploadForm', enctype: 'multipart/form-data', method: 'POST' },
            React.createElement(
                'div',
                { className: 'row' },
                instructions,
                inputs
            )
        );
    }
});

FileTypeSelect = React.createClass({
    displayName: 'FileTypeSelect',

    getDefaultProps: function () {
        return {
            baseURL: '',
            onFileTypeChange: null,
            getFileType: null
        };
    },

    getInitialState: function () {
        return {
            availableFileType: []
        };
    },

    componentDidMount: function () {
        this.getGenomicFileType();
    },

    getGenomicFileType: function () {
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            try {
                switch (xhr.readyState) {
                    case 0:
                        console.log('0: request not initialized');
                        break;
                    case 1:
                        console.log('1: server connection established');
                        break;
                    case 2:
                        console.log('2: request received');
                        break;
                    case 3:
                        console.log('3: processing request');
                        var result = JSON.parse(xhr.responseText);
                        console.log(result);
                        xhr.previous_text = xhr.responseText;
                        break;
                    case 4:
                        console.log('4: request finished and response is ready');
                        var fileType = [{ genomic_file_type: '' }].concat(JSON.parse(xhr.responseText));
                        self.setState({ availableFileType: fileType });
                        break;
                    default:
                        console.log('?');
                        break;
                }
            } catch (e) {
                console.error("Exception: " + e);
            }
        };
        var url = this.props.baseURL + "/AjaxHelper.php?Module=genomic_browser&script=get_genomic_file_type.php";
        xhr.open("POST", url, true);
        xhr.send();
    },

    render: function () {

        var options = this.state.availableFileType.map(function (e) {
            return React.createElement(
                'option',
                { value: e.genomic_file_type },
                e.genomic_file_type
            );
        });

        return React.createElement(
            'div',
            { className: 'col-xs-12 form-group' },
            React.createElement(
                'label',
                { 'for': this.props.name, className: 'col-xs-3' },
                this.props.label,
                React.createElement(
                    'font',
                    { color: 'red' },
                    React.createElement(
                        'sup',
                        null,
                        ' *'
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'col-xs-9' },
                React.createElement(
                    'select',
                    { name: this.props.name, id: this.props.name, className: 'form-fields form-control input-sm', onChange: this.props.onFileTypeChange },
                    options
                )
            )
        );
    }
});

FileInput = React.createClass({
    displayName: 'FileInput',


    propTypes: {
        name: React.PropTypes.string,
        label: React.PropTypes.string
    },

    render: function () {

        return React.createElement(
            'div',
            { className: 'col-xs-12 form-group' },
            React.createElement(
                'label',
                { className: 'col-xs-3', 'for': this.props.name },
                this.props.label
            ),
            React.createElement(
                'div',
                { className: 'col-xs-9' },
                React.createElement('input', { type: 'file', name: this.props.name, id: this.props.name, onChange: this.handleChange, className: 'fileUpload' })
            )
        );
    }
});

TextAreaInput = React.createClass({
    displayName: 'TextAreaInput',


    propTypes: {
        name: React.PropTypes.string,
        label: React.PropTypes.string
    },

    render: function () {
        return React.createElement(
            'div',
            { className: 'col-xs-12 form-group' },
            React.createElement(
                'label',
                { className: 'col-xs-3', 'for': this.props.name },
                this.props.label
            ),
            React.createElement(
                'div',
                { className: 'col-xs-9' },
                React.createElement('textarea', { cols: '20', rows: '3', name: this.props.name, onChange: this.handleChange, id: this.props.name, style: { 'border': '2px inset' }, className: 'ui-corner-all form-fields form-control input-sm' })
            )
        );
    }
});

CheckboxInput = React.createClass({
    displayName: 'CheckboxInput',

    propTypes: {
        name: React.PropTypes.string
    },
    getInitialState: function () {
        return {
            checked: this.props.checked || false
        };
    },
    render: function () {
        // Add onClick={this.props.handleChange}  and checked={this.state.checked} when we support Mapping files
        return React.createElement(
            'div',
            { className: 'form-group col-sm-12' },
            React.createElement('label', { className: 'col-xs-3' }),
            React.createElement(
                'div',
                { className: 'col-xs-9' },
                React.createElement(
                    'input',
                    { className: 'user-success', name: this.props.name, id: this.props.name, type: 'checkbox', checked: 'true', style: { 'margin-right': '1em' } },
                    'Use PSCID in column headers',
                    this.props.label
                )
            )
        );
    }
});
