import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';
import formatColumn from './columnFormatter';

class QualityControlIndex extends React.Component {

  constructor(props) {
    super(props);

  this.state = {
    isLoaded: false,
    imgFilter: {},
    behavioralFilter:{},
  };


  this.fetchData = this.fetchData.bind(this);
  this.updateFilter= this.updateFilter.bind(this);
  }
  componentDidMount(){
    this.fetchData("imaging");
    this.fetchData("behavioral")
  }
  getSelectedTabIndex() { 
    return $("#TabPanes").tabs('option', 'selected');
  }

  fetchData(flag){
    if (flag == "imaging"){
    $.ajax(this.props.ImgDataURL, {
      method:"GET",
      dataType: "json",
      success: function(data){
        //console.log(getSelectedTabIndex());
        console.log("ajax call");

        this.setState({
          ImgData:data,
          isLoadedImg:true
        });
      }.bind(this),
    });
  }else if (flag == "behavioral"){
     $.ajax(this.props.BehavioralDataURL, {
      method:"GET",
      dataType: "json",
      success: function(data){
        //console.log(getSelectedTabIndex());
        console.log("ajax call");

        this.setState({
          BehavioralData:data,
          isLoadedBehavioral:true
        });
      }.bind(this),
    });
  }
}
  
  changeData(){
    console.log("clicked tab");
  }

  updateFilter(filter) {
    this.setState({filter});
  }

  render() {

    if (!this.state.isLoadedBehavioral || !this.state.isLoadedImg){
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
        {id: "behavioral", label: "Behavioral"},
        {id: "imaging", label:"Imaging"}
    ];
    
    let tab0 = (
        <TabPane TabId={tabList[0].id}>
          <FilterForm
            Module="quality_control"
            name="quality_control_behavioural"
            id="quality_control_behavioural_filter"
            columns={2}
            formElements={this.state.BehavioralData.form}
            onUpdate={this.updateFilter}
            filter={this.state.behavioralFilter}>
            <br/>
            <ButtonElement type="reset" label="Clear Filters" />
       </FilterForm>
          <StaticDataTable
            Data={this.state.BehavioralData.Data}
            Headers={this.state.BehavioralData.Headers}
            Filter={this.state.behavioralFilter}
          />
        </TabPane>
        );
    
    let tab3 = (
        <TabPane TabId={tabList[3].id} >
        <FilterForm
            Module="quality_control"
            name="quality_control"
            id="quality_control_filter"
            columns={2}
            formElements={this.state.ImgData.form}
            onUpdate={this.updateFilter}
            filter={this.state.imgFilter}>
            <br/>
            <ButtonElement type="reset" label="Clear Filters" />
       </FilterForm>
        <StaticDataTable
        Data={this.state.ImgData.Data}
        Headers={this.state.ImgData.Headers}
        Filter={this.state.imgFilter}

        />
        </TabPane>
    );

    return (
      <div> 
        <Tabs id = "TabPanes" tabs={tabList} defaultTab={tabList[0].id} 
          updateURL={true}>
          {tab0}
          {tab3}
        </Tabs> 
      </div>

    );
  }
}

$(function() {
  const qualityControlIndex = (
    <div className="page-qualityControl">
      <QualityControlIndex 
        ImgDataURL={`${loris.BaseURL}/quality_control/?format=json`} 
        BehavioralDataURL = {`${loris.BaseURL}/quality_control/?submenu=quality_control_behavioral&format=json`}/>
    </div>
  );

  ReactDOM.render(qualityControlIndex, document.getElementById("lorisworkspace"));
});
