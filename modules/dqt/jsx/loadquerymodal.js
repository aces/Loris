import {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * A modal window to load a query
 */
class LoadQueryModal extends Component {
    /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      selectedQuery: null,
    };

    this.loadQuery = this.loadQuery.bind(this);
  }

  /**
   * load the selected query
   */
  loadQuery() {
    this.props.loadQuery(this.state.selectedQuery);
  }

  /**
   * Set the selected query
   *
   * @param {string} index The selected query index
   */
  onQuerySelected(index) {
    this.setState({
      selectedQuery: this.props.queries[index],
    });
  }

  /**
   * Render
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const loadbuttondisabled = this.state.selectedQuery == null;

    console.info(JSON.stringify(this.props.queries));
    const queryrows = this.props.queries.map((query, index) => {
      return (
        <tr onClick={() => this.onQuerySelected(index)}>
          <td>{query.name ?? 'Untitled'}</td>
          <td>{query.creationTimestamp}</td>
          <td>{query.creator}</td>
        </tr>
      );
    });

    return (
      <div
        className="modal fade in"
        role="dialog"
        style={{
          display: 'block',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
        data-backdrop="static"
        data-keyboard="false"
      >
      <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            onClick={this.props.onClose}
          >
            ×
          </button>
          <h4 classiName="modal-title">Query Selection</h4>
        </div>
        <div className="modal-body">
          <table className="table">
          {queryrows}
          </table>
        </div>
        <div className="modal-footer">
          <button
           type="button"
            className="btn btn-default"
            data-dismiss="modal"
            onClick={this.loadQuery}
            disabled={loadbuttondisabled}
          >
            Load
          </button>
          <button
            type="button"
            className="btn btn-default"
            data-dismiss="modal"
            onClick={this.props.onClose}
          >
            Close
          </button>
        </div>
      </div>
      </div>
      </div>
    );
  }
}

LoadQueryModal.PropTypes = {
  queries: PropTypes.arrayOf(PropTypes.object),
  loadQuery: PropTypes.func,
  onClose: PropTypes.func,
};

LoadQueryModal.defaultProps = {
  queries: [],
};

export default LoadQueryModal;
