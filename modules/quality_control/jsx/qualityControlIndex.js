import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';
import formatColumn from './columnFormatter';

class QualityControlIndex extends React.Component {

  constructor(props) {
    super(props);

  this.state = {
    isloaded: false,
    filter: {}
  };

  this.fetchData = this.fetchData.bind(this);
  this.updateFilter= this.updateFilter.bind(this);
  }
  componentDidMount(){
    this.fetchData();
  }
  fetchData(){
    $.ajax(this.props.DataURL, {
      method:"GET",
      dataType: "json",
      success: function(data){
        console.log(data);
        this.setState({
          Data:data,
          isLoaded:true
        });
      }.bind(this),
    });
  }
  
  updateFilter(filter) {
    this.setState({filter});
  }

  render() {

    if (!this.state.isLoaded){
      return(
        <button className="btn-info has-spinner">
        Loading
        <span
          className="glyphicon glyphicon-refresh glyphicon-refresh-animate">
          </span>
          </button>
          );
    }

    let uploadTab;
    let tabList = [
        {id: "incomplete_forms", label: "Incomplete Forms"},
        {id: "data_conflicts", label: "Data Conflicts"},
        {id: "behavioural_feedback", label: "Behavioural Feedback"},
        {id: "imaging", label:"Imaging"}
    ];



    return (
      <div>
      <FilterForm
            Module="quality_control"
            name="quality_control_behavioural"
            id="quality_control_behavioural_filter"
            columns={2}
            formElements={this.state.Data.form}
            onUpdate={this.updateFilter}
            filter={this.state.filter}>
            <br/>
            <ButtonElement type="reset" label="Clear Filters" />
       </FilterForm>
      <Tabs tabs={tabList} defaultTab="behavioral" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          <StaticDataTable
            Data={this.state.Data.behaviouralData}
            Headers={this.state.Data.behaviouralHeaders}
            Filter={this.state.filter}
          />
        </TabPane>
        <TabPane TabId={tabList[1].id}>
        <StaticDataTable
        Data={this.state.Data.imgData}
        Headers={this.state.Data.imgHeaders}
        Filter={this.state.filter}
        getFormattedCell={formatColumn}
        freezeColumn="PatientName"
        />
        </TabPane>
      </Tabs>
      </div>
    );
  }
}

$(function() {
  const qualityControlIndex = (
    <div className="page-qualityControl">
      <QualityControlIndex DataURL={`${loris.BaseURL}/quality_control/ajax/qualityControl.php`}/>
    </div>
  );

  ReactDOM.render(qualityControlIndex, document.getElementById("lorisworkspace"));
});
