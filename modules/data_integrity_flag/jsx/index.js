/* global ReactDOM */

import SetFlagForm from './setFlagForm';
import formatColumn from './columnFormatter';

class DataIntegrity extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      filter: {},
      formData: {}
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
        loris.flagStatusList = data.flagStatusList;
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
    // Waiting for async data to load
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

    const tabList = [
      {id: "browse", label: "Browse"},
      {id: "setflag", label: "Update"}
    ];

    return (
      <Tabs tabs={tabList} defaultTab="browse" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          <FilterForm
            Module={this.props.Module}
            name="data_integrity_filter"
            id="data_integrity_filter"
            columns={2}
            onUpdate={this.updateFilter}
            filter={this.state.filter}
          >
            <SelectElement
              name="visitLabel"
              label="Visit Label"
              options={this.state.Data.visits}
            />
            <SelectElement
              name="instrument"
              label="Instrument"
              options={this.state.Data.instruments}
            />
            <SelectElement
              name="userID"
              label="User"
              options={this.state.Data.users}
            />
            <SelectElement
              name="flagStatus"
              label="Flag Status"
              options={this.state.Data.flagStatusList}
            />
            <ButtonElement
              label="Clear Filters"
              type="reset"
            />
          </FilterForm>
          <StaticDataTable
            Data={this.state.Data.Data}
            Headers={this.state.Data.Headers}
            Filter={this.state.filter}
            getFormattedCell={formatColumn}
          />
        </TabPane>
        <TabPane TabId={tabList[1].id}>
          <SetFlagForm
            visits={this.state.Data.visits}
            instruments={this.state.Data.instruments}
            flagStatusList={this.state.Data.flagStatusList}
            updateData={this.fetchData}
          />
        </TabPane>
      </Tabs>
    );
  }
}

/**
 * Render dicom_page on page load
 */
$(function() {
  const dataURL = loris.BaseURL + "/data_integrity_flag/?format=json";
  const dataIntegrity = (
    <div id="page-data-integrity">
      <DataIntegrity
        Module="data_integrity_flag"
        DataURL={dataURL}
      />
    </div>
  );
  ReactDOM.render(dataIntegrity, document.getElementById("lorisworkspace"));
});
