"use strict";

var BrainMethyl_track = React.createClass({
    displayName: "BrainMethyl_track",

    getDefaultProps: function () {
        return {
            origin: {},
            xscale: null,
            yscale: null
        };
    },

    getInitialState: function () {
        return {
            features: []
        };
    },

    componentDidMount: function () {

        var that = this;
/*
        $.ajax('https://genome.ucsc.edu/cgi-bin/das/hg19/features?segment=' + that.props.chromosome + ':' + that.props.from + ',' + that.props.to + ';type=wgEncodeBroadHistoneHsmmH3k4me1StdPk', {
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
                var features = Object.keys(items).map(function (key) {
                    return items[key];
                });
                that.setState({
                    features: features
                });
            },
            error: function (data) {
                that.setState({ "error": "Unknown error loading data" });
            }
        });
*/
    },

    render: function () {

        console.log('BrainMethyl_track features');
        console.log(this.state.features);
        var that = this;

        var features = this.state.features.map(function (f) {
            console.log("---");
            console.log(f.getElementsByTagName("START")[0].textContent);
            console.log(f.getElementsByTagName("END")[0].textContent);
            console.log(f.getElementsByTagName("END")[0].textContent - f.getElementsByTagName("START")[0].textContent);

            var width = that.props.xScale(f.getElementsByTagName("END")[0].textContent) - that.props.xScale(f.getElementsByTagName("START")[0].textContent);
            var y = that.props.yScale(f.getElementsByTagName("SCORE")[0].textContent / 1000);
            var height = that.props.origin.y - that.props.yScale(f.getElementsByTagName("SCORE")[0].textContent / 1000);
            var x = that.props.xScale(f.getElementsByTagName("START")[0].textContent);
            if (that.props.origin.x <= x) {
              return (<rect x={x} y={y} height={height} width={width} />); 
            }
        });

        return (<g id="wgEncodeBroadHistoneHsmmH3k4me1StdPk" className="chip-peak">{features}</g>);
    }
});
