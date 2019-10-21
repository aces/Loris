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
        const data = {
          fieldOptions: json.fieldOptions,
          Data: json.data.map((e) => Object.values(e)),
          subprojects: json.subprojects,
          permissions: json.permissions,
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
    const state = Object.assign({}, this.state);
    state.upload.formData[formElement] = value;
    this.setState(state);
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
        case 'Subproject':
          reactElement = (
            <td>{this.state.data.subprojects[parseInt(cell)]}</td>
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
    let fieldOptions = this.state.data.fieldOptions;
    let fields = [];
    for (let field in fieldOptions) {
      if (fieldOptions.hasOwnProperty(field)) {
        if (fieldOptions[field].name === 'dob' ||
            fieldOptions[field].name === 'genomic_file_id' ||
            fieldOptions[field].name === 'inserted_by_user_id'
        ) {
          fields.push({
            label: fieldOptions[field].label,
            show: fieldOptions[field].hidden,
          });
        } else {
          fields.push({
            label: fieldOptions[field].label,
            show: fieldOptions[field].hidden,
            filter: {
              name: fieldOptions[field].name,
              type: fieldOptions[field].type,
              options: fieldOptions[field].options,
            },
          });
        }
      }
    }
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
