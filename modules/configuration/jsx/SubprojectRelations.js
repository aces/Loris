/* exported RSubprojectRelations */
import React, {Component} from 'react';

/**
 * Subproject Relations React Component
 */
class SubprojectRelations extends Component {
  /**
   * Get the default React properties.
   * Invoked once and cached when the class is created.
   * Values in the mapping will be set if not specified by the parent component.
   *
   * @return {object} props - React Component properties
   */
  getDefaultProps() {
    return {
      Relations: { },
    };
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
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
