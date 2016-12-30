/* exported ImagingUploader */
/* global formatColumn */

class ImagingUploader extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);

  }

  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrive data from the provided URL and save it in state
   * Additionaly add hiddenHeaders to global loris vairable
   * for easy access by columnFormatter.
   */
  fetchData() {
    $.ajax(this.props.DataURL, {
      method: "GET",
      dataType: 'json',
      success: function(data) {
        this.setState({
          Data: data,
          isLoaded: true
        });
      }.bind(this),
      error: function(error) {
        console.error(error);
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
      <div>
        <div className="row">
          <div className="col-md-6">
            <UploadPanel form={this.state.Data.form}/>
          </div>
          <div className="col-md-6">
            <LogPanel />
          </div>
        </div>
        <div id="mri_upload_table">
          <StaticDataTable
            Data={this.state.Data.Data}
            Headers={this.state.Data.Headers}
            getFormattedCell={formatColumn}
          />
        </div>
      </div>
    );
  }
}

ImagingUploader.propTypes = {};
ImagingUploader.defaultProps = {};
