import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import swal from 'sweetalert2';

/**
 * Data Dictionary Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders Data Dictionary main page consisting of FilterTable and
 * DataTable components.
 */
class DataDictIndex extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      error: false,
      isLoaded: false,
      moduleFilter: '',
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.editSwal = this.editSwal.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData()
      .then( () => this.setState({isLoaded: true}));
  }

  /**
   * Update the filter to dynamically change the options in the
   * 'Category' dropdown based on the selected module.
   *
   * @param {object} filter - The current filter state
   */
  updateFilter(filter) {
      if (filter.Module) {
          this.setState({moduleFilter: filter.Module.value});
      } else {
          this.setState({moduleFilter: ''});
      }
  }

  /**
   * Display a sweetalert popup to modify the row
   *
   * @param {object} row - The row being modified
   *
   * @return {function} callback function for react to activate swal
   */
  editSwal(row) {
    return () => {
        swal.fire({
          title: 'Edit Description',
          input: 'text',
          inputValue: row.Description,
          confirmButtonText: 'Modify',
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'Missing description';
            }
          },
      }).then((result) => {
          if (!result.value) {
              return;
          }

          const url = this.props.BaseURL
              + '/dictionary/fields/'
              + encodeURI(row['Field Name']);

          // The fetch happens asynchronously, which means that the
          // swal closes before it returns. We find the index that
          // was being updated and aggressively update it, then
          // re-update or reset it when the PUT request returns.
          let i;
          let odesc;
          let ostat;
          for (i = 0; i < this.state.data.Data.length; i++) {
              if (this.state.data.Data[i][2] == row['Field Name']) {
                  // Store the original values in case the fetch
                  // fails and we need to restore them.
                  odesc = this.state.data.Data[i][3];
                  ostat = this.state.data.Data[i][4];

                  // Aggressively update the state and assume
                  // it's been modified.
                  this.state.data.Data[i][3] = result.value;
                  this.state.data.Data[i][4] = 'Modified';

                  // Force a re-render
                  this.setState({state: this.state});
                  break;
              }
          }

          fetch(url, {
                  method: 'PUT',
                  credentials: 'same-origin',
                  cache: 'no-cache',
                  body: result.value,
          }).then((response) => {
              if (!response.ok) {
                  // The response wasn't in the 200-299 range,
                  // so revert the update we did above and
                  // force a re-render.
                  this.state.data.Data[i][3] = odesc;
                  this.state.data.Data[i][4] = ostat;

                  // Force a re-render
                  this.setState({state: this.state});
                  return;
              }

              // The response to the PUT request said we're
              // good, but it's possible the status was changed
              // back to the original. So update the status
              // based on what the response said the value was.
              this.state.data.Data[i][4] = response.headers.get('X-StatusDesc');
              this.setState({state: this.state});
          }).catch(() => {
              // Something went wrong, restore the original
              // status and description
              this.state.data.Data[i][3] = odesc;
              this.state.data.Data[i][4] = ostat;

              // Force a re-render
              this.setState({state: this.state});
          });
      });
    };
  }

  /**
   * Retrieve data from the provided URL and save it in state
   *
   * @return {object}
   */
  fetchData() {
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
        .then((resp) => {
              if (!resp.ok) {
                  throw new Error('invalid response');
              }
              return resp.json();
        })
        .then((data) => {
            this.setState({data});
        })
        .catch((error) => {
            this.setState({error: true});
            console.error(error);
        });
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
    const hasEditPermission = loris.userHasPermission('data_dict_edit');
    let editIcon = '';
    let edited='';
    switch (column) {
    case 'Description':
      if (hasEditPermission) {
          editIcon = (<i className="fas fa-edit"
            style={{cursor: 'pointer'}}
            onClick={this.editSwal(rowData)}>
          </i>);
      }

      if (rowData['Description Status'] == 'Modified') {
          edited = <span>(edited)</span>;
      }
      return <td>{cell}
            <span style={{color: '#838383'}}>{edited} {editIcon} </span>
      </td>;
    case 'Data Type':
      if (cell == 'enumeration') {
          cell = rowData['Field Options'].join(';');
      }
      return <td>{cell}</td>;
    default:
      return <td>{cell}</td>;
    }
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

    let options = this.state.data.fieldOptions;
    let fields = [
        {
            label: 'Module',
            show: true,
            filter: {
                name: 'Module',
                type: 'select',
                options: options.modules,
            },
        },
        {
            label: 'Category',
            show: false,
            filter: {
                name: 'Category',
                type: 'select',
                options: this.state.moduleFilter == ''
                    ? {}
                    : options.categories[this.state.moduleFilter],
            },
        },
        {
            label: 'Field Name',
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
            label: 'Description Status',
            show: false,
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
        {
            label: 'Data Scope',
            show: true,
            filter: {
                name: 'datascope',
                type: 'select',
                options: {
                    'candidate': 'Candidate',
                    'session': 'Session',
                    'project': 'Project',
                },
            },
        },
        {
            label: 'Data Type',
            show: true,
            filter: {
                name: 'datatype',
                type: 'text',
            },
        },
        {
            label: 'Data Cardinality',
            show: true,
            filter: {
                name: 'cardinality',
                type: 'select',
                options: {
                    'unique': 'Unique',
                    'single': 'Single',
                    'optional': 'Optional',
                    'many': 'Many',
                },
            },
        },
        {
            // We may or may not have an 8th column depending
            // on type, which we need for formatting other columns.
            // We don't show or display a filter because it's only
            // valid for some data types.
            label: 'Field Options',
            show: false,
            filter: null,
        },
    ];
    return (
        <FilterableDataTable
           name="dictionary"
           data={this.state.data.Data}
           fields={fields}
           getFormattedCell={this.formatColumn}
           updateFilterCallback={this.updateFilter}
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
        dataURL={`${loris.BaseURL}/dictionary/?format=json`}
        BaseURL={loris.BaseURL}
      />,
      document.getElementById('lorisworkspace')
  );
});
