"use strict";

var Chart = React.createClass({
    displayName: "Chart",

    getDefaultProps: function () {
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

    getInitialState: function () {
        return {
            features: []
        };
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    render: function () {

        var origin = {
            x: this.props.margin.left + this.props.yAxisWidth,
            y: this.props.height - this.props.xAxisHeight
        };

        var title = "Beta values of participants grouped by gender for CpGs located on Chr" + this.props.chromosome + ":" + this.props.from + "-" + this.props.to;
        var xScale = d3.scale.linear().domain([this.props.from, this.props.to]).range([origin.x + 15, this.props.width - this.props.margin.left - this.props.leftLegendSpacing - 15]);
        var yScale = d3.scale.linear().domain([0, 1]).range([origin.y, this.props.margin.top + this.props.topTitleHeight]);
        var snpsList = this.props.snpData;

        return (
          <svg className="chart" width={this.props.width} height={this.props.height}>
            <g>
              <Title
                text={title}
                x={(this.props.width - this.props.margin.left - this.props.yAxisWidth - this.props.leftLegendSpacing - this.props.margin.right) / 2 + this.props.margin.left + this.props.yAxisWidth}
                y={this.props.margin.top + this.props.topTitleHeight}
              />
              <Legend 
                x={this.props.width - this.props.margin.right - this.props.leftLegendSpacing}
                y={this.props.margin.top + this.props.topTitleHeight}
                width={this.props.leftLegendSpacing}
                height={this.props.height - this.props.margin.top - this.props.topTitleHeight - this.props.margin.bottom - this.props.xAxisHeight}
              /> 
              <YAxis
                label="beta value"
                leftMargin={this.props.margin.left}
                origin={origin}
                height={this.props.height - this.props.margin.top - this.props.topTitleHeight - this.props.margin.bottom - this.props.xAxisHeight}
                yScale={yScale}
              />
              <XAxis
                label="genomic location"
                origin={origin}
                width={this.props.width - this.props.margin.left - this.props.margin.right - this.props.leftLegendSpacing - this.props.yAxisWidth}
                xScale={xScale}
                height={this.props.xAxisHeight}
              />
              <SNPTrack
                snpsList={snpsList}
                xScale={xScale}
                y={yScale(0.1)}
              />
              <Boxplot
                width={this.props.width - this.props.margin.left - this.props.margin.right}
                height={this.props.height - this.props.margin.top - this.props.margin.bottom}
                data={this.props.data}
                xScale={xScale}
                yScale={yScale}
                onClickHandler={this.props.onClickHandler}
                groupColors={this.props.groupColors}
              />
              <BrainMethyl_track
                xScale={xScale}
                yScale={yScale}
                origin={origin}
                chromosome={this.props.chromosomer}
                from={this.props.from}
                to={this.props.to}
              />
              <Genes_track
                xScale={xScale}
                yScale={yScale}
                origin={origin}
                chromosome={this.props.chromosome}
                from={this.props.from}
                to={this.props.to}
              />
            </g>
          </svg>
        );
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

    getDefaultProps: function () {
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

    componentDidMount: function () {
        console.log("Boxplot loaded");
    },

    render: function () {

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

                return (
                  <SpreadBox 
                    x={xScale(x) - boxwidth / 2 + elemWidth * index}
                    name={key}
                    group_label={elem.group_label}
                    median={yScale(elem.median)}
                    width={elemWidth}
                    q1={yScale(elem.q1)}
                    q3={yScale(elem.q3)}
                    whiskerUp={yScale(elem.whiskerUp)}
                    whiskerDown={yScale(elem.whiskerDown)}
                    outliers={elem.outliers.map(function (value) {
                        return yScale(value);
                    })}
                    color={that.props.groupColors[elem.group_label]}
                  />
                );
            }));
        });

        boxes = boxes.map(function (spreadBox) {
            return (
              <g
                className="group-box"
                title={spreadBox[0].props.name}
                data-toggle= "tooltip"
                onClick={that.props.onClickHandler}
              >
                {spreadBox.map(function (d) {return d;})}
              </g>
            );

        });

        return (<g className="plotPannel" id="data-panel">{boxes}</g>);
    }
});

