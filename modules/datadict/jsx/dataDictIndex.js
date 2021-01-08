import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

import fetchDataStream from 'jslib/fetchDataStream';

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
 *
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
   *
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, rowData, rowHeaders) {
    const hasEditPermission = loris.userHasPermission('data_dict_edit');
    if (column === 'Description' && hasEditPermission) {
      let updateDict = (name) => {
        return (e) => {
          e.stopPropagation();

          let value = e.target.valueOf().innerText;
          $.post(loris.BaseURL + '/datadict/ajax/UpdateDataDict.php', {
            fieldname: name, description: value,
          }, (data) => {});
        };
      };
      return (
        <td
          contentEditable="true"
          className="description"
          onBlur={updateDict(rowData.Name)}>
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
    if (this.state.error) {
        return <h3>An error occured while loading the page.</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    const options = this.state.fieldOptions;
    let fields = [
        {
            label: 'Source From',
            show: true,
            filter: {
                name: 'Source From',
                type: 'multiselect',
                options: options.sourceFrom,
            },
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
            label: 'Source Field',
            show: true,
            filter: {
                name: 'Source Field',
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
            label: 'Description Status',
            show: true,
            filter: {
                name: 'DescriptionStatus',
                type: 'select',
                options: {
                    'empty': 'Empty',
                    'modified': 'Modified',
                    'unchanged': 'Unchanged',
                },
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
};

window.addEventListener('load', () => {
  ReactDOM.render(
      <DataDictIndex
        dataURL={`${loris.BaseURL}/datadict/?format=binary`}
        fieldsURL={`${loris.BaseURL}/datadict/fields`}
      />,
      document.getElementById('lorisworkspace')
  );
});
