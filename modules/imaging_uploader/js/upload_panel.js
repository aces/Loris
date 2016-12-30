'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* exported UploadFile */
/* global  */

var UploadPanel = function (_React$Component) {
  _inherits(UploadPanel, _React$Component);

  function UploadPanel(props) {
    _classCallCheck(this, UploadPanel);

    var _this = _possibleConstructorReturn(this, (UploadPanel.__proto__ || Object.getPrototypeOf(UploadPanel)).call(this, props));

    _this.state = {
      formData: {},
      form: _this.props.form
    };

    _this.onFormChange = _this.onFormChange.bind(_this);
    _this.uploadFile = _this.uploadFile.bind(_this);

    return _this;
  }

  _createClass(UploadPanel, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var form = this.state.form;
      form.IsPhantom.emptyOption = false;

      this.setState({ form: form });
    }
  }, {
    key: 'onFormChange',
    value: function onFormChange(field, value) {

      var form = this.state.form;
      var formData = this.state.formData;

      if (field === 'IsPhantom') {
        if (value === 'Y') {
          form.CandID.disabled = true;
          form.PSCID.disabled = true;
          form.Visit_label.disabled = true;
        } else {
          form.CandID.disabled = false;
          form.PSCID.disabled = false;
          form.Visit_label.disabled = false;
        }
      }

      formData[field] = value;

      this.setState({
        form: form,
        formData: formData
      });
    }

    /*
     Uploads file to the server, listening to the progress
     in order to get the percentage uploaded as value for the progress bar
     */

  }, {
    key: 'uploadFile',
    value: function uploadFile() {
      $("#file-input").hide();
      $("#file-progress").removeClass('hide');

      var formData = new FormData(this.state.formData);
      formData.append("fire_away", "Upload");

      $.ajax({
        type: 'POST',
        url: loris.BaseURL + "/imaging_uploader/",
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        xhr: function xhr() {
          var xhr = new window.XMLHttpRequest();
          xhr.upload.addEventListener("progress", function (evt) {
            if (evt.lengthComputable) {
              var progressbar = $("#progressbar");
              var progresslabel = $("#progresslabel");
              var percent = Math.round(evt.loaded / evt.total * 100);
              $(progressbar).width(percent + "%");
              $(progresslabel).html(percent + "%");
              progressbar.attr('aria-valuenow', percent);
            }
          }, false);
          return xhr;
        },
        success: function (data) {
          $("#file-progress").addClass('hide');
          var formData = {};
          this.setState({ formData: formData });
          console.log(data);
          // if (data.indexOf("The following errors occured while attempting to
          // display this page:") > -1) { document.open(); document.write(data);
          // document.close(); } else { $("#filter").click(); }
        }.bind(this)
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        Panel,
        { id: 'upload_panel', title: 'Upload a new file' },
        React.createElement(
          FormElement,
          {
            name: 'upload_form',
            formElements: this.state.form,
            onUserInput: this.onFormChange
          },
          React.createElement(StaticElement, {
            label: 'Note',
            text: 'File name should be of type .tgz or tar.gz or .zip'
          }),
          React.createElement(ButtonElement, { onUserInput: this.uploadFile }),
          React.createElement(
            'div',
            { id: 'file-progress', className: 'col-sm-9 col-sm-offset-3 hide' },
            React.createElement(
              'div',
              { className: 'progress' },
              React.createElement('div', {
                id: 'progressbar',
                className: 'progress-bar progress-bar-striped active',
                role: 'progressbar',
                'aria-valuenow': '0',
                'aria-valuemin': '0',
                'aria-valuemax': '100'
              }),
              React.createElement(
                'div',
                { id: 'progresslabel' },
                '0%'
              )
            )
          )
        )
      );
    }
  }]);

  return UploadPanel;
}(React.Component);

UploadPanel.propTypes = {};
UploadPanel.defaultProps = {};