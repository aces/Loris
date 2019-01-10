import Loader from 'Loader';
/**
 * Proband Info Component.
 *
 * Renders the contents of the ProbandInfo tab, consisting of the FormElement component
 */
class ProbandInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sexOptions: {
        Male: 'Male',
        Female: 'Female',
      },
      Data: [],
      formData: {},
      updateResult: null,
      errorMessage: null,
      isLoaded: false,
      loadedData: 0,
    };

    /**
     * Bind component instance to custom methods
     */
    this.fetchData = this.fetchData.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showAlertMessage = this.showAlertMessage.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrieve data from the provided URL and save it in state
   */
  fetchData() {
    $.ajax(this.props.dataURL, {
      method: 'GET',
      dataType: 'json',
      success: (data) => {
        const formData = {
          ProbandSex: data.ProbandSex,
          ProbandDoB: data.ProbandDoB,
          ProbandDoB2: data.ProbandDoB,
        };

        // Add parameter values to formData
        Object.assign(formData, data.parameter_values);

        this.setState({
          formData: formData,
          Data: data,
          isLoaded: true,
        });
      },
      error: (error) => {
        this.setState({
          error: 'An error occurred when loading the form!',
        });
      },
    });
  }

  /**
   * Store the value of the element in this.state.formData
   *
   * @param {string} formElement - name of the form element
   * @param {string} value - value of the form element
   */
  setFormData(formElement, value) {
    let formData = JSON.parse(JSON.stringify(this.state.formData));
    formData[formElement] = value;
    this.setState({
      formData: formData,
    });
  }

  /**
   * Handles form submission
   *
   * @param {event} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();
    let myFormData = this.state.formData;
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; // January is 0!
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;
    let dob1 = myFormData.ProbandDoB ?
      myFormData.ProbandDoB : null;
    let dob2 = myFormData.ProbandDoB2 ?
      myFormData.ProbandDoB2 : null;
    if (dob1 !== dob2) {
      alert('DOB do not match!');
      return;
    }

    if (dob1 > today) {
      alert('Proband date of birth cannot be later than today!');
      return;
    }

    // Set form data
    let formData = new FormData();
    for (let key in myFormData) {
      if (myFormData[key] !== '') {
        formData.append(key, myFormData[key]);
      }
    }

    formData.append('tab', this.props.tabName);
    formData.append('candID', this.state.Data.candID);
    $.ajax({
      type: 'POST',
      url: this.props.action,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: (data) => {
        this.setState({
          updateResult: 'success',
        });
        this.showAlertMessage();
        this.fetchData();
      },
      error: (error) => {
        if (error.responseText !== '') {
          let errorMessage = JSON.parse(error.responseText).message;
          this.setState({
            updateResult: 'error',
            errorMessage: errorMessage,
          });
          this.showAlertMessage();
        }
      },
    });
  }

  /**
   * Display a success/error alert message after form submission
   */
  showAlertMessage() {
    if (this.refs['alert-message'] === null) {
      return;
    }

    let alertMsg = this.refs['alert-message'];
    $(alertMsg).fadeTo(2000, 500).delay(3000).slideUp(
      500,
      () => {
        this.setState({
          updateResult: null,
        });
      }
    );
  }

  render() {
    if (!this.state.isLoaded) {
      return <Loader />;
    }

    let disabled = true;
    let updateButton = null;
    if (loris.userHasPermission('candidate_parameter_edit')) {
      disabled = false;
      updateButton = <ButtonElement label ="Update" />;
    }

    let dobRequired = false;
    let dob2Required = false;
    if (this.state.formData.ProbandSex !== null) {
      dobRequired = true;
    }
    if (this.state.formData.ProbandDoB !== null) {
      dob2Required = true;
    }
    let extraParameterFields = [];
    let extraParameters = this.state.Data.extra_parameters;
    for (let key2 in extraParameters) {
      if (extraParameters.hasOwnProperty(key2)) {
        let paramTypeID = extraParameters[key2].ParameterTypeID;
        let name = paramTypeID;
        let value = this.state.formData[paramTypeID];

        switch (extraParameters[key2].Type.substring(0, 3)) {
          case 'enu': {
            let types = extraParameters[key2].Type.substring(5);
            types = types.slice(0, -1);
            types = types.replace(/'/g, '');
            types = types.split(',');
            let selectOptions = {};
            for (let key3 in types) {
              if (types.hasOwnProperty(key3)) {
                selectOptions[types[key3]] = types[key3];
              }
            }

            extraParameterFields.push(
              <SelectElement
                  label={extraParameters[key2].Description}
                  name={name}
                  options={selectOptions}
                  value={value}
                  onUserInput={this.setFormData}
                  ref={name}
                  disabled={disabled}
                  key={key2}
              />
            );
            break;
          }
          case 'dat':
            extraParameterFields.push(
              <DateElement
                  label={extraParameters[key2].Description}
                  name={name}
                  value={value}
                  onUserInput={this.setFormData}
                  ref={name}
                  disabled={disabled}
                  key={key2}
              />
          );
            break;
          default:
            extraParameterFields.push(
              <TextareaElement
                  label={extraParameters[key2].Description}
                  name={name}
                  value={value}
                  onUserInput={this.setFormData}
                  ref={name}
                  disabled={disabled}
                  key={key2}
              />
          );
        }
      }
    }

    let alertMessage = '';
    let alertClass = 'alert text-center hide';
    if (this.state.updateResult) {
      if (this.state.updateResult === 'success') {
        alertClass = 'alert alert-success text-center';
        alertMessage = 'Update Successful!';
      } else if (this.state.updateResult === 'error') {
        let errorMessage = this.state.errorMessage;
        alertClass = 'alert alert-danger text-center';
        alertMessage = errorMessage ? errorMessage : 'Failed to update!';
      }
    }

    return (
      <div className="row">
        <div className={alertClass} role="alert" ref="alert-message">
          {alertMessage}
        </div>
        <FormElement
          name="probandInfo"
          onSubmit={this.handleSubmit}
          ref="form"
          class="col-md-6"
        >
          <StaticElement
            label="PSCID"
            text={this.state.Data.pscid}
          />
          <StaticElement
            label="DCCID"
            text={this.state.Data.candID}
          />
          <SelectElement
            label="Proband Sex"
            name="ProbandSex"
            options={this.state.sexOptions}
            value={this.state.formData.ProbandSex}
            onUserInput={this.setFormData}
            ref="ProbandSex"
            disabled={disabled}
            required={true}
          />
          <DateElement
            label="DoB Proband"
            name="ProbandDoB"
            value={this.state.formData.ProbandDoB}
            onUserInput={this.setFormData}
            ref="ProbandDoB"
            disabled={disabled}
            required={dobRequired}
          />
          <DateElement
            label="Confirm DoB Proband"
            name="ProbandDoB2"
            value={this.state.formData.ProbandDoB2}
            onUserInput={this.setFormData}
            ref="ProbandDoB2"
            disabled={disabled}
            required={dob2Required}
          />
          <StaticElement
            label="Age Difference (months)"
            text={this.state.Data.ageDifference.toString()}
          />
          {extraParameterFields}
          {updateButton}
        </FormElement>
      </div>
    );
  }
}

ProbandInfo.propTypes = {
  dataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  tabName: PropTypes.string,
};

export default ProbandInfo;
