/* exported RSubprojectRelations */

let SubprojectRelations = React.createClass({
  getDefaultProps: function() {
    return {
      Relations: { },
    };
  },
  render: function() {
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
  },
});
let RSubprojectRelations = React.createFactory(SubprojectRelations);

window.SubprojectRelations = SubprojectRelations;
window.RSubprojectRelations = RSubprojectRelations;

export default SubprojectRelations;
