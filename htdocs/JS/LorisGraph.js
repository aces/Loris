var ACES_Scatterplot = function() {
    var chart;
    var that = this;
    var ChartOptions = {
        chart: {
            renderTo: 'scatterplot', 
            defaultSeriesType: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: 'Score Versus Age of Candidates'
        },
        xAxis: {
            id: 'XAxis',
            title: {
                enabled: true,
                text: 'Age (Months)'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            id: 'YAxis',
            title: {
                text: 'Score'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        tooltip: {
            id: 'tooltip',

            formatter: function() {
                retval = this.point.name + '<br />';
                if(that.XFormat(this.x, this.point)) {
                    retval += that.XFormat(this.x, this.point);
                } else {
                    retval += this.x +'<br />';
                }
                if(that.YFormat(this.x, this.point)) {
                    retval += that.YFormat(this.y, this.point);
                } else {
                    retval += this.y +'<br />' ;
                }

                return retval;
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: '#FFFFFF',
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                }
            }
        }
    };
    var series = [{
            animation: false,
            name: 'Within Window',
            color: 'rgba(223, 83, 83, .5)',
            data: []
        }, {
            animation: false,
            name: 'Outside Window',
            color: 'rgba(119, 152, 191, .5)',
            data: []
        }
    ]; 

    this.RenderChart = function() {
        // Basic setup for Highcharts Scatterplot
            
        jQuery.get(this.CSVUrl, function(cdata) {
            var CSVData = jQuery.csv(',', '"', "\n")(cdata);
            series[0].data = [];
            series[1].data = [];

            jQuery.each(CSVData, function(lineNo, line) {
                dataPoint = { 
                    x: parseFloat(line[1]), 
                    y: parseFloat(line[2]), 
                    name: line[0]
                };
                for(i = 4; i < line.length; i++) {
                    if(line[i] && that.CSVExtraFields 
                            && that.CSVExtraFields[i-4]) {
                        dataPoint[that.CSVExtraFields[i-4]] = line[i];
                    }
                }
                if(line[3] < 0) {
                    series[1].data.push(dataPoint);
                } else {
                    //series[0].data.push([line[1], line[2]]);
                    series[0].data.push(dataPoint);
                }
            });
            ChartOptions.series = series;
            if(!chart) {
                chart = new Highcharts.Chart(ChartOptions);
            } else {
                chart.series[0].setData(series[0].data);
                chart.series[1].setData(series[1].data);
                chart.redraw();
            }
        });
    };
    this.CSVUrl = '';
    this.XTitle = 'Score';
    this.YTitle = 'Age (Months)';
    this.UpdateTitle = function() {
        chart.setTitle({
            text: '' + this.XTitle + ' Versus ' + this.YTitle
        });
    };
    this.UpdateXField = function(name) {
        this.XTitle = name;
        if(chart) {
            axis = chart.get('XAxis');
            axis.axisTitle.element.textContent = name;
            chart.xAxis[0].axisTitle.textStr = name
            this.UpdateTitle();
            chart.redraw();
        }
    };
    this.UpdateYField = function(name) {
        this.YTitle = name;
        if(chart) {
            axis = chart.get('YAxis');
            axis.axisTitle.element.textContent = name;
            chart.yAxis[0].axisTitle.textStr = name
            this.UpdateTitle();
        }
    };
    newlineform= function(val) { return '' + val + '<br />'; };
    this.XFormat = newlineform;
    this.YFormat = newlineform;

    return this;
};
