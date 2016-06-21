/* Generic Form Components */


FormElement = React.createClass({
  getDefaultProps: function() {
    return {
      'name':   '',
      'id':     '',
      'action': '',
      'method': 'POST',
      'class':  'form-horizontal'
    };
  },

  handleChange: function(e) {
    e.preventDefault();
    if (this.props.onSubmit) this.props.onSubmit(e);
  },

  render: function() {
    return (
      <form
        name={this.props.name}
        action={this.props.action}
        className={this.props.class}
        method={this.props.method}
        encType="multipart/form-data"
        onSubmit={this.handleChange}
      >
        {this.props.children}
      </form>
    );
  }
});

SelectElement = React.createClass({
  getDefaultProps: function() {
    return {
      'label':    'Label',
      'options':  [],
      'multiple': '',
      'name':     '',
      'id':       '',
      'disabled': '',
      'required': '',
      'class':    '',
      'onUserInput': function() {
        console.warn('onUserInput() callback is not set');
      }
    };
  },
  getInitialState: function() {
    return {
      value: ''
    }
  },
  handleChange: function(e) {
    this.setState({
      value: e.target.value
    });
    this.props.onUserInput(this.props.name, e.target.value);
  },
  render: function() {
    var multiple = this.props.multiple ? 'multiple' : '';
    var options = this.props.options;
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label" for={this.props.label}>
          {this.props.label}
        </label>
        <div className="col-sm-9">
          <select
            name={this.props.name}
            multiple={multiple}
            className="form-control"
            id={this.props.label}
            value={this.state.value}
            onChange={this.handleChange}
          >
            <option></option>
            {Object.keys(options).map(function (option) {
              return <option value={options[option]}>{options[option]}</option>
            })}
          </select>
        </div>
      </div>
    )
  }
});

