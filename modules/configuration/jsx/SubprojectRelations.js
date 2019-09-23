/* exported RSubprojectRelations */
import React, {Component} from 'react';

class SubprojectRelations extends Component {
  getDefaultProps() {
    return {
      Relations: { },
    };
  }

  render() {
    let subprojectIDs = Object.keys(this.props.Relations);
    let that = this;
    let subprojectList = subprojectIDs.map(function(key) {
      return <li>{that.props.Relations[key]}</li>;
    });

    return (
            <div>
                <h2>Related Subprojects</h2>
                <ul>
                    {subprojectList}
                </ul>
            </div>
        );
  }
}

let RSubprojectRelations = React.createFactory(SubprojectRelations);

window.SubprojectRelations = SubprojectRelations;
window.RSubprojectRelations = RSubprojectRelations;

export default SubprojectRelations;
