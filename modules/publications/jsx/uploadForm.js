class PublicationUploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Data: {},
      formData: {},
      uploadResult: null,
      errorMessage: null,
      isLoaded: false,
      loadedData: 0,
      uploadProgress: -1
    };
  }

  componentDidMount() {
    var self = this;
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      success: function(data) {
        self.setState({
          Data: data,
          isLoaded: true
        });
      },
      error: function(data, errorCode, errorMsg) {
        console.error(data, errorCode, errorMsg);
        self.setState({
          error: 'An error occurred when loading the form!'
        });
      }
    });
  }

  render() {
    // Data loading error
    if (this.state.error !== undefined) {
      return (
        <div className="alert alert-danger text-center">
          <strong>
            {this.state.error}
          </strong>
        </div>
      );
    }

    // Waiting for data to load
    if (!this.state.isLoaded) {
      return (
        <button className="btn-info has-spinner">
          Loading
          <span
            className="glyphicon glyphicon-refresh glyphicon-refresh-animate">
          </span>
        </button>
      );
    }

    return (
      <div className="row">
        <div className="col-md-8 col-lg-7">
          <FormElement
            name="publicationUpload"
            fileUpload={true}
            onSubmit={this.handleSubmit}
            ref="form"
          >
            <h3>Propose a new project</h3><br/>
            <TextboxElement
              name="title"
              label="Title"
              onUserInput={this.setFormData}
              ref="title"
              required={true}
              //value={this.state.formData.title}
            />
            <TextboxElement
              name="leadInvestigator"
              label="Lead Investigator"
              onUserInput={this.setFormData}
              ref="leadInvestigator"
              required={true}
              //value={this.state.formData.leadInvestigator}
            />
            <TextboxElement
              name="leadInvestigatorEmail"
              label="Lead Investigator Email"
              onUserInput={this.setFormData}
              ref="leadInvestigatorEmail"
              required={true}
              //value={this.state.formData.leadInvestigatorEmail}
            />
            <TextboxElement
              name="keywords"
              label="Keywords"
              onUserInput={this.setFormData}
              ref="keywords"
              required={false}
              //value={this.state.formData.keywords}
            />
            <TextboxElement
              name="voi"
              label="Variables of Interest"
              onUserInput={this.setFormData}
              ref="voi"
              required={true}
              //value={this.state.formData.voi}
            />
            <TextareaElement
              name="description"
              label="Description"
              onUserInput={this.setFormData}
              ref="description"
              required={true}
              //value={this.state.formData.description}
            />
            <FileElement
              name="file"
              id="publicationUploadEl"
              onUserInput={this.setFormData}
              ref="file"
              label="Publication"
              required={true}
              //value={this.state.formData.file}
            />
            <ButtonElement label="Upload File"/>
            <div className="row">
              <div className="col-sm-9 col-sm-offset-3">

              </div>
            </div>
          </FormElement>
        </div>
      </div>
    );
  }

  /**
   * Set the form data based on state values of child elements/componenets
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setFormData(formElement, value) {

  }
}

export default PublicationUploadForm;