FileElement = React.createClass({

  getInitialState: function() {
    return {
      'id': '',
      'value': null,
      'onUserInput': function() {
        console.warn('onUserInput() callback is not set');
      }
    }
  },

  getDefaultProps: function() {
    return {
      'label': 'File to Upload',
      'name':  'file',
      'class': 'fileUpload'
    };
  },

  handleChange: function(e) {
    this.setState({
      value: e.target.value.split(/(\\|\/)/g).pop()
    });
    // pass current file to parent form
    var file = e.target.files[0];
    this.props.onUserInput(this.props.name, file);
  },

  render: function() {

    if (this.state.value != null) {
      console.log(this.state.value);
    }

    return (
      <div className="form-group">
        <label className="col-sm-3 control-label">
          {this.props.label}
        </label>
        <div className="col-sm-9">
          <div className="input-group">
            <div tabindex="-1" className="form-control file-caption kv-fileinput-caption" title="">
              {this.state.value}
              <div className="file-caption-name" id="video_file"></div>
            </div>
            <div className="input-group-btn">
              <div className="btn btn-primary btn-file">
                <i className="glyphicon glyphicon-folder-open"></i> Browse
                <input type="file" name={this.props.name} className={this.props.class} ref="file" onChange={this.handleChange}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

HelpTextElement = React.createClass({
  getDefaultProps: function() {
    return {
      'html': false,
      'label': '',
      'text':  ''
    };
  },
  render: function() {
    if (this.props.html) {
      return (
        <div className="form-group">
          <label className="col-sm-3 control-label">
            {this.props.label}
          </label>
          <div className="col-sm-9">
            <div dangerouslySetInnerHTML={{__html: this.props.text}} />
          </div>
        </div>
      );
    }
    return (
      <div className="form-group">
        <label className="col-sm-2 control-label">
          {this.props.label}
        </label>
        <div className="col-sm-10">
          <div>{this.props.text}</div>
        </div>
      </div>
    );
  }
});

ButtonElement = React.createClass({
  render: function() {
    return (
      <div className="form-group">
        <div className="col-sm-9 col-sm-offset-3">
          <button type="submit" className="btn btn-primary">Upload</button>
        </div>
      </div>
    );
  }
});

/* End of generic form components*/


/**
 * Video Upload Form
 *
 * Fetches data from Loris backend and display a form allowing
 * to upload a video attached to a specific instrument
 *
 * @author Alex Ilea
 * @version 1.0.0
 *
 * */
var VideoUploadForm = React.createClass({

  propTypes: {
    DataURL: React.PropTypes.string.isRequired,
  },

  getInitialState: function () {
    return {
      'formData': {
        'PSCID': '',
        'visitLabel': '',
        'Instrument': '',
        'For_site': ''
      },
      'uploadResult': null,
      'Headers':    [],
      'Data':       [],
      'isLoaded':   false,
      'loadedData': 0
    };
  },

  componentDidMount: function () {
    var that = this;
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      xhr:      function () {
        var xhr = new window.XMLHttpRequest();
        xhr.addEventListener("progress", function (evt) {
          that.setState({
            'loadedData': evt.loaded
          });
        });
        return xhr;
      },
      success:  function (data) {
        that.setState({
          'Data':     data,
          'isLoaded': true
        });
      },
      error:    function (data, error_code, error_msg) {
        console.error(error_code + ': ' + error_msg);
        that.setState({"error": "Error loading data"});
      }
    });
  },


  handleSubmit: function(e) {

    var self = this;

    $('#videoUploadEl').hide();
    $("#file-progress").removeClass('hide');
    e.preventDefault();
    var myFormData = this.state.formData;
    var formData = new FormData ();
    for (var key in myFormData) {
      formData.append (key, myFormData[key]);
    }

    $.ajax ({
      type: 'POST',
      url: loris.BaseURL + "/videos/ajax/VideoUpload.php?action=upload",
      data: formData,
      cache: false,
      contentType:false,
      processData:false,
      xhr: function() {
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            var progressbar = $("#progressbar");
            var progresslabel = $("#progresslabel");
            var percent = Math.round ((evt.loaded / evt.total) * 100);
            $(progressbar).width (percent + "%");
            $(progresslabel).html (percent + "%");
            progressbar.attr('aria-valuenow', percent);
          }
        }, false);
        return xhr;
      },
      success: function(data) {
        $("#file-progress").addClass('hide');
        self.setState({
          uploadResult: "success"
        });
      },
      error: function(err) {
        console.error(err);
        self.setState({
          uploadResult: "error"
        });
      }

    });
  },

  setFormData: function(formElement, value) {
    var formData = this.state.formData;
    formData[formElement] = value;

    this.setState({
      formData : formData
    });
  },

  render: function() {

    if (!this.state.isLoaded) {

      if (this.state.error != undefined) {
        return (
          <div className="alert alert-danger">
            <strong>
              {this.state.error}
            </strong>
          </div>
        );
      }

      return (
        <button className="btn-info has-spinner">
          Loading <span
          className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
        </button>
      );
    }

    var helpText = "File name should begin with<b> [PSCID]_[CandID]_[Visit Label]_[Instrument]</b><br> For example, for candidate <i>9990000</i>, visit <i>V1</i> for <i>Biosample Collection</i> the file name should be prefixed by: <b>9990000_CandID_V1_Biosample_Collection</b>";
    var submitMessage = "";
    var submitClass = "alert text-center hide";

    if (this.state.uploadResult) {

      if (this.state.uploadResult == "success") {
        submitClass = "alert alert-success text-center";
        submitMessage = "Upload Successful!";
      } else if (this.state.uploadResult == "error") {
        submitClass = "alert alert-danger text-center";
        submitMessage = "Failed to upload";
      }
    }

    return (
      <div>
        <div className={submitClass} role="alert">
          {submitMessage}
        </div>
        <FormElement
          name="videoUpload"
          action={this.props.action}
          onSubmit={this.handleSubmit}
        >
          <h3>Upload Video</h3>
          <br />
          <HelpTextElement label="Note" html={true} text={helpText} />
          <SelectElement
            name="PSCID"
            label="PSCID"
            options={this.state.Data.candidates}
            onUserInput={this.setFormData}
          />
          <SelectElement
            name="visitLabel"
            label="Visit Label"
            options={this.state.Data.visits}
            onUserInput={this.setFormData}
          />
          <SelectElement
            name="Instrument"
            label="Instrument"
            options={this.state.Data.instruments}
            onUserInput={this.setFormData}
          />
          <SelectElement
            name="For_site"
            label="For Site"
            options={this.state.Data.sites}
            onUserInput={this.setFormData}
          />
          <DateElement
            label="Date of Administration"
            minYear="2000"
            maxYear="2017"
          />
          <FileElement id="videoUploadEl" onUserInput={this.setFormData} />
          <ButtonElement />
        </FormElement>
      </div>
    )
  }
});

RVideoUploadForm = React.createFactory(VideoUploadForm);