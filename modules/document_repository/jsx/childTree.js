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
 **/
const spanStyle = {
  marginLeft: '15px',
  fontSize: '110%',
  fontFamily: 'verdana, sans-serif',
  color: '#034785',
  border: '0px',
};

const trStyle = {
  cursor: 'pointer',
};

class ChildTree extends Component {
  constructor(props) {
    super(props);
    this.action = this.action.bind(this);
  }
  action(obj) {
    this.props.action(obj);
  }
  render() {
    let childList = null;
    let childrenNode = this.props.childrenNode;
    if (Object.entries(childrenNode).length !== 0) {
      childList = childrenNode.map((node, index) => (
        <tr
          key={index}
          onClick={()=>this.action(Object.values(node))}
          style={trStyle}
        >
          <td colSpan="10">
            <span
              style={spanStyle}
              key={index}
              className="pointer"
              style={spanStyle}
            >
              <i className="fa fa-folder"></i>
              <span style={spanStyle}>
                {Object.values(node)[1]}
              </span>
            </span>
          </td>
        </tr>
      ));
    }
    return (
      <thead>
        {childList}
      </thead>
    );
  }
}

ChildTree.propTypes = {
  action: PropTypes.func.isRequired,
  childrenNode: PropTypes.array.isRequired,
};

export default ChildTree;