var SpreadBox = React.createClass({
    displayName: "SpreadBox",

    getDefaultProps: function () {
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

    componentDidMount: function () {
        console.log(this.props.name + " mounted");
    },

    render: function () {
        var xCenter = this.props.x + this.props.width * 0.5;
        var style = { fill: this.props.color };
        var outliers = this.props.outliers.map(function (value) {
            return (
              <circle
                style={style}
                className="outlier"
                cx={xCenter}
                cy={value}
                r="2"
              />
            );
        });

        return (
          <g className="spread-box">
            <line
              className="center-line"
              x1={xCenter}
              x2={xCenter}
              y1={this.props.whiskerUp}
              y2={this.props.whiskerDown}
            />
            <rect
              className="iqr-box"
              style={style}
              height={this.props.q1 - this.props.q3}
              width={this.props.width}
              x={this.props.x}
              y={this.props.q3}
            />
            <line
              className="median"
              x1={this.props.x}
              x2={this.props.x + this.props.width}
              y1={this.props.median}
              y2={this.props.median} 
            />
            <line 
              className="whisker"
              x1={this.props.x}
              x2={this.props.x + this.props.width}
              y1={this.props.whiskerUp}
              y2={this.props.whiskerUp}
            />
            <line 
              className="whisker"
              x1={this.props.x}
              x2={this.props.x + this.props.width}
              y1={this.props.whiskerDown}
              y2={this.props.whiskerDown}
            />
          </g>
        );
    }
});

var Title = React.createClass({
    displayName: "Title",

    render: function () {
      return (
        <text
          className="chart-title"
          x={this.props.x}
          y={this.props.y}
          dy="-.3em"
          textAnchor="middle"
        >{this.props.text}</text>
      );
    }
});

var Legend = React.createClass({
    displayName: "Legend",

    render: function () {
        return (
          <g className="legend">
            <rect
              x={this.props.x}
              y={this.props.y}
              width={this.props.width}
              height={this.props.height}
            />
            <rect
              id="legend-female"
              x={this.props.x + 20}
              y={this.props.y + 20}
              width="20"
              height="20"
            />
            <text 
              x={this.props.x + 50}
              y={this.props.y + 35}
            >
              "Female"
            </text>
            <rect 
              id="legend-male"
              x={this.props.x + 20}
              y={this.props.y + 50}
              width="20"
              height="20"
            />
            <text 
              x={this.props.x + 50}
              y={this.props.y + 65}
            >
              "Male"
            </text>
            <rect 
              className="genes"
              x={this.props.x + 20}
              y={this.props.y + 90}
              width="20"
              height="20"
            />
            <text
              x={this.props.x + 50}
              y={this.props.y + 105}
            >
              "Genes"
            </text>
            <rect 
              className="snp"
              x={this.props.x + 20}
              y={this.props.y + 130}
              width="20"
              height="20"
            />
            <text
              x={this.props.x + 50}
              y={this.props.y + 145}
            >
              "SNPs"
            </text>
            <rect
              className="chip-peak"
              x={this.props.x + 20}
              y={this.props.y + 170}
              width="20"
              height="20"
            />
            <text
              x={this.props.x + 50}
              y={this.props.y + 180}
            >
              "ENCODE ChIP-peak"
            </text>
            <text
              x={this.props.x + 50}
              y={this.props.y + 195}
            >
              "HSMM H3K4me1"
            </text>
          </g>
        );
    }
});

var XAxis = React.createClass({
    displayName: "XAxis",

    getDefaultProps: function () {
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

    render: function () {

        var props = this.props;
        var ticks = props.xScale.ticks(10).map(function (t) {
            return (
              <XTick 
                x={props.xScale(t)}
                y={props.origin.y}
                label={t}
              />
            );
        });

        return (
          <g clasName="axis" id="x-axis">
            <text
              x={props.origin.x + props.width}
              y={props.origin.y + props.height}
              dx="0"
              dy="-0.5em"
              textAnchor="end"
            >
              {props.label}
            </text>
            <line 
              x1={props.origin.x}
              x2={props.origin.x + props.width}
              y1={props.origin.y}
              y2={props.origin.y}
            />
            {ticks}
          </g>
        );
    }
});

var YAxis = React.createClass({
    displayName: "YAxis",

    getDefaultProps: function () {
        var yScale = d3.scale.linear().domain([0, 1]).range([0, 1]);

        return {
            label: "",
            origin: 0,
            width: 0,
            yScale: { yScale },
            ticks: []
        };
    },

    render: function () {

        var props = this.props;
        var tickValues = [0, 0.2, 0.6, 1];
        var ticks = tickValues.map(function (t) {
            return (
              <YTick
                x={props.origin.x}
                y={props.yScale(t)}
                label={t}
              />
            );
        });
        var dx = "-" + props.label.length + "em";

        return (
          <g className="axis" id="y-axis">
            <text
              className="y-axis-label"
              x={props.origin.x}
              y={props.yScale(1)}
              dx={dx}
              dy="-1em"
              textAnchor="start"
              transform="translate(0,0) rotate(-90)"
            >
              {props.label}
            </text>
            <line 
              x1={props.origin.x}
              x2={props.origin.x}
              y1={props.yScale(0)}
              y2={props.yScale(1)}
            />
            {ticks}
          </g>
        );
    }
});

var XTick = React.createClass({
    displayName: "XTick",

    getDefaultProps: function () {
        return {
            label: "",
            x: 0,
            y: 0
        };
    },

    render: function () {
        var props = this.props;
        return (
          <g className="axis">
            <text 
              className="x-axis-ticks-label"
              x={props.x}
              y={props.y + 5}
              dy="1em"
              textAnchor="middle"
            >
              {props.label}
            </text>
            <line 
              className="x-axis-ticks-line"
              x1={props.x}
              x2={props.x}
              y1={props.y}
              y2={props.y + 5}
            />
          </g>
        );
    }
});

var YTick = React.createClass({
    displayName: "YTick",

    getDefaultProps: function () {
        return {
            label: "",
            x: 0,
            y: 0
        };
    },

    render: function () {
        var props = this.props;
        return (
          <g className="axis">
            <text
              className="y-axis-ticks-label"
              x={props.x - 6}
              y={props.y}
              dy=".3em"
              textAnchor="end"
            >
              {props.label}
            </text>
            <line 
              className="y-axis-ticks-line"
              x1={props.x}
              x2={props.x - 5}
              y1={props.y}
              y2={props.y}
            />
          </g>
        );
    }
});
