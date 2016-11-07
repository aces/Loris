"use strict";

var GenomicViewer = React.createClass({
    displayName: "GenomicViewer",

    propTypes: {
        DataURL: React.PropTypes.string.isRequired
    },

    getDefaultProps: function () {
        return {
            width: 0,
            height: 0,
            DataURL: "",
            chromosome: "1",
            startLoc: "1",
            endLoc: "1",
            groupBy: ""
        };
    },

    getInitialState: function () {
        return {
            data: {},
            snpData: {},
            summaryItems: [],
            isLoaded: false,
            isLoadedSNP: false,
            loadedData: 0,
            loadedDataSNP: 0
        };
    },

    addGroup: function (group) {
        this.props.groupBy = group;
    },

    handleResize: function (event) {
        console.log('resizing');
    },

    componentDidMount: function () {
        var that = this;
        var props = this.props;

        window.addEventListener('resize', this.handleResize);

        // Temporary grouping
        that.addGroup("gender");

        $.ajax(this.props.DataURL, {
            dataType: 'json',
            data: {
                chromosome: props.chromosome,
                startLoc: props.startLoc,
                endLoc: props.endLoc
            },
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener("progress", function (evt) {
                    that.setState({
                        loadedData: evt.loaded
                    });
                });
                return xhr;
            },
            success: (function (data) {
                that.setState({
                    data: that.calculateGroupedValues(data, that.props.groupBy),
                    isLoaded: true
                });
            }).bind(that),
            error: function (data) {
                that.setState({ "error": "Unknown error loading data" });
            }
        });

        $.ajax('/AjaxHelper.php?Module=genomic_browser&script=getSNP.php', {
            dataType: 'json',
            data: {
                chromosome: props.chromosome,
                startLoc: props.startLoc,
                endLoc: props.endLoc
            },
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener("progress", function (evt) {
                    that.setState({
                        loadedDataSNP: evt.loaded
                    });
                });
                return xhr;
            },
            success: (function (data) {
                that.setState({
                    dataSNP: that.formatSNP(data),
                    isLoadedSNP: true
                });
            }).bind(that),
            error: function (data) {
                that.setState({ "error": "Unknown error loading data" });
            }
        });
    },

    calculateGroupedValues: function (data, groupBy) {

        var aggregatedValues = {};
        var datadict = {};

        console.log('data');
        console.log(data);

        var formatedData = data.map(function (elem) {

            // TODO :: This need to be dynamic
            var id = elem.cpg + "_" + elem[groupBy];

            datadict[elem.cpg] = { genomic_location: Number(elem.cpg_loc) };

            return [id, Number(elem.beta_value)];
        }).reduce(function (last, now) {

            var uniqueId = now[0];
            var beta_value = now[1];
            if (Array.isArray(last[now[0]])) {
                last[uniqueId].push(beta_value);
            } else {
                last[uniqueId] = [beta_value];
            }

            return last;
        }, {});

        console.log('formatedData');
        console.log(formatedData);

        for (var group in formatedData) {
            var beta_values = formatedData[group].sort();
            var cardinality = beta_values.length;
            var quartiles = jStat.quartiles(beta_values);
            if (quartiles[0] === undefined) {
                quartiles[0] = quartiles[1];
            }
            var iqr = quartiles[2] - quartiles[0];
            var whiskerUp = jStat.max(beta_values.filter(function (x) {
                return x < quartiles[2] + 1.5 * iqr;
            }));
            var whiskerDown = jStat.min(beta_values.filter(function (x) {
                return x > quartiles[0] - 1.5 * iqr;
            }));
            var outliers = beta_values.filter(function (x) {
                return x < quartiles[0] - 1.5 * iqr || x > quartiles[2] + 1.5 * iqr;
            });
            var arayedId = group.split('_');
            var cpg_name = arayedId[0];
            var group_label = arayedId[1];

            if (typeof aggregatedValues[cpg_name] != "undefined") {
                aggregatedValues[cpg_name].grouped_values.push({
                    group_label: group_label,
                    n: cardinality,
                    q1: quartiles[0].toFixed(3),
                    median: quartiles[1].toFixed(3),
                    q3: quartiles[2].toFixed(3),
                    whiskerUp: whiskerUp !== undefined ? whiskerUp.toFixed(3) : null,
                    whiskerDown: whiskerDown !== undefined ? whiskerDown.toFixed(3) : null,
                    outliers: outliers.map(function (o) {
                        return o.toFixed(3);
                    })
                });
            } else {
                aggregatedValues[cpg_name] = {
                    x: datadict[cpg_name].genomic_location,
                    grouped_values: [{
                        group_label: group_label,
                        n: cardinality,
                        q1: quartiles[0].toFixed(3),
                        median: quartiles[1].toFixed(3),
                        q3: quartiles[2].toFixed(3),
                        whiskerUp: whiskerUp.toFixed(3),
                        whiskerDown: whiskerDown.toFixed(3),
                        outliers: outliers.map(function (o) {
                            return o.toFixed(3);
                        })
                    }]
                };
            }
        }

        console.log('aggregatedValues');
        console.log(aggregatedValues);

        return aggregatedValues;
    },

    formatSNP: function (data) {
        console.log('formatSNP');
        console.log(data);

        //{"rs001": {"genomic_location": 15000400, "alleles":["A","G"]}};
        var snps = {};
        data.forEach(function (snp) {
            snps[snp.rsID] = {
                rsID: snp.rsID,
                genomic_location: snp.genomic_location,
                alleles: [snp.a1, snp.a2]
            };
        });

        this.setState({ snpData: snps });
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    showBoxSummary: function (event) {
        var boxName = $(event.currentTarget).attr("title");
        $(event.currentTarget).addClass('selected');
        var item = {};

        item[boxName] = this.state.data[boxName];
        this.setState({ summaryItems: [item] });
    },

    getGroupColors: function () {
        var that = this;
        var groupColors = {};
        var colorScale = d3.scale.category10();

        Object.keys(that.state.data).forEach(function (key) {
            that.state.data[key].grouped_values.forEach(function (g) {
                groupColors[g.group_label] = colorScale(g.group_label);
            });
        });

        return groupColors;
    },

    render: function () {

        var groupColors = this.getGroupColors();
        return React.createElement(
            "div",
            { id: "chart-container" },
            React.createElement(Chart, {
                className: "chart",
                width: this.props.width,
                height: this.props.height,
                data: this.state.data,
                snpData: this.state.snpData,
                groupColors: groupColors,
                chromosome: this.props.chromosome,
                from: this.props.startLoc,
                to: this.props.endLoc,
                onClickHandler: this.showBoxSummary
            }),
            React.createElement(InfoPanel, {
                id: "infoPannel",
                data: this.state.summaryItems,
                groupColors: groupColors
            })
        );
    }
});

