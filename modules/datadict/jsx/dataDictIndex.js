import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

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
   *
   * @return {object}
   */
    fetchData() {
        const processLines = async (data) => {
            const utf8Decoder = new TextDecoder('utf-8');
            let row = [];
            let colStart = -1;
            let rowStart = 0;
            for (let i = 0; i < data.length; i++) {
                switch (data[i]) {
                    case 0x1e: // end of column
                        const rowdata = data.slice(colStart+1, i);
                        const encoded = utf8Decoder.decode(rowdata);
                        colStart = i;
                        row.push(encoded);
                        continue;
                    case 0x1f: // end of row
                        const rowdata2 = data.slice(colStart+1, i);
                        const encoded2 = utf8Decoder.decode(rowdata2);
                        row.push(encoded2);
                        this.state.data.push(row);
                        rowStart = i+1;
                        colStart = i;
                        row = [];
                        continue;
                    case 0x04: // end of stream
                        // Force re-render
                        this.state.data.push(row);
                        return {remainder: [], eos: true};
                }
            }
            return {remainder: data.slice(rowStart), eos: false};
        };

        return (async () => {
            const response = await fetch(
                this.props.dataURL,
                {credentials: 'same-origin'},
            );
            const reader = response.body.getReader();

            let remainder = [];
            let doneLoop = false;
            while (!doneLoop) {
                await reader.read().then(({done, value}) => {
                        let combined;
                        if (remainder.length == 0) {
                            combined = value;
                        } else {
                            combined = new Uint8Array(
                                value.length + remainder.length
                            );
                            for (let i = 0; i < remainder.length; i++) {
                                combined[i] = remainder[i];
                            }
                            for (let i = 0; i < value.length; i++) {
                                combined[i+remainder.length] = value[i];
                            }
                        }
                        return processLines(combined);
                    }).then(({remainder: rem, eos}) => {
                        this.setState({isLoading: !eos, data: this.state.data});
                        doneLoop = eos;
                        remainder = rem;
                    })
                    .catch((err) => {
                        console.error(err);
                        doneLoop = true;
                    });
            };
    })();
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
                type: 'select',
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
