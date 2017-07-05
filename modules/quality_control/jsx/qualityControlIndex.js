import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';
import formatColumn from './columnFormatter';

class QualityControlIndex extends React.Component {

  constructor(props) {
    super(props);

  this.state = {
    isloaded: false,
    //filter: {}
  };

  this.fetchData = this.fetchData.bind(this);
  //this.updateFilter= this.updateFilter.bind(this);
  }
  componentDidMount(){
    this.fetchData();
  }
  fetchData(){
    $.ajax(this.props.ImgDataURL, {
      method:"GET",
      dataType: "json",
      success: function(data){
        this.setState({
          Data:data,
          isLoaded:true
        });
      }.bind(this),
      error: function(error){
        console.error(error);
      }
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
        {id: "behavioral", label: "Behavioral"},
        {id: "imaging", label: "Imaging"}
    ];

    return (
      <Tabs tabs={tabList} defaultTab="behavioral" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
        </TabPane>
        <TabPane TabId={tabList[1].id}>
        <StaticDataTable
        Data={this.state.Data.data}
        Headers={this.state.Data.headers}
        getFormattedCell={formatColumn}
        freezeColumn="PatientName"
        />
        </TabPane>
      </Tabs>
    );
  }
}

$(function() {
  const qualityControlIndex = (
    <div className="page-qualityControl">
      <QualityControlIndex ImgDataURL={`${loris.BaseURL}/quality_control/ajax/imgQualityControl.php`}/>
    </div>
  );

  ReactDOM.render(qualityControlIndex, document.getElementById("lorisworkspace"));
});

