/* exported UploadFile */
/* global  */

class UploadPanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      formData: {},
      form: this.props.form
    };

    this.onFormChange = this.onFormChange.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  componentDidMount() {
    let form = this.state.form;
    form.IsPhantom.emptyOption = false;

    this.setState({form});
  }

  onFormChange(field, value) {
    let form = this.state.form;
    let formData = this.state.formData;

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
  uploadFile() {
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
      xhr: function() {
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener(
          "progress",
          function(evt) {
            if (evt.lengthComputable) {
              var progressbar = $("#progressbar");
              var progresslabel = $("#progresslabel");
              var percent = Math.round((evt.loaded / evt.total) * 100);
              $(progressbar).width(percent + "%");
              $(progresslabel).html(percent + "%");
              progressbar.attr('aria-valuenow', percent);
            }
          },
          false
        );
        return xhr;
      },
      success: function(data) {
        $("#file-progress").addClass('hide');
        let formData = {};
        this.setState({formData});
        // console.log(data);
        // if (data.indexOf("The following errors occured while attempting to
        // display this page:") > -1) { document.open(); document.write(data);
        // document.close(); } else { $("#filter").click(); }
      }.bind(this)
    });
  }

  render() {
    return (
      <Panel id="upload_panel" title="Upload a new file">
        <FormElement
          name="upload_form"
          formElements={this.state.form}
          onUserInput={this.onFormChange}
        >
          <StaticElement
            label="Note"
            text="File name should be of type .tgz or tar.gz or .zip"
          />
          <ButtonElement onUserInput={this.uploadFile} />
          <div id="file-progress" className="col-sm-9 col-sm-offset-3 hide">
            <div className="progress">
              <div
                id="progressbar"
                className="progress-bar progress-bar-striped active"
                role="progressbar"
                aria-valuenow="0"
                aria-valuemin="0"
                aria-valuemax="100"
              >
              </div>
              <div id="progresslabel">0%</div>
            </div>
          </div>
        </FormElement>
      </Panel>
    );
  }
}

UploadPanel.propTypes = {};
UploadPanel.defaultProps = {};

export default UploadPanel;
