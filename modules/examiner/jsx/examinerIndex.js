import React, {Component} from 'react';
import PropTypes from 'prop-types';

import swal from 'sweetalert2';
import Modal from 'Modal';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

/**
 * Examiner Module Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders Examiner main page consisting of FilterableDataTable and FormElement.
 *
 * @author Victoria Foing, Zaliqa Rosli
 * @version 1.0.0
 *
 */
class ExaminerIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      error: false,
      isLoaded: false,
      formData: {
        addName: null,
        addRadiologist: false,
        addSite: null,
      },
      showModal: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.renderAddExaminerForm = this.renderAddExaminerForm.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve data from the provided URL and save it in state
   * Additionally add hiddenHeaders to global loris variable
   * for easy access by columnFormatter.
   *
   * @return {object}
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
   * Store the value of the element in this.state.formData
   *
   * @param {string} formElement - name of the form element
   * @param {string} value - value of the form element
   */
  setFormData(formElement, value) {
    let formData = this.state.formData;
    formData[formElement] = value;
    this.setState({
      formData: formData,
    });
  }

  /**
   * Handles the submission of the Add Examiner form
   *
   * @param {event} e - event of the form
   */
  handleSubmit(e) {
    let formData = this.state.formData;
    let formObject = new FormData();
    for (let key in formData) {
      if (formData[key] !== '') {
        formObject.append(key, formData[key]);
      }
    }
    formObject.append('fire_away', 'Add');

    fetch(this.props.submitURL, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      body: formObject,
    })
    .then((resp) => {
      if (resp.ok && resp.status === 200) {
        swal('Success!', 'Examiner added.', 'success').then((result) => {
          if (result.value) {
            this.fetchData();
          }
        });
      } else {
        resp.text().then((message) => {
          swal('Error!', message, 'error');
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   *
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, row) {
    let result = <td>{cell}</td>;

    switch (column) {
      case 'Examiner':
        const url = loris.BaseURL + '/examiner/editExaminer/?identifier=' +
                  row.ID;
        result = <td><a href={url}>{cell}</a></td>;
        break;
      case 'Radiologist':
        if (row.Radiologist === '1') {
          result = <td>Yes</td>;
        } else if (row.Radiologist === '0') {
          result = <td>No</td>;
        }
        break;
      case 'Certification':
        if (row.Certification === null) {
          result = <td>None</td>;
        }
        break;
    }
    return result;
  }

  openModal() {
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({showModal: false});
  }

  renderAddExaminerForm() {
    return (
      <Modal
        title='Add Examiner'
        onClose={this.closeModal}
        show={this.state.showModal}
      >
        <FormElement
          Module="examiner"
          name="addExaminer"
          id="addExaminerForm"
          onSubmit={this.handleSubmit}
          method="POST"
        >
          <TextboxElement
            name="addName"
            label="Name"
            value={this.state.formData.addName}
            required={true}
            onUserInput={this.setFormData}
          />
          <SelectElement
            name="addSite"
            options={this.state.data.fieldOptions.sites}
            label="Site"
            value={this.state.formData.addSite}
            required={true}
            onUserInput={this.setFormData}
          />
          <CheckboxElement
            name="addRadiologist"
            label="Radiologist"
            id="checkRadiologist"
            value={this.state.formData.addRadiologist}
            onUserInput={this.setFormData}
          />
          <ButtonElement
            name="fire_away"
            label={
              <div>
                <span className="glyphicon glyphicon-plus"/> Add
              </div>
            }
            type="submit"
            buttonClass="btn btn-sm btn-success"
          />
        </FormElement>
      </Modal>
    );
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

   /**
    * XXX: Currently, the order of these fields MUST match the order of the
    * queried columns in _setupVariables() in examiner.class.inc
    */
    const options = this.state.data.fieldOptions;
    const fields = [
      {label: 'Examiner', show: true, filter: {
        name: 'examiner',
        type: 'text',
      }},
      {label: 'ID', show: false},
      {label: 'Site', show: true, filter: {
        name: 'site',
        type: 'select',
        options: options.sites,
      }},
      {label: 'Radiologist', show: true, filter: {
        name: 'radiologist',
        type: 'select',
        options: options.radiologists,
      }},
      {label: 'Certification', show: this.state.data.useCertification},
    ];
    const actions = [
      {name: 'addExaminer', label: 'Add Examiner', action: this.openModal},
    ];

    return (
      <div>
        {this.renderAddExaminerForm()}
        <FilterableDataTable
          name='examiner'
          title='Examiner'
          data={this.state.data.Data}
          fields={fields}
          getFormattedCell={this.formatColumn}
          actions={actions}
        />
      </div>
    );
  }
}

ExaminerIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <ExaminerIndex
      dataURL={`${loris.BaseURL}/examiner/?format=json`}
      submitURL={`${loris.BaseURL}/examiner/`}
      hasPermission={loris.userHasPermission}
    />,
    document.getElementById('lorisworkspace')
  );
});
