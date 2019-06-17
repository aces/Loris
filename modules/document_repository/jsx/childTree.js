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
  marginRight: '15px',
  fontSize: '110%',
  fontWeight: 'bold',
  fontFamily: 'verdana, sans-serif, bold',
  color: '#034785',
  border: '0px',
  display: 'inline-block',
};

const iconStyle = {
  fontSize: '110%',
  color: '#034785',
};

const commentStyle = {
  paddingLeft: '10px',
  paddingRight: '10px',
  borderRadius: '5px',
  fontFamily: 'verdana, sans-serif',
  fontStyle: 'italic',
  color: '#034785',
  backgroundColor: '#E4EBF2',
  border: '1px',
  textAlign: 'right',
  display: 'inline-block',
};

const trStyle = {
  cursor: 'pointer',
};

const headerRow = {
  margin: '5px',
  display: 'inline-block',
  width: '100%',
  textAlign: 'justify',
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
            <div
              style={headerRow}
              key={index}
              className="pointer"
            >
              <i className="fa fa-folder" style={iconStyle}></i>
              <div style={spanStyle} id="tooltip">
                {Object.values(node)[1]}
              </div>
                {
                  Object.values(node)[2] !== null &&
                    <div style={commentStyle} id="tip">{Object.values(node)[2]}</div>

                }
            </div>
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

