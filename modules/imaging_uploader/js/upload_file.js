'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* exported UploadFile */
/* global formatColumn */

var UploadFile = function (_React$Component) {
  _inherits(UploadFile, _React$Component);

  function UploadFile(props) {
    _classCallCheck(this, UploadFile);

    var _this = _possibleConstructorReturn(this, (UploadFile.__proto__ || Object.getPrototypeOf(UploadFile)).call(this, props));

    _this.state = {
      formData: {},
      form: _this.props.form
    };

    _this.onFormChange = _this.onFormChange.bind(_this);
    _this.uploadFile = _this.uploadFile.bind(_this);

    return _this;
  }

  _createClass(UploadFile, [{
    key: 'onFormChange',
    value: function onFormChange(field, value) {

      var form = this.state.form;
      var formData = this.state.formData;

      if (field === 'IsPhantom') {
        if (value == 'Y') {
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
      $("#file-progress").show();
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
              var progressbar = $("#progressbar"),
                  progresslabel = $("#progresslabel"),
                  percent = Math.round(evt.loaded / evt.total * 100);
              $(progressbar).width(percent + "%");
              $(progresslabel).html(percent + "%");
              progressbar.attr('aria-valuenow', percent);
            }
          }, false);
          return xhr;
        },
        success: function success(data) {
          console.log(data);
          // if (data.indexOf("The following errors occured while attempting to
          // display this page:") > -1) { document.open(); document.write(data);
          // document.close(); } else { $("#filter").click(); }
        }
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
            columns: 1,
            formElements: this.state.form,
            onUserInput: this.onFormChange
          },
          React.createElement(StaticElement, {
            label: 'Note',
            text: 'File name should be of type .tgz or tar.gz or .zip'
          }),
          React.createElement(ButtonElement, {
            onUserInput: this.uploadFile
          })
        )
      );
    }
  }]);

  return UploadFile;
}(React.Component);

UploadFile.propTypes = {};
UploadFile.defaultProps = {};