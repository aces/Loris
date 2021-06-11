import {Component} from 'react';
import PropTypes from 'prop-types';
import LoadQueryModal from './loadquerymodal';
import SaveQueryModal from './savequerymodal';

/**
 * DQT Query Panel React Component
 */
class QueryPanel extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      showLoadModal: false,
      showSaveModal: false,
    };

    this.onLoadClick = this.onLoadClick.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.clearQuery = this.clearQuery.bind(this);
    this.closeModals = this.closeModals.bind(this);
    this.loadQuery = this.loadQuery.bind(this);
  }

  /**
   * Trigger get queries
   */
  componentDidMount() {
    this.props.loadQueries();
  }

  /**
   * Handle Load button click
   */
  onLoadClick() {
    this.props.loadQueries()
      .then(() => {
        this.setState({
          showLoadModal: true,
        });
      });
  }

  /**
   * Handle Save button click
   */
  onSaveClick() {
    this.setState({
      showSaveModal: true,
    });
  }

  /**
   * Handle Modals close button click
   */
  closeModals() {
    this.setState({
      showLoadModal: false,
      showSaveModal: false,
    });
  }

  /**
   * Clear query
   */
  clearQuery() {
    this.props.setQueryFields([]);
    this.props.setFilters({});
  }

  /**
   * Load the selected query
   *
   * @param {object} query The selected query.
   */
  loadQuery(query) {
    this.closeModals();
    this.props.loadQuery(query.link);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let loadbutton = null;
    let savebutton = null;
    let runbutton = null;
    let clearbutton = null;
    let loadquerymodal = null;
    let savequerymodal = null;

    loadbutton = (
      <button
        type="button"
        className="btn btn-outline-secondary"
        title="Load a query"
      >
        <span
          className="glyphicon glyphicon-folder-open"
          onClick={this.onLoadClick}
        />
      </button>
    );

    if (this.props.query.fields.length > 0) {
      savebutton = (
        <button
          type="button"
          className="btn btn-outline-secondary"
          title="Save current query"
        >
          <span
            className="glyphicon glyphicon-floppy-disk"
            onClick={this.onSaveClick}
          />
        </button>
      );
      runbutton = (
        <button
          type="button"
          className="btn btn-outline-success"
          title="Run current query"
        >
          <span
            className="glyphicon glyphicon-play"
            onClick={this.props.runQuery}
          />
        </button>
      );
      clearbutton = (
        <button
          type="button"
          className="btn btn-outline-danger"
          title="Clear query"
        >
          <span
            className="glyphicon glyphicon-trash"
            onClick={this.clearQuery}
          />
        </button>
      );
    }

    let closebutton = null;

    if (this.state.showLoadModal) {
      loadquerymodal = (
        <LoadQueryModal
          queries={this.props.queries}
          loadQuery={this.loadQuery}
          onClose={this.closeModals}
        />
      );
    }

    if (this.state.showSaveModal) {
      savequerymodal = (
        <SaveQueryModal
          query={this.props.query}
          saveQuery={this.props.saveQuery}
          onClose={this.closeModals}
        />
      );
    }

    return (
      <div id="querypanel">
        <p>
          Load an existing query of build your own.
          Select at least one field and optionnaly add filters.
        </p>
        {runbutton}
        {savebutton}
        {loadbutton}
        {clearbutton}
        {closebutton}
        {loadquerymodal}
        {savequerymodal}
      </div>
    );
  }
}

QueryPanel.propTypes = {
  queries: PropTypes.arrayOf(PropTypes.object),
  query: PropTypes.object,
  loadQueries: PropTypes.func.isRequired,
  loadQuery: PropTypes.func.isRequired,
  runQuery: PropTypes.func.isRequired,
  saveQuery: PropTypes.func.isRequired,
  setQueryFields: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
};

QueryPanel.defaultProps = {
  queries: [],
  query: {
    fields: [],
    filters: {},
  },
};

export default QueryPanel;
