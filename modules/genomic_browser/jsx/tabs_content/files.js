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
 * @author Alizée Wickenheiser
 * @version 1.0.0
 */
class Files extends Component {
  /**
   * Constructor of component
   *
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
    this.formatColumn = this.formatColumn.bind(this);
    this.openFileUploadModal = this.openFileUploadModal.bind(this);
    this.closeFileUploadModal = this.closeFileUploadModal.bind(this);
    this.renderFileUploadForm = this.renderFileUploadForm.bind(this);
    this.setFileUploadFormData = this.setFileUploadFormData.bind(this);
  }

  /**
   * Fetch data when component mounts.
   */
  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrieve data from the provided URL and save it in state.
   */
  fetchData() {
    fetch(`${this.props.baseURL}/genomic_browser/FileManager`,
      {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then((resp) => {
      if (resp.ok) {
        resp.json().then((json) => {
          const data = {
            fieldOptions: json.fieldOptions,
            Data: json.data.map((e) => Object.values(e)),
            cohorts: json.cohorts,
            permissions: json.permissions,
          };
          this.setState({
            data,
            isLoaded: true,
          });
        });
      } else {
        this.setState({error: true});
        console.error(resp.statusText);
      }
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
    const state = Object.assign({}, this.state);
    state.upload.formData[formElement] = value;
    this.setState(state);
  }

  /**
   * Open File Upload modal.
   */
  openFileUploadModal() {
    this.setState({showFileUploadModal: true});
  }

  /**
   * Close File Upload modal.
   */
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

  /**
   * Render File Upload Form
   *
   * @return {JSX} react upload form modal
   */
  renderFileUploadForm() {
    return (
      <Modal
        title='Upload File'
        onClose={this.closeFileUploadModal}
        show={this.state.showFileUploadModal}
      >
        <GenomicUploadForm
          permissions={this.state.data.permissions}
          baseURL={this.props.baseURL}
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
   * @return {*} a formatted table cell for a given column
   */
  formatColumn(column, cell, rowData, rowHeaders) {
    let reactElement;
    switch (column) {
      case 'Name':
        const fileName = rowData.Name.split('/').pop();
        const url =
          `${this.props.baseURL
        }/genomic_browser/FileManager?filename=${fileName}`;
        reactElement = <td><a href={url}>{fileName}</a></td>;
        break;
      case 'PSCID':
        const urlPscid = `${this.props.baseURL}/${rowData.DCCID}/`;
        reactElement = <td><a href={urlPscid}>{rowData.PSCID}</a></td>;
        break;
      case 'Cohort':
        reactElement = <td>{this.state.data.cohorts[parseInt(cell)]}</td>;
        break;
      default:
        reactElement = <td>{cell}</td>;
        break;
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

    // The filter options
    const options = this.state.data.fieldOptions;

    // The fields configured for display/hide.
    let fields = [
      {
        label: 'ID',
        show: false,
      },
      {
        label: 'Name',
        show: true,
        filter: {
          name: 'Name',
          type: 'text',
        },
      },
      {
        label: 'Description',
        show: true,
        filter: {
          name: 'Description',
          type: 'text',
        },
      },
      {
        label: 'Type',
        show: true,
        filter: {
          name: 'Type',
          type: 'text',
        },
      },
      {
        label: 'Date',
        show: true,
        filter: {
          name: 'Date',
          type: 'date',
        },
      },
      {
        label: 'Inserted by User',
        show: true,
      },
      {
        label: 'Caveat',
        show: true,
        filter: {
          name: 'Caveat',
          type: 'checkbox',
          options: options.caveat,
        },
      },
      {
        label: 'Notes',
        show: true,
        filter: {
          name: 'Notes',
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
      <React.Fragment>
        {this.renderFileUploadForm()}
        <FilterableDataTable
          name={'filterableDataTableFiles'}
          data={this.state.data.Data}
          fields={fields}
          getFormattedCell={this.formatColumn}
          actions={actions}
        />
      </React.Fragment>
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
  baseURL: PropTypes.string.isRequired,
};

export default Files;
