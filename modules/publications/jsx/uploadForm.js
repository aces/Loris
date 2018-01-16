class PublicationUploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Data: {},
      formData: {},
      numVOIGroups: 1,
      uploadResult: null,
      errorMessage: null,
      isLoaded: false,
      loadedData: 0,
      uploadProgress: -1
    };

    this.setFormData = this.setFormData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addListItem = this.addListItem.bind(this);
    this.removeListItem = this.removeListItem.bind(this);
    this.addVOIGroups = this.addVOIGroups.bind(this);
  }

  componentDidMount() {
    var self = this;
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      success: function(data) {
        console.log(data);
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

  /**
   * Set the form data based on state values of child elements/componenets
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setFormData(formElement, value) {
    let formData = this.state.formData;
    formData[formElement] = value;
    this.setState({
      formData: formData
    });
  }

  addListItem(formElement, value, pendingValKey) {
    let formData = this.state.formData;
    let listItems = formData[formElement] || [];
    listItems.push(value);
    formData[formElement] = listItems;
    formData[pendingValKey] = null;
    this.setState({
      formData: formData
    });
  }

  addVOIGroups() {
    var currCount = this.state.numVOIGroups;
    currCount++;
    this.setState({
      numVOIGroups: currCount
    });
  }

  removeListItem(formElement, value) {
    let formData = this.state.formData;
    let listItems = formData[formElement];
    let index = listItems.indexOf(value);

    if (index > -1) {
      listItems.splice(index, 1);

      formData[formElement] = listItems;
      this.setState({
        formData: formData
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    let formData = this.state.formData;
    // make sure title is unique
    let existingTitles = this.state.Data.titles;
    if (existingTitles.indexOf(formData.title) > -1) {
      swal("Publication title already exists!", "", "error");
      return;
    }

    let formObj = new FormData();
    for (let key in formData) {
      if (formData[key] !== "") {
        var formVal;
        if (Array.isArray(formData[key])) {
          formVal = JSON.stringify(formData[key]);
        } else {
          formVal = formData[key];
        }
        formObj.append(key, formVal);
      }
    }

    $.ajax({
      type: 'POST',
      url: this.props.action,
      data: formObj,
      cache: false,
      contentType: false,
      processData: false,
      success: function() {
        // reset form data
        this.setState({
          formData: {}
        });
        swal("Submission Successful!", "", "success");
      }.bind(this),
      error: function(jqXHR, textStatus) {
        console.log(textStatus);
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

    var testNames = [];
    this.state.Data.varsOfInterest.forEach(
      function (v) {
        if (testNames[v.SourceFrom]) {
          return;
        }
        testNames[v.SourceFrom] = v.SourceFrom;
      }
    );
    testNames.sort();

    // Set test fields to all fields by default
    var testFields = this.state.Data.varsOfInterest.map(v => v.Name);
    testFields.sort();

    // Generate Variables of Interest fields
    var voiFields = [];
    for (var i = 1; i <= this.state.numVOIGroups; i++) {
      // if an instrument has been selected, then populate the fields
      // selection with fields only relevant to the selected instrument
      var inst = this.state.formData['voiInst_' + i];
      if (inst) {
        testFields = [];
        this.state.Data.varsOfInterest.forEach(function(v){
          if (v.SourceFrom === inst) {
            testFields[v.SourceField] = v.SourceField;
          }
        });
      }

      // TODO - add deletion functionality
      voiFields.push(
      <div>
        <SelectElement
          name={"voiInst_" + i}
          label="Instrument"
          ref={"voiInst_" + i}
          id={"voiInst_" + i}
          onUserInput={this.setFormData}
          required={true}
          value={this.state.formData['voiInst_' + i]}
          options={testNames}
        />
        <ListElement
          name={"voiFields_" + i}
          label="Instrument Fields"
          ref={"voiFields_" + i}
          id={"voiFields_" + i}
          onUserInput={this.setFormData}
          onUserAdd={this.addListItem}
          onUserRemove={this.removeListItem}
          required={true}
          value={this.state.formData['pendingItemVF_' +i]}
          options={testFields}
          pendingValKey="pendingItemVF_"
          items={this.state.formData['voiFields_' + i]}
        />
      </div>
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
              value={this.state.formData.title}
            />
            <TextareaElement
              name="description"
              label="Description"
              onUserInput={this.setFormData}
              ref="description"
              required={true}
              value={this.state.formData.description}
            />
            <TextboxElement
              name="leadInvestigator"
              label="Lead Investigator"
              onUserInput={this.setFormData}
              ref="leadInvestigator"
              required={true}
              value={this.state.formData.leadInvestigator}
            />
            <TextboxElement
              name="leadInvestigatorEmail"
              label="Lead Investigator Email"
              onUserInput={this.setFormData}
              ref="leadInvestigatorEmail"
              required={true}
              value={this.state.formData.leadInvestigatorEmail}
            />

            {/* START Variables of Interest */}
            <div className="row form-group">
              <label className="col-sm-3 control-label"/>
              <div className="col-sm-9">
                <p className="form-control-static">
                  <strong>
                    Variables of Interest
                    <span className="text-danger">*</span>
                  </strong>
                </p>
              </div>
            </div>
            {voiFields}
            <ButtonElement
              label="Add Instrument"
              type="button"
              onUserInput={this.addVOIFields}
            />
            {/* END Variables of Interest */}


            <ListElement
              name="keywords"
              label="Keywords"
              ref="keywords"
              id="keywords"
              onUserInput={this.setFormData}
              onUserAdd={this.addListItem}
              onUserRemove={this.removeListItem}
              required={false}
              allowDupl={false}
              value={this.state.formData.pendingKWItem}
              pendingValKey="pendingKWItem"
              items={this.state.formData.keywords}
            />
            <FileElement
              name="file"
              id="publicationUploadEl"
              onUserInput={this.setFormData}
              ref="file"
              label="Publication"
              required={false}
              value={this.state.formData.file}
            />
            <ButtonElement label="Propose Project"/>
            <div className="row">
              <div className="col-sm-9 col-sm-offset-3">

              </div>
            </div>
          </FormElement>
        </div>
      </div>
    );
  }
}

export default PublicationUploadForm;