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

  render() {

    let uploadTab;
    let tabList = [
        {id: "behavioral", label: "Behavioral"},
        {id: "imaging", label: "Imaging"}
    ];

    return (
      <Tabs tabs={tabList} defaultTab="behavioral" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          <FilterForm
            Module="quality_control"
            name="quality_control_behavioral_filter"
            id="quality_control_behavioral_filter"
            columns={2}
            formElements={this.state.Data.form}
            onUpdate={this.updateFilter}
            filter={this.state.filter}
          >
            <br/>
            <ButtonElement type="reset" label="Clear Filters" />
          </FilterForm>
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
      <QualityControlIndex UselessURL={`${loris.BaseURL}/quality_control`}/>
    </div>
  );

  ReactDOM.render(qualityControlIndex, document.getElementById("lorisworkspace"));
});

