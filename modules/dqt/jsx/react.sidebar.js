import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * Sidebar Component
 *
 * React wrapper for a sidebar
 */
class Sidebar extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      hidden: false,
    };
    this.toggleHidden = this.toggleHidden.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
  }

  /**
   * toggle hidden for sidebar
   */
  toggleHidden() {
    this.setState({hidden: !this.state.hidden});
  }

  /**
   * hide sidebar
   */
  hide() {
    this.setState({hidden: true});
  }

  /**
   * show sidebar
   */
  show() {
    this.setState({hidden: false});
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    if (this.state.hidden) {
      return <div/>;
    }
    return (
      <div>
        <h2>{this.props.Name}</h2>
        {this.props.children}
      </div>
    );
  }
}

/**
 * FieldsSidebar Component
 *
 * React wrapper for a FieldsSidebar
 */
class FieldsSidebar extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    if ((!this.props.Fields || this.props.Fields.length === 0)
      &&
      (!this.props.Criteria || Object.keys(this.props.Criteria).length === 0)) {
      return <div/>;
    }

    let fieldList = [];
    if (this.props.Fields) {
      for (let i = this.props.Fields.length - 1; i >= 0; i--) {
        let fieldInfo = this.props.Fields[i].split(',');
        fieldList.push(
          <div className='list-group-item row'
               style={{overflowX: 'scroll'}}
               key={this.props.Fields[i]}>
            <h4 className='list-group-item-heading col-xs-12'>
              {fieldInfo[0]}
            </h4>
            <span className='col-xs-12'>{fieldInfo[1]}</span>
          </div>
        );
      }
    }
    return (
      <Sidebar Name='Fields'>
        <div className='form-group'>
          <button className='btn btn-primary'
                  onClick={this.props.resetQuery}>Clear Query</button>
        </div>
        {fieldList}
      </Sidebar>);
  }
}

FieldsSidebar.propTypes = {
  Fields: PropTypes.array,
  Criteria: PropTypes.object,
};

FieldsSidebar.defaultProps = {
  Fields: [],
  Criteria: {},
};

window.Sidebar = Sidebar;
window.FieldsSidebar = FieldsSidebar;

export default {
  Sidebar,
  FieldsSidebar,
};
