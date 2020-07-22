import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import swal from 'sweetalert2';

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
    this.editSwal = this.editSwal.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
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

  updateFilter(filter) {
      if (filter.Module) {
          this.setState({moduleFilter: filter.Module.value});
      } else {
          this.setState({moduleFilter: ''});
      }
  }

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

          const url = loris.BaseURL + '/datadict/fields/' + encodeURI(row['Field Name']);

          // The fetch happens asyncronously, which means that the
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
          onBlur={updateDict(rowData.Name)}>
            {cell}
        </td>
      );
    }
    return <td>{cell} <span style={{color: '#838383'}}>{edited} {editIcon} </span></td>;
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
                name: 'Source From',
                type: 'multiselect',
                options: options.sourceFrom,
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
    ];
    return (
        <FilterableDataTable
           name="datadict"
           data={this.state.data}
           fields={fields}
           loading={this.state.isLoading}
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
        dataURL={`${loris.BaseURL}/datadict/?format=binary`}
        fieldsURL={`${loris.BaseURL}/datadict/fields`}
      />,
      document.getElementById('lorisworkspace')
  );
});
