import {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * A modal window to load a query
 */
class SaveQueryModal extends Component {
    /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      editedQuery: {
        name: null,
        shared: false,
      },
    };

    this.saveQuery = this.saveQuery.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onSharedChange = this.onSharedChange.bind(this);
  }

  /**
   * Update the state once according to props
   */
  componentDidMount() {
    this.setState({
      editedQuery: {
        name: this.props.query.name,
        shared: this.props.query.shared,
      },
    });
  }

  /**
   * Save the query
   */
  saveQuery() {
    const query = this.props.query;
    const edited = this.state.editedQuery;
    if (query.name != edited.name || query.shared != edited.shared) {
      query.name = edited.name;
      query.shared = edited.shared;
      this.props.saveQuery(query);
    }
  }

  /**
   * Sets the query name
   *
   * @param {event} e The event
   */
  onNameChange(e) {
    const val = e.target.value;
    const query = this.state.editedQuery;

    query.name = val;
    this.setState({
      editedQuery: query,
    });
  }


  /**
   * Sets the query shared status
   *
   * @param {event} e The event
   */
  onSharedChange(e) {
    const val = e.target.checked;
    const query = this.state.editedQuery;

    query.shared = val;
    this.setState({
      editedQuery: query,
    });
  }

  /**
   * Render
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const query = this.props.query;
    const edited = this.state.editedQuery;
    const emptyname = (edited.name ?? '').length < 1;
    const newvalues = (
      edited.name != query.name || edited.shared != query.shared
    );
    const savebuttondisabled = (emptyname || !newvalues);

    console.info('emptyname: '.concat(newvalues));
    console.info('newvalues: '.concat(newvalues));

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
          <h4 classiName="modal-title">Query edit</h4>
        </div>
        <div className="modal-body">
          <form>
            <div className="form-group">
              <label htmlFor="queryname">Query name</label>
              <input
                id="queryname"
                type="text"
                className="form-control"
                value={edited.name}
                onChange={this.onNameChange}
              />
            </div>
            <div className="checkbox">
              <label>
                <input
                  id="queryshared"
                  type="checkbox"
                  checked={edited.shared}
                  onChange={this.onSharedChange}
                /> Shared
              </label>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button
           type="button"
            className="btn btn-default"
            data-dismiss="modal"
            onClick={this.saveQuery}
            disabled={savebuttondisabled}
          >
            Save
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

SaveQueryModal.PropTypes = {
  query: PropTypes.object.isRequired,
  saveQuery: PropTypes.func,
  onClose: PropTypes.func,
};

export default SaveQueryModal;
