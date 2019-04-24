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


class ParentTree extends React.Component {
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
  const parentList = parentNode.map((node, index) => (<span style={divStyle} onClick={()=>this.action(Object.values(node))} className="pointer"><span className="glyphicon glyphicon-folder-open"></span><span style={divStyle}>{Object.values(node)[1]} > </span></span>));
    return (
<div>
     <div>
       {parentList}
     </div>
</div>
    );
  }
}
export default ParentTree;

