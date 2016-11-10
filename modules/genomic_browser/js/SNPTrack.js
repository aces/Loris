"use strict";

var SNPTrack = React.createClass({
  displayName: "SNPTrack",

  getDefaultProps: function getDefaultProps() {
    return {
      snpsList: {},
      xscale: null,
      y: 0
    };
  },

  render: function render() {
    var that = this;
    var xScale = this.props.xScale;
    var snps = Object.keys(this.props.snpsList).map(function (key) {
      var alleles = that.props.snpsList[key].alleles;
      var x = xScale(that.props.snpsList[key].genomic_location);
      var title = that.props.snpsList[key].rsID;

      return React.createElement(
        "rect",
        {
          className: "snp",
          "data-toggle": "modal",
          x: x,
          y: that.props.y,
          height: "20",
          width: "5",
          "data-id": title,
          "data-target": "#myModal"
        },
        React.createElement(
          "title",
          null,
          "title"
        )
      );
    });

    return React.createElement(
      "g",
      { className: "snp-track" },
      snps
    );
  }
});