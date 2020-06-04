import React, {Component} from 'react';

class NullFilterableDataTable extends Component {
   constructor(props) {
    super(props);
  }
     render() {
       return (
         <div>
            {this.props.children}
         </div>
       );
     }
}
export default NullFilterableDataTable;
