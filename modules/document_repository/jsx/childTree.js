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
  margin: '10px',
  fontSize: '110%',
  fontFamily: 'verdana, sans-serif',
  color: '#034785',
  cursor: 'pointer',
  border: '0px',
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
  childList = childrenNode.map((node, index) =>(<tr><td colspan="9"><span style={divStyle} onClick={()=>this.action(Object.values(node))} key={index} className="pointer" style={divStyle}><span className="glyphicon glyphicon-folder-close"></span><span style={divStyle}>{Object.values(node)[1]}</span></span></td></tr>));
 }
    return (
    <thead>
       {childList}
    </thead>
    );
  }
}
export default ChildTree;

