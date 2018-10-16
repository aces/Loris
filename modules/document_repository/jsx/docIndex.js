import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';
import DocUploadForm from './uploadForm';
import DocCategoryForm from './categoryForm';
class DocIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      filter: {},
      hiddenHeaders: ['Category', 'Data Dir'],
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
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
/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {arrray} rowData - array of cell contents for a specific row
 * @param {arrray} rowHeaders - array of table headers (column names)
 * @return {*} a formated table cell for a given column
 */
 formatColumn(column, cell, rowData, rowHeaders) {
  // If a column if set as hidden, don't display it
  if (this.state.hiddenHeaders.indexOf(column) > -1) {
    return null;
  }

  // Create the mapping between rowHeaders and rowData in a row object.
  let row = {};
  rowHeaders.forEach(function(header, index) {
    row[header] = rowData[index];
  }, this);

  // create array of classes to be added to td tag
  let classes = [];
    if (row['Hide File'] === '1') {
      classes.push('bg-danger');
    }
  // convert array to string, with blank space separator
  classes = classes.join(' ');
  if (column === 'File Name') {
    let downloadURL = loris.BaseURL + '/document_repository/ajax/GetFile.php?File=' + encodeURIComponent(row['Data Dir']);
    return (
      <td className= {classes}>
        <a href={downloadURL} target="_blank" download={row['File Name']}>
          {cell}
        </a>
      </td>
    );
  }
  if (column === 'Edit') {
    let editURL = loris.BaseURL + '/document_repository/edit/?id=' + row['Edit'];
    return <td className={classes}><a href={editURL}>Edit</a></td>;
  }
  if (column === 'Delete') {
    let id = row['Edit'];
function click() {
swal({
  title: 'Are you sure?',
  text: 'Your will not be able to recover this file!',
  type: 'warning',
  showCancelButton: true,
  confirmButtonClass: 'btn-danger',
  confirmButtonText: 'Yes, delete it!',
  closeOnConfirm: false,
},
function() {
  swal('Deleted!', 'Your file has been deleted.', 'success');
    $.ajax({
    url: loris.BaseURL + '/document_repository/ajax/documentDelete.php',
    type: 'POST',
    data: {id: id},
    success: function() {
    location.reload();
    },
    error: function(jqXHR, textStatus, errorThrown) {
    },
  });
});
}
    return <td className={classes}><a onClick={click}>Delete</a></td>;
  }
  return <td className={classes}>{cell}</td>;
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
            getFormattedCell={this.formatColumn}
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
            refreshPage={this.fetchData}
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
