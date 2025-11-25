import FilterableDataTable from 'FilterableDataTable';
import Loader from 'Loader';
import PropTypes from 'prop-types';
import {createRoot} from 'react-dom/client';
import React from 'react';
import i18n from 'I18nSetup';
import hiStrings from '../locale/hi/LC_MESSAGES/help_editor.json';
import jaStrings from '../locale/ja/LC_MESSAGES/help_editor.json';
import {withTranslation} from 'react-i18next';


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
 */
class HelpEditor extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
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
    this.formatColumn = this.formatColumn.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
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
   * @return {*} a formatted table cell for a given column
   */
  formatColumn(column, cell, row) {
    const {t} = this.props;
    let url;
    let result = <td>{cell}</td>;
    switch (column) {
    case t('Topic', {ns: 'help_editor'}):
      url = loris.BaseURL + '/help_editor/edit_help_content/?helpID='
            + row[t('Help ID', {ns: 'help_editor'})];
      result = <td><a href={url}>{cell}</a></td>;
      break;
    }

    return result;
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    // If error occurs, return a message.
    // XXX: Replace this with a UI component for 500 errors.
    if (this.state.error) {
      return <h3>{t('An error occured while loading the page.',
        {ns: 'loris'})}</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    const {data} = this.state;
    const addHelp = () => {
      window.location.replace(
        loris.BaseURL+'/help_editor/edit_help_content?helpID=null'
      );
    };
    const actions = [
      {label: t('Adding help content for a specific instrument',
        {ns: 'help_editor'}), action: addHelp},
    ];
    const fields = [
      {label: t('Help ID', {ns: 'help_editor'}), show: false},
      {label: t('Topic', {ns: 'help_editor'}), show: true, filter: {
        name: 'topic',
        type: 'text',
      }},
      {label: t('Content', {ns: 'help_editor'}), show: true, filter: {
        name: 'content',
        type: 'text',
      }},
      {label: t('Instrument', {ns: 'loris', count: 1}), show: true},
    ];

    return (
      <FilterableDataTable
        name="help_filter"
        data={data}
        fields={fields}
        actions={actions}
        getFormattedCell={this.formatColumn}
      />
    );
  }
}

HelpEditor.propTypes = {
  dataURL: PropTypes.string.isRequired,
  t: PropTypes.func,
};

const TranslatedHelpEditor = withTranslation(
  ['help_editor'])(HelpEditor);

window.addEventListener('load', () => {
  i18n.addResourceBundle('hi', 'help_editor', hiStrings);
  i18n.addResourceBundle('ja', 'help_editor', jaStrings);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <TranslatedHelpEditor
      Module="help_editor"
      dataURL={loris.BaseURL + '/help_editor/?format=json'}
    />
  );
});
