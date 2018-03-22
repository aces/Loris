import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';

class QualityControlIndex extends React.Component {
  constructor(props) {
    loris.hiddenHeaders = ['CommentID', 'TarchiveID'];

    super(props);
    this.state = {
      isLoadedImg: false,
      isLoadedBehavioral: false,
      imgFilter: {},
      behavioralFilter: {}
    };
    this.fetchData = this.fetchData.bind(this);
    this.updateBehavioralFilter = this.updateBehavioralFilter.bind(this);
    this.updateImgFilter = this.updateImgFilter.bind(this);
  }

  formatColumn(column, cell, rowData, rowHeaders) {
    // If a column if set as hidden, don't display it
    if (loris.hiddenHeaders.indexOf(column) > -1) {
      return null;
    }

    // Create the mapping between rowHeaders and rowData in a row object.
    var row = {};
    rowHeaders.forEach(function(header, index) {
      row[header] = rowData[index];
    }, this);

    if (column === "MRI Parameter Form") {
      var mpfURL = loris.BaseURL + '/mri_parameter_form/?commentID=' +
        row.CommentID + '&sessionID=' + row['Session ID'] +
        '&candID=' + row.DCCID;
      return <td> <a href={mpfURL}>{cell}</a> </td>;
    } else if (column === "Scan Location" && cell === "In Imaging Browser") {
      var imgURL = loris.BaseURL + '/imaging_browser/viewSession/?sessionID=' +
      row['Session ID'];
      return <td><a href={imgURL}>{cell}</a></td>;
    } else if (column === "Tarchive") {
      if (cell === "In DICOM") {
        var tarchiveURL = loris.BaseURL +
        '/dicom_archive/viewDetails/?tarchiveID=' + row.TarchiveID;
        return <td><a href = {tarchiveURL}>{cell}</a></td>;
      }
      return <td>Missing</td>;
    }

    return <td>{cell}</td>;
  }

  componentDidMount() {
    this.fetchData("imaging");
    this.fetchData("behavioral");
  }
  fetchData(flag) {
    if (flag === "imaging") {
      $.ajax(this.props.ImgDataURL, {
        method: "GET",
        dataType: "json",
        success: function(data) {
          this.setState({
            ImgData: data,
            isLoadedImg: true
          });
        }.bind(this)
      });
    } else if (flag === "behavioral") {
      $.ajax(this.props.BehavioralDataURL, {
        method: "GET",
        dataType: "json",
        success: function(data) {
          this.setState({
            BehavioralData: data,
            isLoadedBehavioral: true
          });
        }.bind(this)
      });
    }
  }
  updateImgFilter(filter) {
    this.setState({
      imgFilter: filter,
      filter: filter
    });
  }
  updateBehavioralFilter(filter) {
    this.setState({
      behavioralFilter: filter,
      filter: filter
    });
  }
  render() {
    if (!this.state.isLoadedBehavioral || !this.state.isLoadedImg) {
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
                columns={3}
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
                getFormattedCell={this.formatColumn}
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
