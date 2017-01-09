"use strict";

var GenomicViewer = React.createClass({
    displayName: "GenomicViewer",

    propTypes: {
        DataURL: React.PropTypes.string.isRequired
    },

    getDefaultProps: function getDefaultProps() {
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

    getInitialState: function getInitialState() {
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

    addGroup: function addGroup(group) {
        this.props.groupBy = group;
    },

    handleResize: function handleResize(event) {
        console.log('resizing');
    },

    componentDidMount: function componentDidMount() {
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
            xhr: function xhr() {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener("progress", function (evt) {
                    that.setState({
                        loadedData: evt.loaded
                    });
                });
                return xhr;
            },
            success: function (data) {
                that.setState({
                    data: that.calculateGroupedValues(data, that.props.groupBy),
                    isLoaded: true
                });
            }.bind(that),
            error: function error(data) {
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
            xhr: function xhr() {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener("progress", function (evt) {
                    that.setState({
                        loadedDataSNP: evt.loaded
                    });
                });
                return xhr;
            },
            success: function (data) {
                that.setState({
                    dataSNP: that.formatSNP(data),
                    isLoadedSNP: true
                });
            }.bind(that),
            error: function error(data) {
                that.setState({ "error": "Unknown error loading data" });
            }
        });
    },

    calculateGroupedValues: function calculateGroupedValues(data, groupBy) {

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
            })) || quartiles[1];
            var whiskerDown = jStat.min(beta_values.filter(function (x) {
                return x > quartiles[0] - 1.5 * iqr;
            })) || quartiles[1];
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

    formatSNP: function formatSNP(data) {
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

    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
        return true;
    },

    showBoxSummary: function showBoxSummary(event) {
        var boxName = $(event.currentTarget).attr("title");
        $(event.currentTarget).addClass('selected');
        var item = {};

        item[boxName] = this.state.data[boxName];
        this.setState({ summaryItems: [item] });
    },

    getGroupColors: function getGroupColors() {
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

    render: function render() {

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
            React.createElement(InfoPanel, { id: "infoPanel", data: this.state.summaryItems, groupColors: groupColors })
        );
    }
});