var InfoPanel = React.createClass({
    displayName: "InfoPanel",

    getDefaultProps: function () {
        return {
            data: [],
            colorScale: null
        };
    },

    getInitialState: function () {
        return {
            items: this.props.data
        };
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    render: function () {
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
                    return React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            { style: style },
                            group.group_label
                        ),
                        React.createElement(
                            "td",
                            null,
                            group.n
                        ),
                        React.createElement(
                            "td",
                            null,
                            group.whiskerDown
                        ),
                        React.createElement(
                            "td",
                            null,
                            group.q1
                        ),
                        React.createElement(
                            "td",
                            null,
                            group.median
                        ),
                        React.createElement(
                            "td",
                            null,
                            group.q3
                        ),
                        React.createElement(
                            "td",
                            null,
                            group.whiskerUp
                        ),
                        React.createElement(
                            "td",
                            null,
                            group.outliers.join(', ')
                        )
                    );
                });

                return React.createElement(
                    "div",
                    {
                        key: String.fromCharCode(65 + i, 65 + j)
                    },
                    React.createElement(
                        "table",
                        null,
                        React.createElement(
                            "caption",
                            null,
                            label
                        ),
                        React.createElement(
                            "th",
                            null,
                            React.createElement(
                                "td",
                                null,
                                "n"
                            ),
                            React.createElement(
                                "td",
                                null,
                                "Low"
                            ),
                            React.createElement(
                                "td",
                                null,
                                "Q1"
                            ),
                            React.createElement(
                                "td",
                                null,
                                "Median"
                            ),
                            React.createElement(
                                "td",
                                null,
                                "Q3"
                            ),
                            React.createElement(
                                "td",
                                null,
                                "High"
                            ),
                            React.createElement(
                                "td",
                                null,
                                "Outliers"
                            )
                        ),
                        rowItems
                    )
                );
            });
            return content;
        });

        return React.createElement(
            "div",
            { id: "info-panel" },
            info
        );
    }
});

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

        var xScale = d3.scale.linear().domain([this.props.from, this.props.to]).range([origin.x + 15, this.props.width - this.props.margin.left - this.props.leftLegendSpacing - 15]);

        var yScale = d3.scale.linear().domain([0, 1]).range([origin.y, this.props.margin.top + this.props.topTitleHeight]);

        var title = "Beta values of participants grouped by gender for CpGs located on Chr" + this.props.chromosome + ":" + this.props.from + "-" + this.props.to;

        var snpsList = this.props.snpData;

        return React.createElement(
            "svg",
            {
                className: "chart",
                width: this.props.width,
                height: this.props.height
            },
            React.createElement(
                "g",
                null,
                React.createElement(Title, {
                    text: title,
                    x: (this.props.width - this.props.margin.left - this.props.yAxisWidth - this.props.leftLegendSpacing - this.props.margin.right) / 2 + this.props.margin.left + this.props.yAxisWidth,
                    y: this.props.margin.top + this.props.topTitleHeight
                }),
                React.createElement(Legend, {
                    x: this.props.width - this.props.margin.right - this.props.leftLegendSpacing,
                    y: this.props.margin.top + this.props.topTitleHeight,
                    width: this.props.leftLegendSpacing,
                    height: this.props.height - this.props.margin.top - this.props.topTitleHeight - this.props.margin.bottom - this.props.xAxisHeight
                }),
                React.createElement(YAxis, {
                    label: "beta value",
                    leftMargin: this.props.margin.left,
                    origin: origin,
                    height: this.props.height - this.props.margin.top - this.props.topTitleHeight - this.props.margin.bottom - this.props.xAxisHeight,
                    yScale: yScale
                }),
                React.createElement(XAxis, {
                    label: "genomic location",
                    origin: origin,
                    width: this.props.width - this.props.margin.left - this.props.margin.right - this.props.leftLegendSpacing - this.props.yAxisWidth,
                    xScale: xScale,
                    height: this.props.xAxisHeight
                }),
                React.createElement(SNP_track, {
                    snpsList: snpsList,
                    xScale: xScale,
                    y: yScale(0.1)
                }),
                React.createElement(Boxplot, {
                    width: this.props.width - this.props.margin.left - this.props.margin.right,
                    height: this.props.height - this.props.margin.top - this.props.margin.bottom,
                    data: this.props.data,
                    xScale: xScale,
                    yScale: yScale,
                    onClickHandler: this.props.onClickHandler,
                    groupColors: this.props.groupColors
                }),
                React.createElement(BrainMethyl_track, {
                    xScale: xScale,
                    yScale: yScale,
                    origin: origin,
                    chromosome: this.props.chromosome,
                    from: this.props.from,
                    to: this.props.to
                }),
                React.createElement(Genes_track, {
                    xScale: xScale,
                    yScale: yScale,
                    origin: origin,
                    chromosome: this.props.chromosome,
                    from: this.props.from,
                    to: this.props.to
                })
            )
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
            return React.createElement(
                "g",
                {
                    className: "group-box",
                    title: spreadBox[0].props.name,
                    "data-toggle": "tooltip",
                    onClick: that.props.onClickHandler
                },
                spreadBox.map(function (d) {
                    return d;
                })
            );
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
        return React.createElement(
            "g",
            {
                className: "plotPannel",
                id: "data-panel"
            },
            boxes
        );
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
            return React.createElement("circle", {
                style: style,
                className: "outlier",
                cx: xCenter,
                cy: value,
                r: "2"
            });
        });

        return React.createElement(
            "g",
            {
                className: "spread-box"
            },
            React.createElement("line", {
                className: "center-line",
                x1: xCenter,
                x2: xCenter,
                y1: this.props.whiskerUp,
                y2: this.props.whiskerDown
            }),
            React.createElement("rect", {
                className: "iqr-box",
                style: style,
                height: this.props.q1 - this.props.q3,
                width: this.props.width,
                x: this.props.x,
                y: this.props.q3
            }),
            React.createElement("line", {
                className: "median",
                x1: this.props.x,
                x2: this.props.x + this.props.width,
                y1: this.props.median,
                y2: this.props.median
            }),
            React.createElement("line", {
                className: "whisker",
                x1: this.props.x,
                x2: this.props.x + this.props.width,
                y1: this.props.whiskerUp,
                y2: this.props.whiskerUp
            }),
            React.createElement("line", {
                className: "whisker",
                x1: this.props.x,
                x2: this.props.x + this.props.width,
                y1: this.props.whiskerDown,
                y2: this.props.whiskerDown
            }),
            outliers
        );
    }
});

