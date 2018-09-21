import FilterForm from 'FilterForm';
import formatColumn from './columnFormatter';
import {Tabs, TabPane} from 'Tabs';
import DocUploadForm from './uploadForm';
import DocCategoryForm from './categoryForm';
class DocIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      filter: {},
      refresh: 1,
    };

    // Bind component instance to custom methods
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
    $.ajax(this.props.DataURL, {
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        this.setState({
          Data: data,
          isLoaded: true,
          refresh: 1,
        });
      }.bind(this),
      error: function(error) {
        console.error(error);
      },
    });
  }

  updateFilter(filter) {
    this.setState({filter});
  }

  resetFilters() {
    this.refs.documentFilter.clearFilter();
  }

  render() {
    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return (
        <button className="btn-info has-spinner">
          Loading
        </button>
      );
    }
    let tabList = [
      {id: 'browse', label: 'Browse'},
      {id: 'upload', label: 'Upload'},
      {id: 'category', label: 'Category'},
    ];
    return (
      <Tabs tabs={tabList} defaultTab="browse" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          <FilterForm
            Module="document_repository"
            name="document_filter"
            id="document_filter_form"
            ref="documentFilter"
            columns={2}
            formElements={this.state.Data.form}
            onUpdate={this.updateFilter}
            filter={this.state.filter}
          >
            <br/>
            <ButtonElement label="Clear Filters" type="reset" onUserInput={this.resetFilters}/>
          </FilterForm>
          <StaticDataTable
            Data={this.state.Data.Data}
            Headers={this.state.Data.Headers}
            Filter={this.state.filter}
            getFormattedCell={formatColumn}
            freezeColumn="File Name"
            refreshPage={this.fetchData}
          />
        </TabPane>
        <TabPane TabId={tabList[1].id}>
          <DocUploadForm
            DataURL={`${loris.BaseURL}/document_repository/ajax/FileUpload.php?action=getData`}
            action={`${loris.BaseURL}/document_repository/ajax/FileUpload.php?action=upload`}
            maxUploadSize={this.state.Data.maxUploadSize}
            refreshPage={this.fetchData}
          />
        </TabPane>
        <TabPane TabId={tabList[2].id}>
          <DocCategoryForm
            DataURL={`${loris.BaseURL}/document_repository/ajax/FileUpload.php?action=getCategory`}
            action={`${loris.BaseURL}/document_repository/ajax/FileUpload.php?action=uploadCategory`}
          />
        </TabPane>
      </Tabs>
    );
  }
}

$(function() {
  const docIndex = (
    <div className="page-document">
      <DocIndex DataURL={`${loris.BaseURL}/document_repository/?format=json`} />
    </div>
  );

  ReactDOM.render(docIndex, document.getElementById('lorisworkspace'));
});
