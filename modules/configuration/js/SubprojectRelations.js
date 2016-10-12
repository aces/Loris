/* exported RSubprojectRelations */

var SubprojectRelations = React.createClass({
  displayName: "SubprojectRelations",

  getDefaultProps: function () {
    return {
      Relations: {}
    };
  },
  render: function () {
    var subprojectIDs = Object.keys(this.props.Relations);
    var that = this;
    var subprojectList = subprojectIDs.map(function (key) {
      return React.createElement(
        "li",
        null,
        that.props.Relations[key]
      );
    });

    return React.createElement(
      "div",
      null,
      React.createElement(
        "h2",
        null,
        "Related Subprojects"
      ),
      React.createElement(
        "ul",
        null,
        subprojectList
      )
    );
  }
});
var RSubprojectRelations = React.createFactory(SubprojectRelations);