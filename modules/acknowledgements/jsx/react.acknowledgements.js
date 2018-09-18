import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import FilterForm from 'jsx/FilterForm';
import Panel from 'jsx/Panel';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

class Acknowledgements extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
    this.hideFilter = this.hideFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.formatAcknowledgementsColumn = this.formatAcknowledgementsColumn.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  resetFilters() {
    this.refs.acknowledgements_filter.clearFilter();
  }

  formatAcknowledgementsColumn(column, cell, rowData, rowHeaders) {
    return <td>{cell}</td>;
  }

  hideFilter(obj) {
    let heading = $(obj);
    let arrow = $(obj).children('.arrow');
    if (heading.hasClass('panel-collapsed')) {
      // expand the panel
      heading.parents('.panel').find('.panel-body').slideDown();
      heading.removeClass('panel-collapsed');
      arrow.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
    } else {
      // collapse the panel
      heading.parents('.panel').find('.panel-body').slideUp();
      heading.addClass('panel-collapsed');
      arrow.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
    }
  }

  /**
   * Retrieve data from the provided URL and save it in state
   * Additionally add hiddenHeaders to global loris variable
   * for easy access by columnFormatter.
   */
  fetchData() {
    // $.ajax(window.location.origin + '/', {
    //   method: 'GET',
    //   dataType: 'json',
    //   success: function(data) {
    //     // console.log('ajax success - data: ' + JSON.stringify(data));
    //   },
    //   error: function(error) {
    //     console.error(error);
    //   },
    // });
  }

  render() {
    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return (
        <div>
          <Button size='medium' variant="contained" color="primary">
            Show Data
          </Button>
        </div>
      );
    }

    return (
      <div>
        <Panel id={'panel_selection_filter'} title={'Selection Filter'}>
          <FilterForm
            Module='acknowledgements'
            name='acknowledgements_filter'
            id='acknowledgements_filter'
            ref='acknowledgements_filter'
            columns={2}
            formElements={this.state.Data.form}
            onUpdate={this.updateFilter}
            filter={this.state.filter}
            emptyOption={false}
          >
            <ButtonElement
              id='testClearForm1'
              label='Clear Form'
              type='reset'
              onUserInput={this.resetFilters}
            />
          </FilterForm>
        </Panel>
        <div>
          {/* Citation Policy*/}
        </div>
        <div>
          <RDynamicDataTable
            DataURL={window.location.origin + '/acknowledgements/?format=json'}
            Data={this.state.Data.Data}
            Headers={this.state.Data.Headers}
            Filter={this.state.filter}
            getFormattedCell={this.formatAcknowledgementsColumn}
          />
        </div>
        <div>
          {/* No result found.*/}
          <div id='datatable' />
        </div>
      </div>
    );
  }
}

Acknowledgements.defaultProps = {

};

/**
 * Render conflictResolver on page load
 */
window.onload = function() {
  const acknowledgements = (
    <Acknowledgements

    />
  );
  // Create a wrapper div in which react component will be loaded
  const AcknowledgementsDOM = document.createElement('div');
  AcknowledgementsDOM.id = 'acknowledgements';

  // Append wrapper div to page content
  const rootDOM = document.getElementById('lorisworkspace');
  rootDOM.appendChild(AcknowledgementsDOM);

  // Render the React Component.
  ReactDOM.render(
    acknowledgements,
    document.getElementById('acknowledgements')
  );

  $(function() {
    $('input[name=dob]').datepicker({
      dateFormat: 'yy-mm-dd',
      changeMonth: true,
      changeYear: true,
    });
  });
};
