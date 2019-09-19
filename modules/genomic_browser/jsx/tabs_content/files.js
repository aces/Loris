import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FilterableDataTable from 'jsx/FilterableDataTable';

/**
 * Files Component.
 *
 * @description component for Files tab.
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
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    // this.fetchData()
    //   .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve data from the provided URL and save it in state.
   *
   * @return {object}
   */
  fetchData() {
    return fetch(window.location.origin + '/genomic_browser/AjaxGenomicBrowser',
      {credentials: 'same-origin'}
    )
      .then((resp) => resp.json())
      .then((data) => this.setState({data}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * @return {DOMRect}
   */
  render() {
    // Waiting for async data to load.
    // if (!this.state.isLoaded) {
    //   return <Loader/>;
    // }
    const data = this.state.data;
    // const options = this.state.data.fieldOptions;
    const fields = [
      // Genomic File Filters
      {
        label: 'Type', show: true, filter: {
          name: 'genomic_file_type',
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
        label: 'Date inserted', show: true, filter: {
          name: 'date_inserted',
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
    return (
      <div>
         <FilterableDataTable
          name={'filterableDataTableFiles'}
          data={data}
          fields={fields}
           // getFormattedCell={null}
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
