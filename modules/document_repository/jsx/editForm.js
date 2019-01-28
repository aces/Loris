/* exported DocEditForm */
import PropTypes from 'prop-types';
/**
 * Document Edit Form
 *
 * Fetches data corresponding to a given file from Loris backend and
 * displays a form allowing meta information of the media file
 *
 * @author Shen Wang
 * @version 1.0.0
 *
 * */
class DocEditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Data: {},
      docData: {},
      uploadResult: null,
      isLoaded: false,
      loadedData: 0,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.showAlertMessage = this.showAlertMessage.bind(this);
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  fetchData() {
    return fetch(this.props.DataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => {
      let formData = {
          idDocFile: data.docData.id,
          pscid: data.docData.pscid,
          category: data.docData.category,
          visitLabel: data.docData.visitLabel,
          comments: data.docData.comments,
          version: data.docData.version,
          instrument: data.docData.instrument,
          category: data.docData.category,
          forSite: data.docData.forSite,
        };
        this.setState({
          Data: data,
          docData: data.docData,
          formData: formData,
        });
      })
      .catch((error) => {
        this.setState({error: true});
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

    let alertMessage = '';
    let alertClass = 'alert text-center hide';
    let backURL = loris.BaseURL.concat('/document_repository/');

    if (this.state.uploadResult) {
      if (this.state.uploadResult === 'success') {
        alertClass = 'alert alert-success text-center';
        alertMessage = 'Update Successful!';
      } else if (this.state.uploadResult === 'error') {
        alertClass = 'alert alert-danger text-center';
        alertMessage = 'Failed to update the file';
      }
    }

    return (
      <div>
        <div className={alertClass} role="alert" ref="alert-message">
          {alertMessage}
        </div>
        {
          this.state.uploadResult === 'success' ?
          <a className="btn btn-primary" href={backURL}>Back to document repository</a> :
          null
        }
        <FormElement
          name="docEdit"
          onSubmit={this.handleSubmit}
          ref="form"
        >
          <h3>Edit Document Repository File</h3>
          <br />
            <SelectElement
              name="category"
              label="Category"
              options={this.state.Data.categories}
              onUserInput={this.setFormData}
              ref="category"
              hasError={false}
              required={true}
              disabled={true}
              value={this.state.docData.category}
            />
            <SelectElement
              name="forSite"
              label="Site"
              options={this.state.Data.sites}
              onUserInput={this.setFormData}
              ref="forSite"
              required={true}
              disabled={true}
              value={this.state.docData.forSite}
            />
            <SelectElement
              name="instrument"
              label="Instrument"
              options={this.state.Data.instruments}
              onUserInput={this.setFormData}
              ref="instrument"
              value={this.state.docData.instrument}
            />
            <TextboxElement
              name="pscid"
              label="PSCID"
              onUserInput={this.setFormData}
              ref="pscid"
              disable = {true}
              value={this.state.docData.pscid}
            />
            <TextboxElement
              name="visitLabel"
              label="Visit Label"
              onUserInput={this.setFormData}
              ref="visitLabel"
              value={this.state.docData.visitLabel}
            />
            <TextareaElement
              name="comments"
              label="Comments"
              onUserInput={this.setFormData}
              ref="comments"
              value={this.state.docData.comments}
            />
            <TextboxElement
              name="version"
              label="Version"
              onUserInput={this.setFormData}
              ref="version"
              value={this.state.docData.version}
            />
          <ButtonElement label="Update File"/>
        </FormElement>
      </div>
    );
  }

  /**
   * Handles form submission
   * @param {event} e - Form submition event
   */
  handleSubmit(e) {
    e.preventDefault();

    let formData = this.state.docData;
    let formObject= new FormData();
    for (let key in formData) {
      if (formData[key] !== '') {
        formObject.append(key, formData[key]);
      }
    }
   fetch(this.props.action, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      body: formObject,
    })
    .then((resp) => resp.json())
    .then(()=>{
      swal('Updated Successful!', '', 'success');
      this.props.refreshPage();
      this.fetchData();
    });
  }

  /**
   * Set the form data based on state values of child elements/componenets
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setFormData(formElement, value) {
    let docData = this.state.docData;
      docData[formElement] = value;
    this.setState({
      docData: docData,
    });
  }

  /**
   * Display a success/error alert message after form submission
   */
  showAlertMessage() {
    let self = this;

    if (this.refs['alert-message'] === null) {
      return;
    }

    let alertMsg = this.refs['alert-message'];
    $(alertMsg).fadeTo(2000, 500).delay(3000).slideUp(500, function() {
      self.setState({
        uploadResult: null,
      });
    });
  }
}

DocEditForm.propTypes = {
  DataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
};

let RDocEditForm = React.createFactory(DocEditForm);

window.DocEditForm = DocEditForm;
window.RDocEditForm = RDocEditForm;

export default DocEditForm;
