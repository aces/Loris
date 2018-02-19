import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';
import PublicationUploadForm from './uploadForm.js';
import formatColumn from './columnFormatter';

class PublicationIndex extends React.Component {
  constructor(props) {
    super(props);
    loris.hiddenHeaders = ['Description', 'Keywords', 'Variables Of Interest', 'Publication ID'];
    this.state = {
      isLoaded: false,
      filter: {}
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

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

  resetFilters() {
    this.publicationsFilter.clearFilter();
  }

  render() {
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
      {
        id: "browse",
        label: "Browse"
      }
    ];
    let proposalTab;
    if (loris.userHasPermission('publication_propose')) {
      tabList.push({
          id: "propose",
          label: "Propose a Project"
        });

      proposalTab = (
        <TabPane TabId={tabList[1].id}>
          <PublicationUploadForm
            DataURL={`${loris.BaseURL}/publication/ajax/getData.php?action=getData`}
            action={`${loris.BaseURL}/publication/ajax/FileUpload.php?action=upload`}
          />
        </TabPane>
      );
    }

    const filterRef = function(f) {
      this.publicationsFilter = f;
    }.bind(this);

    return (
      <Tabs tabs={tabList} defaultTab="browse" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          <FilterForm
            Module="publication"
            name="publications_filter"
            id="publications_filter_form"
            ref={filterRef}
            columns={3}
            formElements={this.state.Data.form}
            onUpdate={this.updateFilter}
            filter={this.state.filter}
          >
            <br/>
            <ButtonElement
              label="Clear Filters"
              type="reset"
              onUserInput={this.resetFilters}
            />
          </FilterForm>
          <StaticDataTable
            Data={this.state.Data.Data}
            Headers={this.state.Data.Headers}
            Filter={this.state.filter}
            getFormattedCell={formatColumn}
          />
        </TabPane>
        {proposalTab}
      </Tabs>
    );
  }
}

$(function() {
  const publicationIndex = (
    <div className="page-publications">
      <PublicationIndex DataURL={`${loris.BaseURL}/publication/?format=json`}/>
    </div>
  );

  ReactDOM.render(publicationIndex, document.getElementById('lorisworkspace'));
});