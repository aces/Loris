"use strict";

var Chart = React.createClass({
    displayName: "Chart",

    getDefaultProps: function getDefaultProps() {
        return {
            margin: { top: 10, right: 20, bottom: 10, left: 20 },
            yAxisWidth: 20,
            topTitleHeight: 20,
            xAxisHeight: 40,
            leftLegendSpacing: 200,
            groupColors: null,
            chromosome: 0,
            from: 0,
            to: 0,
            onClickHandler: null,
            data: [],
            snpData: {}
        };
    },

    getInitialState: function getInitialState() {
        return {
            features: []
        };
    },

    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
        return true;
    },

    render: function render() {

        var origin = {
            x: this.props.margin.left + this.props.yAxisWidth,
            y: this.props.height - this.props.xAxisHeight
        };

        var xScale = d3.scale.linear().domain([this.props.from, this.props.to]).range([origin.x + 15, this.props.width - this.props.margin.left - this.props.leftLegendSpacing - 15]);

        var yScale = d3.scale.linear().domain([0, 1]).range([origin.y, this.props.margin.top + this.props.topTitleHeight]);

        var title = "Beta values of participants grouped by gender for CpGs located on Chr" + this.props.chromosome + ":" + this.props.from + "-" + this.props.to;

        var snpsList = this.props.snpData;

        return React.createElement("svg", {
            className: "chart",
            width: this.props.width,
            height: this.props.height
        }, React.createElement("g", null, React.createElement(Title, {
            text: title,
            x: (this.props.width - this.props.margin.left - this.props.yAxisWidth - this.props.leftLegendSpacing - this.props.margin.right) / 2 + this.props.margin.left + this.props.yAxisWidth,
            y: this.props.margin.top + this.props.topTitleHeight
        }), React.createElement(Legend, {
            x: this.props.width - this.props.margin.right - this.props.leftLegendSpacing,
            y: this.props.margin.top + this.props.topTitleHeight,
            width: this.props.leftLegendSpacing,
            height: this.props.height - this.props.margin.top - this.props.topTitleHeight - this.props.margin.bottom - this.props.xAxisHeight
        }), React.createElement(YAxis, {
            label: "beta value",
            leftMargin: this.props.margin.left,
            origin: origin,
            height: this.props.height - this.props.margin.top - this.props.topTitleHeight - this.props.margin.bottom - this.props.xAxisHeight,
            yScale: yScale
        }), React.createElement(XAxis, {
            label: "genomic location",
            origin: origin,
            width: this.props.width - this.props.margin.left - this.props.margin.right - this.props.leftLegendSpacing - this.props.yAxisWidth,
            xScale: xScale,
            height: this.props.xAxisHeight
        }), React.createElement(SNPTrack, {
            snpsList: snpsList,
            xScale: xScale,
            y: yScale(0.1)
        }), React.createElement(Boxplot, {
            width: this.props.width - this.props.margin.left - this.props.margin.right,
            height: this.props.height - this.props.margin.top - this.props.margin.bottom,
            data: this.props.data,
            xScale: xScale,
            yScale: yScale,
            onClickHandler: this.props.onClickHandler,
            groupColors: this.props.groupColors
        }), React.createElement(BrainMethyl_track, {
            xScale: xScale,
            yScale: yScale,
            origin: origin,
            chromosome: this.props.chromosome,
            from: this.props.from,
            to: this.props.to
        }), React.createElement(Genes_track, {
            xScale: xScale,
            yScale: yScale,
            origin: origin,
            chromosome: this.props.chromosome,
            from: this.props.from,
            to: this.props.to
        })));
    }
});

/*
    Boxplot class
    data should look like:

 {
     "item1":{
        "x":91194674,
        "grouped_values":[
            {"group_label":"Male","q1":0.072003702,"median":0.079377803,"q3":0.084961371,"whiskerUp":0.097754396,"whiskerDown":0.053048172,"outliers":[0.127140137]},
            {"group_label":"Female","q1":0.070308489,"median":0.07845805,"q3":0.089381738,"whiskerUp":0.109469795,"whiskerDown":0.058080513,"outliers":[]},
            ...
        ]
     },
    "item2":{
        "x": number
        "grouped_values": [...]
     },
     ...
 }


 <Boxplot
     width={this.props.width - this.props.margin.left - this.props.margin.right}
     height={this.props.height - this.props.margin.top - this.props.margin.bottom}
     data={this.props.data}
     xScale={xScale}
     yScale={yScale}
     onClickHandler={this.props.onClickHandler}
 />

 */
