"use strict";

var InfoPanel = React.createClass({
    displayName: "InfoPanel",

    getDefaultProps: function getDefaultProps() {
        return {
            data: [],
            colorScale: null
        };
    },

    getInitialState: function getInitialState() {
        return {
            items: this.props.data
        };
    },

    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
        return true;
    },

    render: function render() {
        var groupColors = this.props.groupColors;
        var info = this.props.data.map(function (o, i) {
            var labels = Object.keys(o);
            var content = labels.map(function (label, j) {

                var rowObject = o[label];
                var rowItems = rowObject.grouped_values.map(function (group) {
                    var style = {
                        backgroundColor: groupColors[group.group_label],
                        color: "white"
                    };
                    return React.createElement("tr", null, React.createElement("td", { style: style }, group.group_label), React.createElement("td", null, group.n), React.createElement("td", null, group.whiskerDown), React.createElement("td", null, group.q1), React.createElement("td", null, group.median), React.createElement("td", null, group.q3), React.createElement("td", null, group.whiskerUp), React.createElement("td", null, group.outliers.join(', ')));
                });

                return React.createElement("div", {
                    key: String.fromCharCode(65 + i, 65 + j)
                }, React.createElement("table", null, React.createElement("caption", null, label), React.createElement("th", null, React.createElement("td", null, "n"), React.createElement("td", null, "Low"), React.createElement("td", null, "Q1"), React.createElement("td", null, "Median"), React.createElement("td", null, "Q3"), React.createElement("td", null, "High"), React.createElement("td", null, "Outliers")), rowItems));
            });
            return content;
        });

        return React.createElement("div", { id: "info-panel" }, info);
    }
});