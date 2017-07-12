import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';
import formatColumn from './columnFormatter';

class QualityControlIndex extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoadedImg: false,
            isLoadedBehavioral: false,
            imgFilter: {},
            behavioralFilter:{},
        };


        this.fetchData = this.fetchData.bind(this);
        this.updateBehavioralFilter = this.updateBehavioralFilter.bind(this);
        this.updateImgFilter = this.updateImgFilter.bind(this);
    }
    componentDidMount(){
        this.fetchData("imaging");
        this.fetchData("behavioral");
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

                    this.setState({
                        ImgData: data,
                        isLoadedImg: true
                    });
                }.bind(this),
            });
        }else if (flag == "behavioral"){
            $.ajax(this.props.BehavioralDataURL, {
                method:"GET",
                dataType: "json",
                success: function(data){
                    this.setState({
                        BehavioralData: data,
                        isLoadedBehavioral: true
                    });
                }.bind(this),
            });
        }
    }

    changeData(){
        console.log("clicked tab");
    }

    updateBehavioralFilter(filter) {
        console.log(behavioralFilter);
        this.setState({behavioralFilter: filter});
    }

    updateImgFilter(filter) {
        this.setState({imgFilter: filter})
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
                    filter={this.state.behavioralFilter}
                    onUpdate={this.updateBehavioralFilter}
                >
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

        let tab1 = (
            <TabPane TabId={tabList[1].id}>
                <FilterForm
                    Module="quality_control"
                    name="quality_control"
                    id="quality_control_filter"
                    columns={2}
                    formElements={this.state.ImgData.form}
                    filter={this.state.imgFilter}>
                    onUpdate={this.updateImgFilter}
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