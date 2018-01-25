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
          status: data.status,
          voi: data.voi,
          keywords: data.keywords
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
  
  generateLinks() {
    
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
    if (this.state.formData.keywords) {
      var keywordArr = this.state.formData.keywords.split(',');
      var keywordLinks = [];
      keywordArr.forEach(
        function (kw) {
          keywordLinks.push(
            <span>
            <a
              href={loris.BaseURL + "/publication/?keywords="+kw}
            >
              {kw}
            </a>
            ; &nbsp;
          </span>
          );
        }
      );
    }
    
    if (this.state.formData.voi) {
      var voiArr = this.state.formData.voi.split(',');
      var voiLinks = [];
      
      voiArr.forEach(function(v){
        voiLinks.push(
            <span>
              <a
                href={loris.BaseURL + "/publication/?voi="+ v}
              >
                {v}
              </a>
              ; &nbsp;
            </span>
        );
      })
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
          </FormElement>
        </div>
      </div>
    );
  }
}

export default ViewProject;