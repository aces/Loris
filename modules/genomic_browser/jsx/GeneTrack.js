"use strict";

var Genes_track = React.createClass({
    displayName: "Genes_track",

    getDefaultProps: function () {
        return {
            y: 0,
            xscale: null
        };
    },

    getInitialState: function () {
        return {
            genes: []
        };
    },

    componentDidMount: function () {

        var that = this;
/*
        $.ajax('https://genome.ucsc.edu/cgi-bin/das/hg19/features?segment=' + that.props.chromosome + ':' + that.props.from + ',' + that.props.to + ';type=refGene', {
            dataType: 'xml',
            data: null,
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener("progress", function (evt) {
                    console.log(evt);
                });
                return xhr;
            },
            success: function (data) {
                var items = data.getElementsByTagName('FEATURE');
                var genes = Object.keys(items).map(function (key) {
                    return items[key];
                });
                console.log(genes);
                that.setState({
                    genes: genes
                });
            },
            error: function (data) {
                that.setState({ "error": "Unknown error loading data" });
            }
        });
*/
    },

    onClickHandler: function (link) {
        alert();
    },

    render: function () {

        console.log('Genes');
        console.log(this.state.genes);
        var that = this;
        var min = that.props.to;
        var max = that.props.from;
        var exons = this.state.genes.map(function (f) {

            var width = that.props.xScale(f.getElementsByTagName("END")[0].textContent) - that.props.xScale(f.getElementsByTagName("START")[0].textContent);
            var y = that.props.yScale(1);
            var height = "20";
            var x = that.props.xScale(f.getElementsByTagName("START")[0].textContent);
            var link = "";

            min = min < f.getElementsByTagName("START")[0].textContent ? min : f.getElementsByTagName("START")[0].textContent;
            max = max > f.getElementsByTagName("END")[0].textContent ? min : f.getElementsByTagName("END")[0].textContent;

            //if ( that.props.origin.x <= x) {
            return React.createElement("rect", {
                x: x,
                y: y,
                height: height,
                width: width,
                onClick: that.onClickHandler
            });
            //}
        });

        min = min < that.props.from ? that.props.from : min;
        max = max > that.props.to ? that.props.to : max;

        return React.createElement(
            "g",
            {
                id: "refGene",
                className: "genes"
            },
            React.createElement("line", {
                x1: this.props.xScale(min),
                x2: this.props.xScale(max),
                y1: that.props.yScale(1) + 10,
                y2: that.props.yScale(1) + 10
            }),
            exons
        );
    }
});
