class ViewProject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {},
      isLoaded: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.createMenuFilterLinks = this.createMenuFilterLinks.bind(this);
    this.createVOIElements = this.createVOIElements.bind(this);
    this.createStaticComponents = this.createStaticComponents.bind(this);
    this.createEditableComponents = this.createEditableComponents.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    let formData = this.state.formData;
    // make sure title is unique
    /*let existingTitles = this.state.Data.titles;
    if (existingTitles.indexOf(formData.title) > -1) {
      swal("Publication title already exists!", "", "error");
      return;
    }*/

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
        swal("Edit Successful!", "", "success");
      }.bind(this),
      error: function(jqXHR, textStatus) {
        console.error(textStatus);
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

  componentDidMount() {
    var self = this;
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      success: function(data) {
        console.log(data);
        var formData = {
          title: data.title,
          description: data.description,
          leadInvestigator: data.leadInvestigator,
          leadInvestigatorEmail: data.leadInvestigatorEmail,
          status: data.status,
          voi: data.voi,
          keywords: data.keywords
        };
        self.setState({
          formData: formData,
          statusOpts: data.statusOpts,
          userCanEdit: data.userCanEdit,
          varsOfInterest: data.varsOfInterest,
          uploadTypes: data.uploadTypes,
          isLoaded: true
        });
      },
      error: function(error, errorCode, errorMsg) {
        console.error(error, errorCode, errorMsg);
        self.setState({
          error: 'An error occurred when loading the form!'
        });
      }
    });
  }

  createMenuFilterLinks(stringArr, filterVar) {
    var links = [];
    stringArr.forEach(
      function (value) {
        links.push(
          <span>
            <a
              href={loris.BaseURL + "/publication/?"+filterVar+"="+value}
            >
              {value}
            </a>
            ; &nbsp;
          </span>
        );
      }
    );

    return links;
  }

  createVOIElements(vois) {
    var result = [];
    Object.keys(vois).forEach(
      function(v) {
        var links = this.createMenuFilterLinks(vois[v], 'voi');
        result.push(
          <div>
            <h4 data-toggle="collapse" data-target={"#voi" + v}>
              {v} &nbsp;
              <span className="glyphicon glyphicon-chevron-down"/>
            </h4>
            <div id={"voi" + v} className="collapse">
            {links}
            </div>
          </div>
        );
      }.bind(this)
    );

    return result;
  }

  createStaticComponents() {
    if (this.state.formData.keywords) {
      var keywordLinks = this.createMenuFilterLinks(
        this.state.formData.keywords,
        'keywords'
      );
    }

    if (this.state.formData.voi) {
      var voiLinks = this.createVOIElements(this.state.formData.voi);
    }
    return (
      <div>
        <StaticElement
          name="leadInvestigator"
          label="Lead Investigator"
          ref="leadInvestigator"
          text={this.state.formData.leadInvestigator}
        />
        <StaticElement
         name="leadInvestigatorEmail"
         label="Lead Investigator Email"
         ref="leadInvestigatorEmail"
         text={this.state.formData.leadInvestigatorEmail}
        />
        <StaticElement
          name="variablesOfInterest"
          label="Variables of Interest"
          ref="variablesOfInterest"
          text={voiLinks}
        />
        <StaticElement
          name="keywords"
          label="Keywords"
          ref="keywords"
          text={keywordLinks}
        />
        <StaticElement
          name="description"
          label="Description"
          ref="description"
          text={this.state.formData.description}
        />
      </div>
  );
  }

  createEditableComponents() {
    return (
      <div>
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
      </div>
    );
  }
  render() {
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


    // make approval status selectable and supply textbox in case
    // of proposal rejection
    let statusElement, rejectReason;
    if (loris.userHasPermission('publication_approve')) {
     statusElement = <SelectElement
        name="status"
        label="Status"
        id="status"
        value={this.state.formData.status}
        onUserInput={this.setFormData}
        required={true}
        options={this.state.statusOpts}
        emptyOption={false}
      />;

      if (this.state.formData.status === 'Rejected') {
        rejectReason = <TextboxElement
          name="rejectReason"
          label="Reason for rejection"
          value={this.state.formData.status}
          onUserInput={this.setFormData}
          required={true}
        />;
      }
    } else {
      const statClassMap = {
        'Pending': 'text-warning',
        'Approved': 'text-success',
        'Rejected': 'text-danger'
      };
      let s = this.state.formData.status;
      let statusText =(
        <span className={statClassMap[s]}>
          <strong>{s}</strong>
        </span>
      );
      statusElement = <StaticElement
        label="Status"
        text={statusText}
      />;
    }


    let formElements;
    if (this.state.userCanEdit) {
      formElements = this.createEditableComponents();
    } else {
      formElements = this.createStaticComponents();
    }

    // only display submit button if user has approval permission
    // or user can edit
    let submitBtn;
    if (loris.userHasPermission('publication_approve') || this.state.userCanEdit) {
      submitBtn = <ButtonElement
        name="Submit"
      />;
    }
    return (
      <div className="row">
        <div className="col-md-12 col-lg-12">
          <FormElement
            name="viewProject"
            onSubmit={this.handleSubmit}
            ref="form"
          >
            <div className="row">
              <div className="col-md-3"/>
              <h3 className="col-md-9">
                {this.state.formData.title}
              </h3>
            </div>
            {statusElement}
            {rejectReason}
            {formElements}
            {submitBtn}
          </FormElement>
        </div>
      </div>
    );
  }
}

export default ViewProject;