var Boxplot = React.createClass({
    displayName: "Boxplot",

    getDefaultProps: function getDefaultProps() {
        return {
            data: [],
            width: 0,
            xScale: null,
            yScale: null,
            groupColors: {},
            boxWidth: 40,
            onClickHandler: null
        };
    },

    componentDidMount: function componentDidMount() {
        console.log("Boxplot loaded");
    },

    render: function render() {

        var that = this;
        var xScale = this.props.xScale;
        var yScale = this.props.yScale;
        var data = this.props.data;
        var boxwidth = this.props.boxWidth;
        var boxes = [];

        Object.keys(data).forEach(function (key) {
            var point = data[key];
            var group_size = point.grouped_values.length;
            boxes.push(point.grouped_values.map(function (elem, index) {

                var x = point.x;
                var elemWidth = boxwidth / group_size;

                return React.createElement(SpreadBox, {
                    x: xScale(x) - boxwidth / 2 + elemWidth * index,
                    name: key,
                    group_label: elem.group_label,
                    median: yScale(elem.median),
                    width: elemWidth,
                    q1: yScale(elem.q1),
                    q3: yScale(elem.q3),
                    whiskerUp: yScale(elem.whiskerUp),
                    whiskerDown: yScale(elem.whiskerDown),
                    outliers: elem.outliers.map(function (value) {
                        return yScale(value);
                    }),
                    color: that.props.groupColors[elem.group_label]
                });
            }));
        });

        boxes = boxes.map(function (spreadBox) {
            return React.createElement("g", {
                className: "group-box",
                title: spreadBox[0].props.name,
                "data-toggle": "tooltip",
                onClick: that.props.onClickHandler
            }, spreadBox.map(function (d) {
                return d;
            }));
        });

        /*
             var labels = data.map(function(point, i) {
                 var median = (<text x={xScale(point.x)} y={yScale(point.median)} dx="-6" dy=".3em" textAnchor="end" key={"a"+i}>{point.median}</text>);
                 var q1 = (<text x={xScale(point.x) + xScale(21)} y={yScale(point.q1)} dx="-6" dy=".3em" textAnchor="end" key={"b"+i}>{point.q1}</text>);
                 var q3 = (<text x={xScale(point.x) + xScale(21)} y={yScale(point.q3)} dx="-6" dy=".3em" textAnchor="end" key={"c"+i}>{point.q3}</text>);
                 var whiskersDown = (<text x={xScale(point.x)} y={yScale(point.whiskerDown)} dx="-6" dy=".3em" textAnchor="end" key={"d"+i}>{point.whiskerDown}</text>);
                 var whiskersUp = (<text x={xScale(point.x)} y={yScale(point.whiskerUp)} dx="-6" dy=".3em" textAnchor="end" key={"e"+i}>{point.whiskerUp}</text>);
                 return (
                     [median, q1, q3, whiskersDown, whiskersUp]
                 )
             });
        */
        return React.createElement("g", {
            className: "plotPannel",
            id: "data-panel"
        }, boxes);
    }
});

var SpreadBox = React.createClass({
    displayName: "SpreadBox",

    getDefaultProps: function getDefaultProps() {
        return {
            name: "",
            x: 0,
            width: 0,
            median: 0,
            q1: 0,
            q3: 0,
            whiskerUp: 0,
            whiskerDown: 0,
            outliers: [],
            color: "white"
        };
    },

    componentDidMount: function componentDidMount() {
        console.log(this.props.name + " mounted");
    },

    render: function render() {
        var xCenter = this.props.x + this.props.width * 0.5;
        var style = { fill: this.props.color };
        var outliers = this.props.outliers.map(function (value) {
            return React.createElement("circle", {
                style: style,
                className: "outlier",
                cx: xCenter,
                cy: value,
                r: "2"
            });
        });

        return React.createElement("g", {
            className: "spread-box"
        }, React.createElement("line", {
            className: "center-line",
            x1: xCenter,
            x2: xCenter,
            y1: this.props.whiskerUp,
            y2: this.props.whiskerDown
        }), React.createElement("rect", {
            className: "iqr-box",
            style: style,
            height: this.props.q1 - this.props.q3,
            width: this.props.width,
            x: this.props.x,
            y: this.props.q3
        }), React.createElement("line", {
            className: "median",
            x1: this.props.x,
            x2: this.props.x + this.props.width,
            y1: this.props.median,
            y2: this.props.median
        }), React.createElement("line", {
            className: "whisker",
            x1: this.props.x,
            x2: this.props.x + this.props.width,
            y1: this.props.whiskerUp,
            y2: this.props.whiskerUp
        }), React.createElement("line", {
            className: "whisker",
            x1: this.props.x,
            x2: this.props.x + this.props.width,
            y1: this.props.whiskerDown,
            y2: this.props.whiskerDown
        }), outliers);
    }
});

var Title = React.createClass({
    displayName: "Title",

    render: function render() {
        return React.createElement("text", {
            className: "chart-title",
            x: this.props.x,
            y: this.props.y,
            dy: "-.3em",
            textAnchor: "middle"
        }, this.props.text);
    }
});