var Title = React.createClass({
    displayName: "Title",

    render: function () {
        return React.createElement(
            "text",
            {
                className: "chart-title",
                x: this.props.x,
                y: this.props.y,
                dy: "-.3em",
                textAnchor: "middle"
            },
            this.props.text
        );
    }
});

var Legend = React.createClass({
    displayName: "Legend",

    render: function () {
        return React.createElement(
            "g",
            { className: "legend" },
            React.createElement("rect", {
                x: this.props.x,
                y: this.props.y,
                width: this.props.width,
                height: this.props.height
            }),
            React.createElement("rect", {
                id: "legend-female",
                x: this.props.x + 20,
                y: this.props.y + 20,
                width: 20,
                height: 20
            }),
            React.createElement(
                "text",
                {
                    x: this.props.x + 50,
                    y: this.props.y + 35
                },
                "Female"
            ),
            React.createElement("rect", {
                id: "legend-male",
                x: this.props.x + 20,
                y: this.props.y + 50,
                width: 20,
                height: 20
            }),
            React.createElement(
                "text",
                {
                    x: this.props.x + 50,
                    y: this.props.y + 65
                },
                "Male"
            ),
            React.createElement("rect", {
                className: "genes",
                x: this.props.x + 20,
                y: this.props.y + 90,
                width: 20,
                height: 20
            }),
            React.createElement(
                "text",
                {
                    x: this.props.x + 50,
                    y: this.props.y + 105
                },
                "Genes"
            ),
            React.createElement("rect", {
                className: "snp",
                x: this.props.x + 20,
                y: this.props.y + 130,
                width: 20,
                height: 20
            }),
            React.createElement(
                "text",
                {
                    x: this.props.x + 50,
                    y: this.props.y + 145
                },
                "SNPs"
            ),
            React.createElement("rect", {
                className: "chip-peak",
                x: this.props.x + 20,
                y: this.props.y + 170,
                width: 20,
                height: 20
            }),
            React.createElement(
                "text",
                {
                    x: this.props.x + 50,
                    y: this.props.y + 180
                },
                "ENCODE ChIP-peak"
            ),
            React.createElement(
                "text",
                {
                    className: "caption",
                    x: this.props.x + 50,
                    y: this.props.y + 195
                },
                "HSMM H3K4me1"
            )
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
            return React.createElement(XTick, {
                x: props.xScale(t),
                y: props.origin.y,
                label: t
            });
        });

        return React.createElement(
            "g",
            { className: "axis", id: "x-axis" },
            React.createElement(
                "text",
                {
                    x: props.origin.x + props.width,
                    y: props.origin.y + props.height,
                    dx: "0",
                    dy: "-0.5em",
                    textAnchor: "end"
                },
                props.label
            ),
            React.createElement("line", {
                x1: props.origin.x,
                x2: props.origin.x + props.width,
                y1: props.origin.y,
                y2: props.origin.y
            }),
            ticks
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
            return React.createElement(YTick, {
                x: props.origin.x,
                y: props.yScale(t),
                label: t
            });
        });
        var dx = "-" + props.label.length + "em";

        return React.createElement(
            "g",
            { className: "axis", id: "y-axis" },
            React.createElement(
                "text",
                {
                    className: "y-axis-label",
                    x: props.origin.x,
                    y: props.yScale(1),
                    dx: dx,
                    dy: "-1em",
                    textAnchor: "start",
                    transform: "translate(0,0) rotate(-90)"
                },
                props.label
            ),
            React.createElement("line", {
                x1: props.origin.x,
                x2: props.origin.x,
                y1: props.yScale(0),
                y2: props.yScale(1)
            }),
            ticks
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
        return React.createElement(
            "g",
            { className: "axis" },
            React.createElement(
                "text",
                {
                    className: "x-axis-ticks-label",
                    x: props.x,
                    y: props.y + 5,
                    dy: "1em",
                    textAnchor: "middle"
                },
                props.label
            ),
            React.createElement("line", {
                className: "x-axis-ticks-line",
                x1: props.x,
                x2: props.x,
                y1: props.y,
                y2: props.y + 5
            })
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
        return React.createElement(
            "g",
            { className: "axis" },
            React.createElement(
                "text",
                {
                    className: "y-axis-ticks-label",
                    x: props.x - 6,
                    y: props.y,
                    dy: ".3em",
                    textAnchor: "end"
                },
                props.label
            ),
            React.createElement("line", {
                className: "y-axis-ticks-line",
                x1: props.x,
                x2: props.x - 5,
                y1: props.y,
                y2: props.y
            })
        );
    }
});

var SNP_track = React.createClass({
    displayName: "SNP_track",

    getDefaultProps: function () {
        return {
            snpsList: {},
            xscale: null,
            y: 0
        };
    },

    render: function () {
        var that = this;
        var xScale = this.props.xScale;
        var snps = Object.keys(this.props.snpsList).map(function (key) {

            var alleles = that.props.snpsList[key].alleles;
            var x = xScale(that.props.snpsList[key].genomic_location);
            var title = that.props.snpsList[key].rsID;

            return(
                React.createElement(
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
                        title
                    )
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
                return React.createElement("rect", {
                    x: x,
                    y: y,
                    height: height,
                    width: width
                });
            }
        });

        return React.createElement(
            "g",
            {
                id: "wgEncodeBroadHistoneHsmmH3k4me1StdPk",
                className: "chip-peak"
            },
            features
        );
    }
});

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
