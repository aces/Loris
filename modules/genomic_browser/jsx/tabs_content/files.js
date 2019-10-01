import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Modal from 'jsx/Modal';
import FilterableDataTable from 'jsx/FilterableDataTable';
import GenomicUploadForm from './filemanager/uploadForm';
import Loader from 'jsx/Loader';

/**
 * Files Component.
 *
 * @description Genomic Browser Files tab.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class Files extends Component {
  /**
   * Constructor of component
   * @param {object} props - the component properties.
   */
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      fieldOptions: {},
      error: false,
      isLoaded: false,
      showFileUploadModal: false,
      upload: {
        formData: {
          fileType: '',
          fileDescription: '',
        },
      },
    };
    this.fetchData = this.fetchData.bind(this);
    this.openFileUploadModal = this.openFileUploadModal.bind(this);
    this.closeFileUploadModal = this.closeFileUploadModal.bind(this);
    this.renderFileUploadForm = this.renderFileUploadForm.bind(this);
    this.setFileUploadFormData = this.setFileUploadFormData.bind(this);
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve data from the provided URL and save it in state.
   *
   * @return {object}
   */
  fetchData() {
    return fetch(window.location.origin + '/genomic_browser/FileManager',
      {credentials: 'same-origin'}
    )
      .then((resp) => resp.json())
      .then((json) => {
        console.log(json);
        const data = {
          fieldOptions: json.fieldOptions,
          Data: json.data.map((e) => Object.values(e)),
          subprojects: json.subprojects,
        };
        this.setState({data});
      }).catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }
  /**
   * Store the value of the element in this.state.upload.formData
   *
   * @param {string} formElement - name of the form element
   * @param {string} value - value of the form element
   */
  setFileUploadFormData(formElement, value) {
    console.log('setFileUploadFormData');
    const state = Object.assign({}, this.state);
    state.upload.formData[formElement] = value;
    this.setState(state);
  }
  handleFileUpload() {
    console.log('handleFileUpload');
  }

  openFileUploadModal() {
    this.setState({showFileUploadModal: true});
  }
  closeFileUploadModal() {
    this.setState({
      upload: {
        formData: {
          fileType: '',
          fileDescription: '',
        },
      },
      showFileUploadModal: false,
    });
  }
  renderFileUploadForm() {
    return (
      <Modal
        title='Upload File'
        onClose={this.closeFileUploadModal}
        show={this.state.showFileUploadModal}
      >
        <GenomicUploadForm
          permissions={this.state.data.permissions}
        />
      </Modal>
    );
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {array} rowData - array of cell contents for a specific row
   * @param {array} rowHeaders - array of table headers (column names)
   *
   * @return {*} a formatted table cell for a given column
   */
  formatColumn(column, cell, rowData, rowHeaders) {
    let reactElement = null;
    if (true) {
      switch (column) {
        case 'PSCID':
          const url = window.location.origin + '/' + rowData.DCCID + '/';
          reactElement = (
            <td><a href={url}>{rowData.PSCID}</a></td>
          );
          break;
        default:
          reactElement = (
            <td>{cell}</td>
          );
          break;
      }
    }
    return reactElement;
  }

  /**
   * @return {DOMRect}
   */
  render() {
    // Waiting for async data to load.
    if (!this.state.isLoaded) {
      return <Loader/>;
    }
    // const options = this.state.data.fieldOptions;
    const fields = [
      // Genomic File Filters
      {
        label: 'GenomicFileID', show: false, filter: {
          name: 'genomic_file_id',
          type: 'text',
        },
      },
      {
        label: 'Name', show: true, filter: {
          name: 'file_name',
          type: 'text',
        },
      },
      {
        label: 'Description', show: true, filter: {
          name: 'description',
          type: 'text',
        },
      },
      {
        label: 'Type', show: true, filter: {
          name: 'genomic_file_type',
          type: 'text',
        },
      },
      {
        label: 'Date inserted', show: true, filter: {
          name: 'date_inserted',
          type: 'text',
        },
      },
      {
        label: 'InsertedByUserID', show: false, filter: {
          name: 'InsertedByUserID',
          type: 'text',
        },
      },
      {
        label: 'Caveat', show: true, filter: {
          name: 'caveat',
          type: 'checkbox',
        },
      },
      {
        label: 'Notes', show: true, filter: {
          name: 'notes',
          type: 'text',
        },
      },
    ];
    const actions = [{
      name: 'uploadFile',
      label: 'Upload File',
      action: this.openFileUploadModal,
    }];
    return (
      <div>
        {this.renderFileUploadForm()}
         <FilterableDataTable
          name={'filterableDataTableFiles'}
          data={this.state.data.Data}
          fields={fields}
          getFormattedCell={this.formatColumn}
          actions={actions}
         />
      </div>
    );
  }
}
Files.defaultProps = {
  display: false,
  data: null,
};

Files.propTypes = {
  display: PropTypes.bool,
  data: PropTypes.object,
};

export default Files;
