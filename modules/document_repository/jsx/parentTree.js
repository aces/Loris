import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * Document Upload Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to upload a doc file
 *
 * @author Shen Wang
 * @version 1.0.0
 *
 * */
const divStyle = {
  marginLeft: '20px',
  fontSize: '110%',
  fontFamily: 'verdana, sans-serif',
  color: '#034785',
  cursor: 'pointer',
};


class ParentTree extends Component {
  constructor(props) {
    super(props);
    this.action = this.action.bind(this);
  }
  action(obj) {
    this.props.action(obj);
  }
  render() {
    const parentNode = this.props.parentNode;
    parentNode.unshift(['0', 'Root']);
    // let parentList = null;
    const parentList = parentNode.map((node, index) => (
      <span
        key={index}
        style={divStyle}
        onClick={()=>this.action(Object.values(node))}
        className="pointer"
      >
        <i className="fa fa-folder-open" aria-hidden="true"></i>
        <span style={divStyle}>
          {Object.values(node)[1]} >
        </span>
      </span>
    ));
    return (
      <div>
       {parentList}
      </div>
    );
  }
}

ParentTree.propTypes = {
  action: PropTypes.func.isRequired,
  parentNode: PropTypes.array.isRequired,
};

export default ParentTree;

