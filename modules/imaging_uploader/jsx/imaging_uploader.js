/* global formatColumn */

import LogPanel from './log_panel';
import UploadForm from './upload_form';
import formatColumn from './columnFormatter';

class ImagingUploader extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      filter: {}
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
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

  updateFilter(filter) {
    this.setState({filter});
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

    // Deep clone form data before passing it to upload form
    const uploadForm = JSON.parse(JSON.stringify(this.state.Data.form));

    const panelHeight = "200px";

    let tabList = [
      {id: "browse", label: "Browse"},
      {id: "upload", label: "Upload"}
    ];

    return (
      <Tabs tabs={tabList} defaultTab="browse" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          <div className="row">
            <div className="col-md-6">
              <FilterForm
                Module="imaging_uploader"
                name="imaging_filter"
                id="imaging_filter"
                onUpdate={this.updateFilter}
                filter={this.state.filter}
                height={panelHeight}
              >
                <TextboxElement {... this.state.Data.form.candID} />
                <TextboxElement {... this.state.Data.form.pSCID} />
                <SelectElement {... this.state.Data.form.visitLabel} />
              </FilterForm>
            </div>
            <div className="col-md-6">
              <LogPanel height={panelHeight}/>
            </div>
          </div>
          <div id="mri_upload_table">
            <StaticDataTable
              Data={this.state.Data.Data}
              Headers={this.state.Data.Headers}
              getFormattedCell={formatColumn}
              Filter={this.state.filter}
            />
          </div>
        </TabPane>
        <TabPane TabId={tabList[1].id}>
          <UploadForm form={uploadForm} />
        </TabPane>
      </Tabs>
    );
  }
}

ImagingUploader.propTypes = {};
ImagingUploader.defaultProps = {};

export default ImagingUploader;
