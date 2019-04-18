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
  margin: '40px',
  border: '5px solid pink',
};


class Tree extends React.Component {
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
  const parentList = parentNode.map((node, index) => (<span style={divStyle} onClick={()=>this.action(Object.values(node))} className="glyphicon glyphicon-folder-open">{Object.values(node)[1]} ></span>));
  const childrenNode = this.props.childrenNode;
 let childList = null;
 if (Object.entries(childrenNode).length !== 0) {
  childList = childrenNode.map((node, index) =>(<span style={divStyle} className="glyphicon glyphicon-folder-close" onClick={()=>this.action(Object.values(node))} key={index} > {Object.values(node)[1]} </span>));
 }
    return (
     <div>
       {parentList}
       {childList}
     </div>
    );
  }
}
export default Tree;

