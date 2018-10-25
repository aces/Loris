import SetFlagForm from './SetFlagForm';
import formatColumn from './columnFormatter';
import {Tabs, TabPane} from 'Tabs';
import FilterForm from 'FilterForm';

 /**
  * Data Integrity Flag
  *
  * Main module component rendering the tab pane with Browse and Update tabs
  *
  * @author Alex Ilea
  * @version 1.0.0
  *
  * */
class DataIntegrityFlag extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      filter: {},
      formData: {}
    };

    /**
     * Set filter to the element's ref for filtering
     */
    this.filter = null;
    this.setFilterRef = element => {
      this.filter = element;
    };

    /**
     * Bind component instance to custom methods
     */
    this.fetchData = this.fetchData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
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
    $.getJSON(this.props.DataURL, data => {
      loris.flagStatusList = data.flagStatusList;
      this.setState({
        Data: data,
        isLoaded: true
      });
    }).error(function(error) {
      console.error(error);
    });
  }

  updateFilter(filter) {
    this.setState({filter});
  }

  resetFilters() {
    this.filter.clearFilter();
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
            ref={this.setFilterRef}
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
              onUserInput={this.resetFilters}
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

export default DataIntegrityFlag;
