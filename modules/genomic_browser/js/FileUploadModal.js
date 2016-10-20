'use strict';

/* exported  GenomicFileUploadModal, RGenomicFileUploadModal, UploadForm,
FileTypeSelect, FileInput, TextAreaInput, CheckboxInput, ProgressBar
*/

var GenomicFileUploadModal = React.createClass({
  displayName: 'GenomicFileUploadModal',


  propTypes: {
    baseURL: React.PropTypes.string.isRequired
  },

  getInitialState: function getInitialState() {
    return {
      readyForUpload: false,
      submited: false,
      uploadSummary: {}
    };
  },

  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    return nextState.readyForUpload !== this.state.readyForUpload || nextState.submited !== this.state.submited || nextProps.id !== this.props.id;
  },

  validateForm: function validateForm(requiredInputs) {
    // this is always returning true... for now
    requiredInputs = requiredInputs || [];
    this.setState({
      readyForUpload: requiredInputs.reduce(function (previousValue, currentValue, currentIndex, array) {
        return previousValue;
      }, true)
    });
  },

  reloadPage: function reloadPage() {
    $('#modalContainer').modal('hide');
    $('#showdata').click();
  },

  handleUploadSubmit: function handleUploadSubmit(event) {
    event.preventDefault();
    var self = this;
    var formData = new FormData(document.getElementById('uploadForm'));

    var xhr = new XMLHttpRequest();
    xhr.previousText = '';
    xhr.onerror = function () {
      console.error("[XHR] Fatal Error.");
    };
    xhr.onreadystatechange = function () {
      var bar = document.getElementById("progressBar");
      try {
        switch (xhr.readyState) {
          case 0:
            break;
          case 1:
            break;
          case 2:
            break;
          case 3:

            var newResponse = xhr.responseText.substring(xhr.previousText.length);
            var result = JSON.parse(newResponse);
            bar.innerHTML = String(result.message);
            bar.style.width = result.progress + "%";
            if (result.error !== undefined) {
              bar.className = 'progress-bar progress-bar-danger';
            }

            xhr.previousText = xhr.responseText;
            break;
          case 4:
            self.setState({ submited: true });
            break;
          default:
            break;
        }
      } catch (e) {
        console.error("[XHR STATECHANGE] Exception: " + e);
        bar.innerHTML = 'An error occured';
        bar.className = 'progress-bcar progress-bar-danger';
        bar.style.width = "100%";
      }
    };
    var url = this.props.baseURL + "/genomic_browser/ajax/genomic_file_upload.php";
    xhr.open("POST", url, true);
    xhr.send(formData);
  },

  render: function render() {
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
                '\xD7'
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

var RGenomicFileUploadModal = React.createFactory(GenomicFileUploadModal);

var UploadForm = React.createClass({
  displayName: 'UploadForm',


  getInitialState: function getInitialState() {
    return {
      baseURL: '',
      fileType: "",
      useColumnHeaders: true // Change this to false when we are ready to use Mapping files
    };
  },

  getDefaultProps: function getDefaultProps() {
    return {
      validate: null
    };
  },

  handleFileTypeChange: function handleFileTypeChange(event) {
    event.preventDefault();
    this.setState({ fileType: event.target.value });
  },

  handleCheckboxChange: function handleCheckboxChange(event) {
    if (event.target.name === 'pscidColumn') {
      this.setState({ useColumnHeaders: !this.state.useColumnHeaders });
    }
  },

  componentWillUpdate: function componentWillUpdate(prevProps, prevState) {
    this.props.validate();
  },

  render: function render() {
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
        inputs.push(React.createElement(ProgressBar, { name: 'progressbar', label: 'Progress :' }));
        break;
      case 'Other':
        inputs.push(React.createElement(FileInput, { name: 'fileData', label: 'File :' }));
        inputs.push(React.createElement(TextAreaInput, { name: 'description', label: 'Description :' }));
        inputs.push(React.createElement(ProgressBar, { name: 'progressbar', label: 'Progress :' }));
        break;
      default:
      // noop
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

var FileTypeSelect = React.createClass({
  displayName: 'FileTypeSelect',

  getDefaultProps: function getDefaultProps() {
    return {
      baseURL: '',
      onFileTypeChange: null,
      getFileType: null
    };
  },

  getInitialState: function getInitialState() {
    return {
      availableFileType: []
    };
  },

  componentDidMount: function componentDidMount() {
    this.getGenomicFileType();
  },

  getGenomicFileType: function getGenomicFileType() {
    var self = this;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      try {
        switch (xhr.readyState) {
          case 0:
            break;
          case 1:
            break;
          case 2:
            break;
          case 3:
            var result = JSON.parse(xhr.responseText);
            xhr.previousText = xhr.responseText;
            break;
          case 4:
            var fileType = [{ genomicFileType: '' }].concat(JSON.parse(xhr.responseText));
            self.setState({ availableFileType: fileType });
            break;
          default:
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

  render: function render() {
    var options = this.state.availableFileType.map(function (e) {
      return React.createElement(
        'option',
        { value: e.genomicFileType },
        e.genomicFileType
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

var FileInput = React.createClass({
  displayName: 'FileInput',


  propTypes: {
    name: React.PropTypes.string,
    label: React.PropTypes.string
  },

  render: function render() {
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

var TextAreaInput = React.createClass({
  displayName: 'TextAreaInput',


  propTypes: {
    name: React.PropTypes.string,
    label: React.PropTypes.string
  },

  render: function render() {
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
        React.createElement('textarea', { cols: '20', rows: '3', name: this.props.name, onChange: this.handleChange, id: this.props.name, style: { border: '2px inset' }, className: 'ui-corner-all form-fields form-control input-sm' })
      )
    );
  }
});

var CheckboxInput = React.createClass({
  displayName: 'CheckboxInput',

  propTypes: {
    name: React.PropTypes.string
  },
  getInitialState: function getInitialState() {
    return {
      checked: this.props.checked || false
    };
  },
  render: function render() {
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

var ProgressBar = React.createClass({
  displayName: 'ProgressBar',


  propTypes: {
    name: React.PropTypes.string,
    label: React.PropTypes.string
  },

  render: function render() {
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
        React.createElement(
          'div',
          { className: 'progress', style: { height: "20px" } },
          React.createElement('div', { className: 'progress-bar progress-bar-success', id: 'progressBar', role: 'progressbar', 'aria-valuenow': '0', 'aria-valuemin': '0', 'aria-valuemax': '100' })
        )
      )
    );
  }
});