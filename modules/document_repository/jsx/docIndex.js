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
      newCategory: false,
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
    this.newCategoryState = this.newCategoryState.bind(this);
  }
   newCategoryState() {
        this.setState({newCategory: true});
    }
  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  fetchData() {
    return fetch(this.props.DataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({data}))
      .then(()=>this.setState({newCategory: false}))
      .catch((error) => {
        this.setState({error: true});
    });
  }
/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {arrray} row - array of cell contents for a specific row
 * @return {*} a formated table cell for a given column
 */
 formatColumn(column, cell, row) {
 const style = (row['Hide File'] === '1') ? 'bg-danger' : '';
 let result = <td className={style}>{cell}</td>;
    switch (column) {
    case 'File Name':
    let downloadURL = loris.BaseURL + '/document_repository/ajax/GetFile.php?File=' + encodeURIComponent(row['Data Dir']);
    result = (
      <td className= {style}>
        <a href={downloadURL} target="_blank" download={row['File Name']}>
          {cell}
        </a>
      </td>
    );
      break;
    case 'Edit':
    let editURL = loris.BaseURL + '/document_repository/edit/?id=' + row['Edit'];
    result = <td className={style}><a href={editURL}>Edit</a></td>;
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
    result = <td className={style}><a onClick={click}>Delete</a></td>;
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
        options: options.fileTypes,
     }},
      {label: 'Instrument', show: false},
      {label: 'Uploaded By', show: true, filter: {
        name: 'uploadedBy',
        type: 'text',
        }},
      {label: 'For Site', show: true, filter: {
        name: 'site',
        type: 'select',
        options: options.sites,
      }},
      {label: 'Comments', show: false},
      {label: 'Date Upload', show: false},
      {label: 'editID', show: false},
      {label: 'deleteID', show: false},
      {label: 'File Category', show: true, filter: {
        name: 'fileCategories',
        type: 'select',
        options: options.fileCategories,
      }},
      {label: 'Category', show: false},
      {label: 'Data Dir', show: false},
    ];

    let tabList = [
      {id: 'browse', label: 'Browse'},
      {id: 'upload', label: 'Upload'},
      {id: 'category', label: 'Category'},
    ];
    return (
      <Tabs tabs={tabList} defaultTab="browse" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          <FilterableDataTable
            name = "document"
            data={this.state.data.Data}
            fields={fields}
            getFormattedCell={this.formatColumn}
          />
        </TabPane>
        <TabPane TabId={tabList[1].id}>
          <DocUploadForm
            DataURL={`${loris.BaseURL}/document_repository/?format=json`}
            action={`${loris.BaseURL}/document_repository/Uploadfile`}
            maxUploadSize={this.state.data.maxUploadSize}
            refreshPage={this.fetchData}
            category={this.state.newCategory}
          />
        </TabPane>
        <TabPane TabId={tabList[2].id}>
          <DocCategoryForm
            DataURL={`${loris.BaseURL}/document_repository/ajax/FileUpload.php?action=getCategory`}
            action={`${loris.BaseURL}/document_repository/ajax/FileUpload.php?action=uploadCategory`}
            refreshPage={this.fetchData}
            newCategoryState={this.newCategoryState}
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
