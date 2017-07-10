import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';

class QualityControlIndex extends React.Component {

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


    let tabList = [
        {id: "behavioral", label: "Behavioral"},
        {id: "imaging", label: "Imaging"}
    ];

    let tabBehaviouralList = [
        {id: "incomplete_forms", label: "Incomplete Forms"},
        {id: "data_conflicts", label: "Data Conflicts"},
        {id: "behavioural_feedback", label: "Behavioural Feedback"}
    ];



    return (
      <Tabs tabs={tabList} defaultTab="behavioral" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          <FilterForm
            Module="quality_control"
            name="quality_control"
            id="quality_control"
            columns={2}
            formElements={this.state.Data.form}
            onUpdate={this.updateFilter}
            filter={this.state.filter}
          >
            <br/>
            <ButtonElement type="reset" label="Clear Filters" />
          </FilterForm>
          <StaticDataTable
            Data={this.state.Data.Data}
            Headers={this.state.Data.Headers}
            Filter={this.state.filter}
          />
        </TabPane>
        <TabPane TabId={tabList[1].id}>
        </TabPane>
      </Tabs>
    );
  }
}

$(function() {
  const qualityControlIndex = (
    <div className="page-qualityControl">
      <QualityControlIndex DataURL={`${loris.BaseURL}/quality_control/?format=json`}/>
    </div>
  );

  ReactDOM.render(qualityControlIndex, document.getElementById("lorisworkspace"));
});
