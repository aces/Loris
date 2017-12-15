class ViewProject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {},
      isLoaded: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {

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
          status: data.status
        };
        self.setState({
          formData: formData,
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

    return (
      <div className="row">
        <div className="col-md-8 col-lg-7">
          <FormElement
            name="viewProject"
            onSubmit={this.handleSubmit}
            ref="form"
          >
            <h3>{this.state.formData.title}</h3><br/>

            <StaticElement
              name="status"
              label="Status"
              ref="status"
              text={this.state.formData.status}
            />
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
              text='VOI'
            />
            <StaticElement
              name="keywords"
              label="Keywords"
              ref="keywords"
              text='k'
            />
            <StaticElement
              name="description"
              label="Description"
              ref="description"
              text={this.state.formData.description}
            />
          </FormElement>
        </div>
      </div>
    );
  }
}

export default ViewProject;