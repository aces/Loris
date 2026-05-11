import {clone, isEmpty} from './helpers.js';
import PropTypes from 'prop-types';

/**
 * A form containing a list
 */
class ListForm extends React.Component {
  /**
   * Constructor
   */
  constructor() {
    super();
    this.state = {
      count: 0,
      multiplier: 1,
      collapsed: {},
    };

    this.setListItem = this.setListItem.bind(this);
    this.addListItem = this.addListItem.bind(this);
    this.copyListItem = this.copyListItem.bind(this);
    this.removeListItem = this.removeListItem.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  /**
   * React lifecycle method
   */
  componentDidMount() {
    this.addListItem();
  }

  /**
   * React lifecycle method
   */
  componentDidUpdate() {
    Object.keys(this.props.list).forEach((key) => {
      if (!isEmpty(this.props.errors[key]) && this.state.collapsed[key]) {
        this.toggleCollapse(key);
      }
    });
  }

  /**
   * Set the value of a list item
   *
   * @param {string} name - the item name
   * @param {string} value - the item value
   * @param {string} key - the key with the item
   */
  setListItem(name, value, key) {
    const list = clone(this.props.list);
    list[key][name] = value;
    this.props.setList(list);
  }

  /**
   * Add an empty list item
   */
  addListItem() {
    let {count, collapsed} = clone(this.state);
    const list = clone(this.props.list);
    count++;
    collapsed[count] = false;
    list[count] = this.props.listItem;

    this.setState({count, collapsed});
    this.props.setList(list);
  }

  /**
   * Copy an item in a list
   *
   * @param {string} key - the key to copy
   */
  copyListItem(key) {
    let {collapsed, count, multiplier} = clone(this.state);
    const list = clone(this.props.list);
    for (let i=1; i<=multiplier; i++) {
      count++;
      list[count] = clone(list[key]);
      // TODO: find a way to exempt certain elements from being copied.
      (list[count].container||{}).barcode &&
        delete list[count].container.barcode;
      list[count].barcode &&
        delete list[count].barcode;
      collapsed[count] = true;
    }
    this.setState({collapsed, count, multiplier});
    this.props.setList(list);
  }

  /**
   * Remove a list item from the list
   *
   * @param {string} key - the key to remove
   */
  removeListItem(key) {
    const list = clone(this.props.list);
    delete list[key];
    this.props.setList(list);
  }

  /**
   * Toggle whether a key is collapsed
   *
   * @param {string} key - the key to toggle
   */
  toggleCollapse(key) {
    const collapsed = clone(this.state.collapsed);
    collapsed[key] = !collapsed[key];
    this.setState({collapsed});
  }

  /**
   * Render the React component
   *
   * @return {JSX}
   */
  render() {
    const {collapsed, multiplier} = this.state;
    const {errors, list} = this.props;

    return Object.entries(list).map(([key, item], i, list) => {
      const handleRemoveItem = list.length > 1 ?
        () => this.removeListItem(key) : null;
      const handleCopyItem = () => this.copyListItem(key);
      const handleCollapse = () => this.toggleCollapse(key);

      return React.Children.map(this.props.children, (child) => {
        const form = React.cloneElement(child, {
          key: key,
          itemKey: key,
          id: (i+1),
          collapsed: collapsed[key],
          handleCollapse: handleCollapse,
          item: (item || {}),
          removeItem: handleRemoveItem,
          setListItem: this.setListItem,
          errors: (errors[key] || {}),
        });

        const renderAddButtons = () => {
          if (i+1 == list.length) {
            return (
              <div className='row'>
                <div className='col-xs-12'>
                  <div className='col-xs-3'/>
                  <div className='col-xs-4 action'>
                    <div>
                      <span className='action'>
                        <div
                          className='action-button add'
                          onClick={this.addListItem}
                        >
                          +
                        </div>
                      </span>
                      <span className='action-title'>
                        New Entry
                      </span>
                    </div>
                  </div>
                  <div className='col-xs-5 action'>
                    <div>
                      <span className='action'>
                        <div
                          className='action-button add'
                          onClick={handleCopyItem}
                        >
                          <span className='glyphicon glyphicon-duplicate'/>
                        </div>
                      </span>
                      <span className='action-title'>
                        <input
                          className='form-control input-sm'
                          type='number'
                          min='1'
                          max='50'
                          style={{width: 50, display: 'inline'}}
                          onChange={(e) => {
                            this.setState({multiplier: e.target.value});
                          }}
                          value={multiplier}
                        />
                        Copies
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        };

        return (
          <div>
            {form}
            {renderAddButtons()}
          </div>
        );
      });
    });
  }
}

// ListForm.propTypes
ListForm.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      // Add other list item-specific properties if necessary
    })
  ).isRequired,
  errors: PropTypes.object.isRequired,
  setList: PropTypes.func.isRequired,
  listItem: PropTypes.shape({
    // Define listItem-specific properties if necessary
  }).isRequired,
  children: PropTypes.node.isRequired,
};

/**
 * Display a list item
 */
class ListItem extends React.Component {
  /**
   * Render the component
   *
   * @return {JSX}
   */
  render() {
    const children = React.Children.toArray(this.props.children);
    const firstChild = React.cloneElement(children[0], {
      label: children[0].props.label + ' ' + this.props.id,
    });
    const remainingChildren = children.slice(1);

    const glyphStyle = {
      color: '#808080',
      marginLeft: 10,
      cursor: 'pointer',
      fontSize: 15,
    };
    const removeItemButton = (
      <span
        className='glyphicon glyphicon-remove'
        onClick={this.props.removeItem}
        style={glyphStyle}
      />
    );

    return (
      <div className='row'>
        <div className='col-xs-11'>
          {firstChild}
        </div>
        <div className='col-xs-1' style={{paddingLeft: 0, marginTop: 10}}>
          <span
            className= {
              this.props.collapsed
                ? 'glyphicon glyphicon-chevron-down'
                : 'glyphicon glyphicon-chevron-up'
            }
            style={{
              cursor: 'pointer',
              fontSize: 15,
              position: 'relative',
              right: 40,
            }}
            onClick={this.props.handleCollapse}
          />
          {this.props.removeItem ? removeItemButton : null}
        </div>
        <div className='col-xs-9 col-xs-offset-2'>
          <div
            id={'item-' + this.props.itemKey}
            className={this.props.collapsed ? 'closed' : 'open'}
          >
            {remainingChildren}
          </div>
        </div>
      </div>
    );
  }
}

// ListItem.propTypes
ListItem.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  removeItem: PropTypes.func.isRequired,
  collapsed: PropTypes.bool.isRequired,
  handleCollapse: PropTypes.func.isRequired,
  itemKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export {ListForm, ListItem};
