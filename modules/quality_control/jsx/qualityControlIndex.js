import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';
import formatColumnImg from './columnFormatterImg';



class QualityControlIndex extends React.Component {
    constructor(props) {

        loris.hiddenHeaders = ['CommentID', 'TarchiveID'];

        super(props);
        this.state = {
            isLoadedImg: false,
            isLoadedBehavioral: false,
            imgFilter: {},
            behavioralFilter: {},
        };
        this.fetchData = this.fetchData.bind(this);
        this.updateBehavioralFilter = this.updateBehavioralFilter.bind(this);
        this.updateImgFilter= this.updateImgFilter.bind(this);
    }
    componentDidMount(){
        this.fetchData("imaging");
        this.fetchData("behavioral")
    }
    fetchData(flag){
        if (flag == "imaging"){
            $.ajax(this.props.ImgDataURL, {
                method:"GET",
                dataType: "json",
                success: function(data){
                    console.log("Got Imaging Data");
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
                    console.log("Got Behavioral Data");
                    this.setState({
                        BehavioralData:data,
                        isLoadedBehavioral:true
                    });
                }.bind(this),
            });
        }
    }
    updateImgFilter(filter) {
        this.setState({
            imgFilter: filter,
            filter: filter
        });
    }
    updateBehavioralFilter(filter){
        this.setState({
            behavioralFilter: filter,
            filter: filter
        });
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
                    onUpdate={this.updateBehavioralFilter}
                    filter={this.state.behavioralFilter}>
                    <br/>
                    <ButtonElement type="reset" label="Clear Filters" />
                </FilterForm>
                <StaticDataTable
                    Data={this.state.BehavioralData.Data}
                    Headers={this.state.BehavioralData.Headers}
                    Filter={this.state.filter}
                />
            </TabPane>
        );

        let tab1 = (
            <TabPane TabId={tabList[1].id} >
                <FilterForm
                    Module="quality_control"
                    name="quality_control"
                    id="quality_control_filter"
                    columns={2}
                    formElements={this.state.ImgData.form}
                    onUpdate={this.updateImgFilter}
                    filter={this.state.imgFilter}>
                    <br/>
                    <ButtonElement type="reset" label="Clear Filters" />
                </FilterForm>
                <StaticDataTable
                    Data={this.state.ImgData.Data}
                    Headers={this.state.ImgData.Headers}
                    Filter={this.state.imgFilter}
                    getFormattedCell={formatColumnImg}
                />
            </TabPane>
        );
        return (
            <div>
                <Tabs id = "TabPanes" tabs={tabList} defaultTab={tabList[0].id}
                      updateURL={true}>
                    {tab0}
                    {tab1}
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
