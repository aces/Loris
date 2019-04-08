/* exported RSubprojectRelations */

const SubprojectRelations = React.createClass({
  getDefaultProps: function() {
    return {
      Relations: { },
    };
  },
  render: function() {
    const subprojectIDs = Object.keys(this.props.Relations);
    const that = this;
    const subprojectList = subprojectIDs.map(function(key) {
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
const RSubprojectRelations = React.createFactory(SubprojectRelations);

window.SubprojectRelations = SubprojectRelations;
window.RSubprojectRelations = RSubprojectRelations;

export default SubprojectRelations;