var Legend = React.createClass({
    displayName: "Legend",

    render: function render() {
        return React.createElement("g", { className: "legend" }, React.createElement("rect", {
            x: this.props.x,
            y: this.props.y,
            width: this.props.width,
            height: this.props.height
        }), React.createElement("rect", {
            id: "legend-female",
            x: this.props.x + 20,
            y: this.props.y + 20,
            width: 20,
            height: 20
        }), React.createElement("text", {
            x: this.props.x + 50,
            y: this.props.y + 35
        }, "Female"), React.createElement("rect", {
            id: "legend-male",
            x: this.props.x + 20,
            y: this.props.y + 50,
            width: 20,
            height: 20
        }), React.createElement("text", {
            x: this.props.x + 50,
            y: this.props.y + 65
        }, "Male"), React.createElement("rect", {
            className: "genes",
            x: this.props.x + 20,
            y: this.props.y + 90,
            width: 20,
            height: 20
        }), React.createElement("text", {
            x: this.props.x + 50,
            y: this.props.y + 105
        }, "Genes"), React.createElement("rect", {
            className: "snp",
            x: this.props.x + 20,
            y: this.props.y + 130,
            width: 20,
            height: 20
        }), React.createElement("text", {
            x: this.props.x + 50,
            y: this.props.y + 145
        }, "SNPs"), React.createElement("rect", {
            className: "chip-peak",
            x: this.props.x + 20,
            y: this.props.y + 170,
            width: 20,
            height: 20
        }), React.createElement("text", {
            x: this.props.x + 50,
            y: this.props.y + 180
        }, "ENCODE ChIP-peak"), React.createElement("text", {
            className: "caption",
            x: this.props.x + 50,
            y: this.props.y + 195
        }, "HSMM H3K4me1"));
    }
});

var XAxis = React.createClass({
    displayName: "XAxis",

    getDefaultProps: function getDefaultProps() {
        var xScale = d3.scale.linear().domain([0, 1]).range([0, 1]);

        return {
            label: "",
            origin: { x: 0, y: 0 },
            width: 0,
            height: 0,
            xScale: { xScale },
            ticks: []
        };
    },

    render: function render() {

        var props = this.props;
        var ticks = props.xScale.ticks(10).map(function (t) {
            return React.createElement(XTick, {
                x: props.xScale(t),
                y: props.origin.y,
                label: t
            });
        });

        return React.createElement("g", { className: "axis", id: "x-axis" }, React.createElement("text", {
            x: props.origin.x + props.width,
            y: props.origin.y + props.height,
            dx: "0",
            dy: "-0.5em",
            textAnchor: "end"
        }, props.label), React.createElement("line", {
            x1: props.origin.x,
            x2: props.origin.x + props.width,
            y1: props.origin.y,
            y2: props.origin.y
        }), ticks);
    }

});

var YAxis = React.createClass({
    displayName: "YAxis",

    getDefaultProps: function getDefaultProps() {
        var yScale = d3.scale.linear().domain([0, 1]).range([0, 1]);

        return {
            label: "",
            origin: 0,
            width: 0,
            yScale: { yScale },
            ticks: []
        };
    },

    render: function render() {

        var props = this.props;
        var tickValues = [0, 0.2, 0.6, 1];
        var ticks = tickValues.map(function (t) {
            return React.createElement(YTick, {
                x: props.origin.x,
                y: props.yScale(t),
                label: t
            });
        });
        var dx = "-" + props.label.length + "em";

        return React.createElement("g", { className: "axis", id: "y-axis" }, React.createElement("text", {
            className: "y-axis-label",
            x: props.origin.x,
            y: props.yScale(1),
            dx: dx,
            dy: "-1em",
            textAnchor: "start",
            transform: "translate(0,0) rotate(-90)"
        }, props.label), React.createElement("line", {
            x1: props.origin.x,
            x2: props.origin.x,
            y1: props.yScale(0),
            y2: props.yScale(1)
        }), ticks);
    }
});

var XTick = React.createClass({
    displayName: "XTick",

    getDefaultProps: function getDefaultProps() {
        return {
            label: "",
            x: 0,
            y: 0
        };
    },

    render: function render() {
        var props = this.props;
        return React.createElement("g", { className: "axis" }, React.createElement("text", {
            className: "x-axis-ticks-label",
            x: props.x,
            y: props.y + 5,
            dy: "1em",
            textAnchor: "middle"
        }, props.label), React.createElement("line", {
            className: "x-axis-ticks-line",
            x1: props.x,
            x2: props.x,
            y1: props.y,
            y2: props.y + 5
        }));
    }
});

var YTick = React.createClass({
    displayName: "YTick",

    getDefaultProps: function getDefaultProps() {
        return {
            label: "",
            x: 0,
            y: 0
        };
    },

    render: function render() {
        var props = this.props;
        return React.createElement("g", { className: "axis" }, React.createElement("text", {
            className: "y-axis-ticks-label",
            x: props.x - 6,
            y: props.y,
            dy: ".3em",
            textAnchor: "end"
        }, props.label), React.createElement("line", {
            className: "y-axis-ticks-line",
            x1: props.x,
            x2: props.x - 5,
            y1: props.y,
            y2: props.y
        }));
    }
});