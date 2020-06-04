import FilterableDataTable from 'FilterableDataTable';
import Loader from 'Loader';
import PropTypes from 'prop-types';
/**
 * Help Editor Archive Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders Help Editor main page consisting of FilterForm and
 * StaticDataTable components.
 *
 * @author LORIS Team
 * @version 1.0.0
 *
 * */
class HelpEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      fieldOptions: {},
      error: false,
      isLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true})); ;
  }

  /**
   * Retrieve data from the provided URL and save it in state.
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
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   *
   * @return {*} a formatted table cell for a given column
   */
  formatColumn(column, cell, row) {
    let url;
    let result = <td>{cell}</td>;
    switch (column) {
    case 'Topic':
      url = loris.BaseURL + '/help_editor/edit_help_content/?helpID=' +
             row['Help ID'] + '&parentID=' + row['Parent ID'];
      result = <td><a href ={url}>{cell}</a></td>;
      break;
    case 'Parent Topic':
      url = loris.BaseURL + '/help_editor/edit_help_content/?helpID=' +
             row['Parent ID'] + '&parentID=' + row['Parent Topic ID'];
      result = <td><a href ={url}>{cell}</a></td>;
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

    const {data} = this.state;
    /**
     * XXX: Currently, the order of these fields MUST match the order of the
     * queried columns in _setupVariables() in media.class.inc
     */
    const fields = [
      {label: 'Help ID', show: false},
      {label: 'Topic', show: true, filter: {
        name: 'topic',
        type: 'text',
      }},
      {label: 'Parent ID', show: false},
      {label: 'Parent Topic ID', show: false},
      {label: 'Parent Topic', show: true},
      {label: 'Content', show: true, filter: {
        name: 'content',
        type: 'text',
      }},
    ];

    return (
      <FilterableDataTable
        name="help_filter"
        data={data}
        fields={fields}
        getFormattedCell={this.formatColumn}
      />
    );
  }
}

HelpEditor.propTypes = {
  dataURL: PropTypes.string.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <HelpEditor
      Module="help_editor"
      dataURL={loris.BaseURL + '/help_editor/?format=json'}
    />,
    document.getElementById('lorisworkspace')
  );
});
