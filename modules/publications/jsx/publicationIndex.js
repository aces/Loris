import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';

class PublicationIndex extends React.Component {
  constructor(props) {
    super(props);


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
    console.log('component mounted');
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
        console.log(data);
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

  }

  render() {
    console.log('in render');
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
      },
      {
        id: "propose",
        label: "Propose a Project"
      }
    ];

    return (
      <Tabs tabs={tabList} defaultTab="browse" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          <FilterForm
            Module="publications"
            name="publications_filter"
            id="publications_filter_form"
            ref="publicationsFilter"
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
          />
        </TabPane>
      </Tabs>
    );
  }
}

$(function() {
  const publicationIndex = (
    <div className="page-publications">
      <PublicationIndex DataURL={`${loris.BaseURL}/publications/?format=json`}/>
    </div>
  );

  ReactDOM.render(publicationIndex, document.getElementById('lorisworkspace'));
});