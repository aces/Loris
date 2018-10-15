import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: false
    };
    this.toggleHidden = this.toggleHidden.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
  }

  toggleHidden() {
    this.setState({hidden: !this.state.hidden});
  }

  hide() {
    this.setState({hidden: true});
  }

  show() {
    this.setState({hidden: false});
  }

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

class FieldsSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {};

  }

  render() {
    if ((!this.props.Fields || this.props.Fields.length === 0)
      &&
      (!this.props.Criteria || Object.keys(this.props.Criteria).length === 0)) {
      return <div/>;
    }

    let fieldDiv = '';
    let fieldList = [];
    if (this.props.Fields) {
      for (let i = this.props.Fields.length - 1; i >= 0; i--) {
        let fieldInfo = this.props.Fields[i].split(',');
        fieldList.push(
          <div className='list-group-item row' key={this.props.Fields[i]}>
            <h4 className='list-group-item-heading col-xs-12'>{fieldInfo[0]}</h4>
            <span className='col-xs-12'>{fieldInfo[1]}</span>
          </div>
        );
      }
    }
    return (
      <Sidebar Name='Fields'>
        <div className='form-group'>
          <button className='btn btn-primary' onClick={this.props.resetQuery}>Clear Query</button>
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
  Criteria: {}
};

window.Sidebar = Sidebar;
window.FieldsSidebar = FieldsSidebar;

export default {
  Sidebar,
  FieldsSidebar
};
