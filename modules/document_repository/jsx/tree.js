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
// let numbers = ['two', 'three', 'four', 'five'];
let folder = ['root'];
class Tree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data: folder,
                  list: [],
                 };
    this.nextNode = this.nextNode.bind(this);
    this.backNode = this.backNode.bind(this);

//    folder.push(this.props.url);
// console.log(this.props.action);
  }
  nextNode(obj) {
     // const nodes = this.state.data;
     this.props.action(obj);
//     nodes.push(obj[1]);
//     this.setState({data: nodes});
//     console.log(this.props);
  }
  backNode(id) {
//     if (id===0) {
//       return;
//     }
//   alert(this.state.data[id]);
//    const arr = this.state.data.slice(0, id);
//    console.log(arr);
//    this.setState({data: arr});
  }
  render() {
  // root1 >
  const list = this.state.data.map((item, i) => (<span onClick={()=>this.backNode(i)} className="glyphicon glyphicon-folder-open">{item} ></span>));
  const childrenNode = this.props.childrenNode;
 let node = null;
// console.log(Object.entries(childrenNode).length === 0);
 if (Object.entries(childrenNode).length !== 0) {
   node = childrenNode.map((node, index) =>(<span className="glyphicon glyphicon-folder-close" onClick={()=>this.nextNode(Object.values(node))} key={index} > {Object.values(node)[1]} </span>));
 }
    return (
     <div>
{list}
{node}

     </div>
    );
  }
}
export default Tree;

/** *class TreeNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {display: 1};
    this.click = this.props.nextNode;
  }
  componentDidMount() {
      console.log('fdfdsafdsfdsaf');
  }
  render() {
//    sub1 sub2 sub3
 const childrenNode = this.props.childrenNode;
 let node = null;
// console.log(Object.entries(childrenNode).length === 0);
 if (Object.entries(childrenNode).length !== 0) {
   node = childrenNode.map((node, index) =>(<span className="glyphicon glyphicon-folder-close" onClick={()=>this.props.click(Object.values(node))} key={index} > {Object.values(node)[1]} </span>));
 }
// const treenode = childrenNode.map((node, index) =>{
// console.log(node);
// });

// const node = numbers.map((number, index) => (<span className="glyphicon glyphicon-folder-close" onClick={()=>this.props.click(numbers[index])} key={index} > {number} </span>));
    return (
     <span>
      {node}
     </span>
    );
  }
} ***/
