/* eslint-disable */
import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';
import PublicationUploadForm from './uploadForm.js';
import {createRoot} from 'react-dom/client';
import React from 'react';
import PropTypes from 'prop-types';
import StaticDataTable from 'jsx/StaticDataTable';
import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';
import hiStrings from '../locale/hi/LC_MESSAGES/publication.json';
import FilterableDataTable from 'FilterableDataTable';

/**
 * Publication index component
 */
class PublicationIndex extends React.Component {
  /**
   * @constructor
   */
   constructor() {
    super();
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
    fetch(this.props.DataURL, {method: 'GET'})
      .then((response) => {
        if (!response.ok) {
          console.error(response.status);
          return;
        }
        response.json().then((data) =>
          this.setState({
            Data: data,
            isLoaded: true,
          })
        );
      })
      .catch((error) => console.error(error));
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
          {t('Loading...', {ns: 'loris'})}
          <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
        </button>
      );
    }

    let tabList = [{id: 'browse', label: t('Browse', {ns: 'publication'})}];
    let proposalTab;

    if (loris.userHasPermission('publication_propose')) {
      tabList.push({id: 'propose', label: t('Propose a Project', {ns: 'publication'})});

      proposalTab = (
        <TabPane TabId={tabList[1].id}>
          <PublicationUploadForm
            DataURL={`${loris.BaseURL}/publication/ajax/getData.php?action=getData`}
            action={`${loris.BaseURL}/publication/ajax/FileUpload.php?action=upload`}
            editMode={false}
          />
        </TabPane>
      );
    }

    const filterRef = (f) => (this.publicationsFilter = f);

    const fields = [
      {
        label: t('Title', {ns: 'publication'}),
        show: true,
        filter: {name: 'Title', type: 'text'},
      },
      {
        label: t('Lead Investigator', {ns: 'publication'}),
        show: true,
        filter: {name: 'leadInvestigator', type: 'text'},
      },
      {
        label: t('Date Proposed', {ns: 'publication'}),
        show: true,
        filter: {hide: true},
      },
      {
        label: t('Approval Status', {ns: 'publication'}),
        show: true,
        filter: {
          name: 'approvalStatus',
          type: 'select',
          options: this.state.Data.form.approvalStatus.options,
        },
      },
      {
        label: t('Project', {ns: 'loris', count: 1}),
        show: true,
        filter: {
          name: 'project',
          type: 'select',
          options: this.state.Data.form.project.options,
        },
      },
      {
        label: t('Journal', {ns: 'publication'}),
        show: true,
        filter: {name: 'journal', type: 'text'},
      },
      {
        label: t('Link', {ns: 'publication'}),
        show: true,
        filter: {name: 'link', type: 'text'},
      },
      {
        label: t('Publishing Status', {ns: 'publication'}),
        show: true,
        filter: {
          name: 'publishingStatus',
          type: 'select',
          options: this.state.Data.form.publishingStatus.options,
        },
      },
      {
        label: t('Date Published', {ns: 'publication'}),
        show: true,
        filter: {name: 'datePublished', type: 'date', hide: true},
      },
      {
        label: t('Project Proposal Creator', {ns: 'publication'}),
        show: true,
        filter: {name: 'projectProposalCreator', type: 'text'},
      },
      {
        label: 'Description',
        show: false,
        filter: {name: 'description', hide: true},
      },
      {
        label: t('Collaborators', {ns: 'publication'}),
        show: true,
        filter: {name: 'collaborators', hide: true},
      },
      {
        label: t('Variables Of Interest', {ns: 'publication'}),
        show: true,
        filter: {name: 'variablesOfInterest', type: 'text'},
      },
      {
        label: t('Keywords', {ns: 'publication'}),
        show: true,
        filter: {name: 'keywords', type: 'text'},
      },
      {
        label: 'Publication ID',
        show: false,
        filter: {name: 'PublicationID', hide: true},
      },
    ];

    return (
      <Tabs tabs={tabList} defaultTab="browse" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          <FilterableDataTable
            ref={filterRef}
            name="publication"
            title={t('Publications', {ns: 'publication'})}
            data={this.state.Data.Data}
            fields={fields}
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
    if (rowHeaders[0] === column) {
      const pubID = rowData['Publication ID'];
      const viewURL = `${loris.BaseURL}/publication/view_project?id=${pubID}`;
      return (
        <td>
          <a href={viewURL}>{cell}</a>
        </td>
      );
    }
    return <td>{cell}</td>;
  }
}
PublicationIndex.propTypes = {
  DataURL: PropTypes.string,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('hi', 'publication', hiStrings);

  const PubIndex = withTranslation(['publication'])(PublicationIndex);

  createRoot(document.getElementById('lorisworkspace')).render(
    <div className="page-publications">
      <PubIndex DataURL={`${loris.BaseURL}/publication/?format=json`} />
    </div>
  );
});

