/* global ReactDOM */

import MediaUploadForm from './uploadForm';
import formatColumn from './columnFormatter';

class MediaIndex extends React.Component {

  constructor(props) {
    super(props);

    loris.hiddenHeaders = ['Cand ID', 'Session ID', 'File Type'];

    this.state = {
      isLoaded: false,
      filter: {}
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
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

  render() {
    // Waiting for async data to load
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
      {id: "browse", label: "Browse"},
      {id: "upload", label: "Upload"}
    ];

    return (
      <Tabs tabs={tabList} defaultTab="browse" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          <FilterForm
            Module="media"
            name="media_filter"
            id="media_filter"
            columns={3}
            formElements={this.state.Data.form}
            onUpdate={this.updateFilter}
            filter={this.state.filter}
          />
          <StaticDataTable
            Data={this.state.Data.Data}
            Headers={this.state.Data.Headers}
            Filter={this.state.filter}
            getFormattedCell={formatColumn}
            freezeColumn="File Name"
          />
        </TabPane>
        <TabPane TabId={tabList[1].id}>
          <MediaUploadForm
            DataURL={`${loris.BaseURL}/media/ajax/FileUpload.php?action=getData`}
            action={`${loris.BaseURL}/media/ajax/FileUpload.php?action=upload`}
          />
        </TabPane>
      </Tabs>
    );
  }
}

$(function() {
  ReactDOM.render(
    <MediaIndex DataURL={`${loris.BaseURL}/media/?format=json`}/>,
    document.getElementById("page-wrapper")
  );
});

//
// $(function() {
//   loris.hiddenHeaders = ['Cand ID', 'Session ID'];
//
//   var table = <DynamicDataTable
//     DataURL={`${loris.BaseURL}/media/?format=json`}
//     getFormattedCell={formatColumn}
//     freezeColumn="File Name"
//   />;
//
//   ReactDOM.render(table, document.getElementById("datatable"));
//
//   var mediaUploadForm = <MediaUploadForm
//     DataURL={`${loris.BaseURL}/media/ajax/FileUpload.php?action=getData`}
//     action={`${loris.BaseURL}/media/ajax/FileUpload.php?action=upload`}
//   />;
//
//   ReactDOM.render(mediaUploadForm, document.getElementById("media-upload-form"));
//
//   // Adds tab href to url + opens tab based on hash on page load
//   // See: http://bit.ly/292MDI8
//   var hash = window.location.hash;
//   if (hash) $('ul.nav a[href="' + hash + '"]').tab('show');
//
//   $('.nav-tabs a').click(function(e) {
//     $(this).tab('show');
//     var scrollmem = $('body').scrollTop() || $('html').scrollTop();
//     window.location.hash = this.hash;
//     $('html,body').scrollTop(scrollmem);
//   });
// });
