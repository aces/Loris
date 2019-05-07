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

class ChildTree extends React.Component {
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
  childList = childrenNode.map((node, index) =>(<tr onClick={()=>this.action(Object.values(node))} style={trStyle}><td colSpan="9"><span style={spanStyle} key={index} className="pointer" style={spanStyle}><i className="fa fa-folder"></i><span style={spanStyle}>{Object.values(node)[1]}</span></span></td></tr>));
 }
    return (
    <thead>
       {childList}
    </thead>
    );
  }
}
export default ChildTree;

