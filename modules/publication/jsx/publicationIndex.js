import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';
import PublicationUploadForm from './uploadForm.js';
import {createRoot} from 'react-dom/client';
import React from 'react';
import PropTypes from 'prop-types';
import {ButtonElement} from 'jsx/Form';
import StaticDataTable from 'jsx/StaticDataTable';
import {withTranslation} from 'react-i18next';

import i18n from 'I18nSetup';
import hiStrings from '../locale/hi/LC_MESSAGES/publication.json';

/**
 * Publication index component
 */
class PublicationIndex extends React.Component {
  /**
   * @constructor
   */
  constructor(props) {
    super(props);
    loris.hiddenHeaders = [
      'Description',
      'Publication ID',
    ];
    this.state = {
      isLoaded: false,
      filter: {},
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData();
  }

  /**
   * Fetch data
   */
  fetchData() {
    fetch(this.props.DataURL, {
      method: 'GET',
    }).then(
      (response) => {
        if (!response.ok) {
          console.error(response.status);
          return;
        }

        response.json().then(
          (data) => this.setState({
            Data: data,
            isLoaded: true,
          })
        );
      }).catch((error) => console.error(error));
  }

  /**
   * Update filter
   *
   * @param {*} filter
   */
  updateFilter(filter) {
    this.setState({filter});
  }

  /**
   * Reset filters
   */
  resetFilters() {
    this.publicationsFilter.clearFilter();
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    if (!this.state.isLoaded) {
      return (
        <button className="btn-info has-spinner">
          {t('Loading', {ns: 'publication'})}
          <span
            className="glyphicon glyphicon-refresh glyphicon-refresh-animate">
          </span>
        </button>
      );
    }
    let tabList = [
      {
        id: 'browse',
        label: t('Browse', {ns: 'publication'}),
      },
    ];
    let proposalTab;
    if (loris.userHasPermission('publication_propose')) {
      tabList.push({
        id: 'propose',
        label: t('Propose a Project', {ns: 'publication'}),
      });

      proposalTab = (
        <TabPane TabId={tabList[1].id}>
          <PublicationUploadForm
            DataURL={loris.BaseURL
                    +'/publication/ajax/getData.php?action=getData'}
            action={loris.BaseURL
                   + '/publication/ajax/FileUpload.php?action=upload'}
            editMode={false}
          />
        </TabPane>
      );
    }

    const filterRef = function(f) {
      this.publicationsFilter = f;
    }.bind(this);

    return (
      <Tabs tabs={tabList} defaultTab="browse" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          <FilterForm
            Module="publication"
            name="publications_filter"
            id="publications_filter_form"
            ref={filterRef}
            columns={3}
            formElements={this.state.Data.form}
            onUpdate={this.updateFilter}
            filter={this.state.filter}
          >
            <br/>
            <ButtonElement
              label={t('Clear Filters', {ns: 'publication'})}
              type="reset"
              onUserInput={this.resetFilters}
            />
          </FilterForm>
          <StaticDataTable
            Data={this.state.Data.Data}
            Headers={this.state.Data.Headers}
            Filter={this.state.filter}
            getFormattedCell={this.formatColumn}
          />
        </TabPane>
        {proposalTab}
      </Tabs>
    );
  }

  /**
   * Format column
   *
   * @param {string} column
   * @param {*} cell
   * @param {object} rowData
   * @param {string[]} rowHeaders
   * @return {JSX} - React markup for the component
   */
  formatColumn(column, cell, rowData, rowHeaders) {
    // If a column if set as hidden, don't display it
    if (loris.hiddenHeaders.indexOf(column) > -1) {
      return null;
    }
    // Create the mapping between rowHeaders and rowData in a row object.
    let row = {};
    rowHeaders.forEach(function(header, index) {
      row[header] = rowData[index];
    }, this);
    let classes = [];
    if (column === 'Title') {
      let pubID = row['Publication ID'];
      let viewURL = loris.BaseURL + '/publication/view_project?id=' + pubID;

      return (
        <td>
          <a href={viewURL}>
            {cell}
          </a>
        </td>
      );
    }
    return <td className={classes}>{cell}</td>;
  }
}
PublicationIndex.propTypes = {
  DataURL: PropTypes.string,
  t: PropTypes.func,
};

document.addEventListener('DOMContentLoaded', () => {
 
  i18n.addResourceBundle('hi', 'publication', hiStrings);
  const PIIndex = withTranslation(['publication', 'loris'])(PublicationIndex);
  createRoot(document.getElementById('lorisworkspace')).render(
    <PIIndex DataURL={`${loris.BaseURL}/publication/?format=json`} />
  );
});
