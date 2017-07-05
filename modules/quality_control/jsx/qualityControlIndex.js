import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';

class QualityControlIndex extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

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
            name="quality_control_behavioural"
            id="quality_control_behavioural_filter"
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
      <QualityControlIndex UselessURL={`${loris.BaseURL}/quality_control/?format=json`}/>
    </div>
  );

  ReactDOM.render(qualityControlIndex, document.getElementById("lorisworkspace"));
});
