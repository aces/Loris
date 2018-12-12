import {Tabs, TabPane} from 'Tabs';
import DocUploadForm from './uploadForm';
import DocCategoryForm from './categoryForm';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

class DocIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      data: {},
      error: false,
    };

    /**
     * Set filter to the element's ref for filtering
     */
    this.filter = null;
    this.setFilterRef = (element) => {
      this.filter = element;
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrive data from the provided URL and save it in state
   * Additionaly add hiddenHeaders to global loris vairable
   * for easy access by columnFormatter.
   */
  fetchData() {
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({data}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
    });
  }

/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {arrray} rowData - array of cell contents for a specific row
 * @param {arrray} rowHeaders - array of table headers (column names)
 * @return {*} a formated table cell for a given column
 */
 formatColumn(column, cell, row) {
 const style = (row['Hide File'] === '1') ? 'bg-danger' : '';
 let result = <td className={style}>{cell}</td>;
    switch (column) {
    case 'File Name':
    let downloadURL = loris.BaseURL + '/document_repository/ajax/GetFile.php?File=' + encodeURIComponent(row['Data Dir']);
    result = (
      <td className= {classes}>
        <a href={downloadURL} target="_blank" download={row['File Name']}>
          {cell}
        </a>
      </td>
    );
      break;
    case 'Edit':
    let editURL = loris.BaseURL + '/document_repository/edit/?id=' + row['Edit'];
    result =  <td className={classes}><a href={editURL}>Edit</a></td>;
      break;
    case 'Delete':
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
    result =  <td className={classes}><a onClick={click}>Delete</a></td>
      break;
    }
    return result;
}

  render() {
    // If error occurs, return a message.
    // XXX: Replace this with a UI component for 500 errors.
    if (this.state.error) {
      return <h3>An error occured while loading the page.</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }
    const options = this.state.data.fieldOptions;
    const fields = [
      {label: 'File Name', show: true, filter: {
        name: 'fileName',
        type: 'text',
      }},
      {label: 'Version', show: true, filter: {
        name: 'version',
        type: 'text',
      }},
      {label: 'File Type', show: true, filter: {
        name: 'fileTypes',
        type: 'select',
        options: options.fileType,
      }},
      {label: 'For Site', show: true, filter: {
        name: 'sites',
        type: 'select',
        options: options.site,
      }},
      {label: 'Uploaded By', show: true, filter: {
        name: 'uploadedBy',
        type: 'text',
        }},
      {label: 'File Category', show: true, filter: {
        name: 'fileCategories',
        type: 'select',
        options: options.fileCategory,
      }},
    ];

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
            ref={this.setFilterRef}
            columns={2}
            formElements={this.state.Data.form}
            onUpdate={this.updateFilter}
            filter={this.state.filter}
          >
            <br/>
            <ButtonElement label="Clear Filters" type="reset" onUserInput={this.resetFilters}/>
          </FilterForm>
          <FilterableDataTable
            Name = "document"
            Data={this.state.data.Data}
            fields={fields}
            getFormattedCell={this.formatColumn}
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
