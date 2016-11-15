"use strict";

var Genes_track = React.createClass({
    displayName: "Genes_track",

    getDefaultProps: function () {
        return {
            dataURL: loris.BaseURL + '/genomic_browser/ajax/getUCSCGenes.php',
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
        $.ajax(that.props.dataURL + '?genomic_range=' + that.props.chromosome + ':' + that.props.from + '-' + that.props.to + '&type=refGene', {
            dataType: 'json',
            data: null,
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener("progress", function (evt) {
                    console.log(evt);
                });
                return xhr;
            },
            success: function (data) {
                that.setState({
                    genes: data
                });
            },
            error: function (data) {
                that.setState({ "error": "Unknown error loading data" });
            }
        });
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

            var width = that.props.xScale(f.cdsEnd) - that.props.xScale(f.cdsStart);
            var y = that.props.yScale(1);
            var height = "20";
            var x = that.props.xScale(f.cdsStart);
            var link = "";

            min = min < f.cdsStart ? min : f.cdsStart;
            max = max > f.cdsEnd ? min : f.cdsEnd;

            return (<rect x={x} y={y} height={height} width={width} onClick={that.onClickHandler}/>);
        });

        min = min < that.props.from ? that.props.from : min;
        max = max > that.props.to ? that.props.to : max;

        return (<g id="refGene" className="genes"><line x1={this.props.xScale(min)} x2={this.props.xScale(max)} y1={that.props.yScale(1) + 10} y2={that.props.yScale(1) + 10}/>{exons}</g>);
    }
});
