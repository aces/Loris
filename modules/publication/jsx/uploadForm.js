class PublicationUploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Data: {},
      formData: {},
      numVOIGroups: 1,
      uploadResult: null,
      error: undefined,
      isLoaded: false,
      loadedData: 0,
      uploadProgress: -1
    };

    this.setFormData = this.setFormData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addListItem = this.addListItem.bind(this);
    this.removeListItem = this.removeListItem.bind(this);
    this.addVOIGroups = this.addVOIGroups.bind(this);
    this.isValidEmail = this.isValidEmail.bind(this);
  }

  componentDidMount() {
    let self = this;
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
    let currCount = this.state.numVOIGroups;
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
    // validate email
    if (!this.isValidEmail(formData.leadInvestigatorEmail)) {
      swal("Lead Investigator Email is invalid!", "", "error");
      return;
    }

    let formObj = new FormData();
    for (let key in formData) {
      if (formData[key] !== "") {
        let formVal;
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
      error: function(jqXHR, textStatus, errorThrown) {
        console.error(textStatus);
        swal("Something went wrong!", errorThrown, "error");
      }
    });
  }

  isValidEmail(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
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

    // generate optional email input fields for collaborators
    let collabEmails = [];
    if (this.state.formData.collaborators) {
      this.state.formData.collaborators.forEach(
        function (c) {
          collabEmails.push(
            <TextboxElement
              name={'collabEmail' + c}
              label={c + (c.slice(-1) !== 's' ? "'s" : "'") + " Email"}
              onUserInput={this.setFormData}
              required={false}
              value={this.state.formData['collabEmail' + c]}
            />
          );
        }.bind(this)
      );
    }

    let testNames = [];
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
    let testFields = this.state.Data.varsOfInterest.map(v => v.Name);
    testFields.sort();
    
    // if an instrument has been selected, then populate the fields
    // selection with fields only relevant to the selected instrument
    let inst = this.state.formData['voiInst'];
    if (inst) {
      testFields = [];
      testFields[inst+'_AllFields'] = inst + '_AllFields';
      this.state.Data.varsOfInterest.forEach(function(v){
        if (v.SourceFrom === inst) {
          testFields[v.Name] = v.Name;
        }
      });
    }

    return (
      <div className="row">
        <div className="col-md-8 col-lg-7">
          <FormElement
            name="publicationUpload"
            onSubmit={this.handleSubmit}
            ref="form"
          >
            <h3>Propose a new project</h3><br/>
            <TextboxElement
              name="title"
              label="Title"
              onUserInput={this.setFormData}
              required={true}
              value={this.state.formData.title}
            />
            <TextareaElement
              name="description"
              label="Description"
              onUserInput={this.setFormData}
              required={true}
              value={this.state.formData.description}
            />
            <TextboxElement
              name="leadInvestigator"
              label="Lead Investigator"
              onUserInput={this.setFormData}
              required={true}
              value={this.state.formData.leadInvestigator}
            />
            <TextboxElement
              name="leadInvestigatorEmail"
              label="Lead Investigator Email"
              onUserInput={this.setFormData}
              required={true}
              value={this.state.formData.leadInvestigatorEmail}
            />
            <TagsElement
              name="collaborators"
              label="Collaborators"
              id="collaborators"
              onUserInput={this.setFormData}
              onUserAdd={this.addListItem}
              onUserRemove={this.removeListItem}
              required={false}
              value={this.state.formData.pendingCollab}
              pendingValKey="pendingCollab"
              items={this.state.formData.collaborators}
              btnLabel="Add Collaborator"
            />
            {collabEmails}
            <TagsElement
              name="keywords"
              label="Keywords"
              id="keywords"
              onUserInput={this.setFormData}
              onUserAdd={this.addListItem}
              onUserRemove={this.removeListItem}
              required={false}
              allowDupl={false}
              value={this.state.formData.pendingKWItem}
              pendingValKey="pendingKWItem"
              items={this.state.formData.keywords}
              btnLabel='Add Keyword'
            />
            <div className="row form-group">
              <label className="col-sm-3 control-label"/>
              <div className="col-sm-9">
                <p className="form-control-static">
                  <strong>
                    Variables of Interest
                  </strong>
                </p>
              </div>
            </div>
            <SelectElement
              name="voiInst"
              label="Instrument"
              id="voiInst"
              onUserInput={this.setFormData}
              required={false}
              value={this.state.formData.voiInst}
              options={testNames}
            />
            <TagsElement
              name="voiFields"
              label="Instrument Fields"
              id="voiFields"
              onUserInput={this.setFormData}
              onUserAdd={this.addListItem}
              onUserRemove={this.removeListItem}
              required={false}
              value={this.state.formData.pendingItemVF}
              options={testFields}
              pendingValKey="pendingItemVF"
              items={this.state.formData.voiFields}
              btnLabel="Add Variable of Interest"
            />
            <ButtonElement label="Propose Project"/>
          </FormElement>
        </div>
      </div>
    );
  }
}

export default PublicationUploadForm;