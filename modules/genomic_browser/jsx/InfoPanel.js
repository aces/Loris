"use strict";

var InfoPanel = React.createClass({
  displayName: "InfoPanel",

  getDefaultProps: function() {
    return {
      data: [],
      colorScale: null
    };
  },

  getInitialState: function() {
    return {
      items: this.props.data
    };
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return true;
  },

  render: function() {
    var groupColors = this.props.groupColors;
    var info = this.props.data.map(function(o, i) {
      var labels = Object.keys(o);
      var content = labels.map(function(label, j) {
        var rowObject = o[label];
        var rowItems = rowObject.grouped_values.map(function(group) {
          var style = {
            backgroundColor: groupColors[group.group_label],
            color: "white"
          };

          return (
                      <tr>
                        <td style={style}>{group.group_label}</td>
                        <td>{group.n}</td>
                        <td>{group.whiskerDown}</td>
                        <td>{group.q1}</td>
                        <td>{group.median}</td>
                        <td>{group.q3}</td>
                        <td>{group.whiskerUp}</td>
                        <td>{group.outliers.join(', ')}</td>
                      </tr>
                    );
        });

        return (
                  <div key={String.fromCharCode(65 + i, 65 + j)}>
                    <table>
                      <caption>{label}</caption>
                      <th>
                        <td>n</td>
                        <td>Low</td>
                        <td>Q1</td>
                        <td>Median</td>
                        <td>Q3</td>
                        <td>High</td>
                        <td>Outliers</td>
                      </th>
                      {rowItems}
                    </table>
                  </div>
                );
      });
      return content;
    });

    return (<div id="info-panel">{info}</div>);
  }
});
