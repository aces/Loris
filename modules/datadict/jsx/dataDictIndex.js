import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

import fetchDataStream from 'jslib/fetchDataStream';

import hiStrings from '../locale/hi/LC_MESSAGES/datadict.json';
import jaStrings from '../locale/ja/LC_MESSAGES/datadict.json';
import frStrings from '../locale/fr/LC_MESSAGES/datadict.json';

/**
 * Data Dictionary Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders Data Dictionary main page consisting of FilterTable and
 * DataTable components.
 *
 * @author Liza Levitis
 * @version 1.0.0
 */
class DataDictIndex extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      error: false,
      isLoaded: false,
      isLoading: false,
      fieldOptions: {'sourceFrom': {}},
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    // Load the field options. This comes from a separate request than the
    // table data stream. Once the fieldOptions are loaded, we set isLoaded
    // to true so that the page is displayed with the data that's been
    // retrieved.
    fetch(this.props.fieldsURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({fieldOptions: data, isLoaded: true}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
    this.fetchData();
  }

  /**
   * Retrive data from the provided URL and save it in state
   */
  fetchData() {
    fetchDataStream(this.props.dataURL,
      (row) => this.state.data.push(row),
      (end) => {
        this.setState({isLoading: !end, data: this.state.data});
      },
      () => {},
    );
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {array} rowData - array of cell contents for a specific row
   * @param {array} rowHeaders - array of table headers (column names)
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, rowData, rowHeaders) {
    const {t} = this.props;
    const hasEditPermission = loris.userHasPermission('data_dict_edit');
    if (column === t('Description', {ns: 'datadict'}) && hasEditPermission) {
      let updateDict = (rowdata) => {
        const name = rowdata.Name;
        return (e) => {
          e.stopPropagation();

          // Update the description of the selected field in the table.
          const arrayEquals = (first, second) => {
            return Array.isArray(first) &&
              Array.isArray(second) &&
              first.length === second.length &&
              first.every((val, index) => val === second[index]);
          };
          const findData = Object.values(rowdata);
          const state = Object.assign({}, this.state);
          for (let i=0; i<state.data.length; i++) {
            if (arrayEquals(state.data[i], findData)) {
              if (rowdata.Description !== e.target.valueOf().innerText) {
                rowdata['Description Status'] = 'Modified';
                rowdata.Description = e.target.valueOf().innerText;
                state.data[i] = Object.values(rowdata);
                this.setState(state);
              }
              break;
            }
          }

          // Update the description of the selected field in the backend.
          let formData = new FormData();
          formData.append('description', e.target.valueOf().innerText);
          formData.append('fieldname', name);
          fetch(loris.BaseURL + '/datadict/ajax/UpdateDataDict.php', {
            method: 'POST',
            body: formData,
          }).then((response) => {
            if (!response.ok) {
              console.error(response.status);
              return;
            }
          }).catch((error) => {
            console.error(error);
          });
        };
      };
      return (
        <td
          contentEditable="true"
          className="description"
          onBlur={updateDict(rowData)}>
          {cell}
        </td>
      );
    }
    return <td>{cell}</td>;
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;

    if (this.state.error) {
      return <h3>{t('An error occured while loading the page.',
        {ns: 'loris'})}</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    const options = this.state.fieldOptions;
    let fields = [
      {
        label: t('Source From', {ns: 'datadict'}),
        show: true,
        filter: {
          name: 'Source From',
          type: 'multiselect',
          options: options.sourceFrom,
        },
      },
      {
        label: t('Name', {ns: 'datadict'}),
        show: true,
        filter: {
          name: 'Name',
          type: 'text',
        },
      },
      {
        label: t('Source Field', {ns: 'datadict'}),
        show: true,
        filter: {
          name: 'Source Field',
          type: 'text',
        },
      },
      {
        label: t('Description', {ns: 'datadict'}),
        show: true,
        filter: {
          name: 'Description',
          type: 'text',
        },
      },
      {
        label: t('Description Status', {ns: 'datadict'}),
        show: true,
        filter: {
          name: 'DescriptionStatus',
          type: 'select',
          options: {
            'empty': t('Empty', {ns: 'datadict'}),
            'modified': t('Modified', {ns: 'datadict'}),
            'unchanged': t('Unchanged', {ns: 'datadict'}),
          },
        },
      },
      {
        label: t('Cohorts', {ns: 'datadict'}),
        show: true,
        filter: {
          name: 'Cohorts',
          type: 'multiselect',
          options: options.cohort,
        },
      },
    ];
    return (
      <FilterableDataTable
        name="datadict"
        data={this.state.data}
        fields={fields}
        loading={this.state.isLoading}
        getFormattedCell={this.formatColumn}
      />
    );
  }
}

DataDictIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  fieldsURL: PropTypes.string,
  t: PropTypes.func,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('hi', 'datadict', hiStrings);
  i18n.addResourceBundle('ja', 'datadict', jaStrings);
  i18n.addResourceBundle('fr', 'datadict', frStrings);
  const Index = withTranslation(
    ['datadict', 'loris']
  )(DataDictIndex);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <Index
      dataURL={`${loris.BaseURL}/datadict/?format=binary`}
      fieldsURL={`${loris.BaseURL}/datadict/fields`}
    />
  );
});
