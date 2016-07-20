/**
 *  The following file contains the components used for displaying the tab content
 *
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @author   Jordan Stirling <jstirling91@gmail.com>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://github.com/mohadesz/Loris-Trunk
 */

/*
 *  The following component is the base component for displaying the tab's contnet
 */
TabPane = React.createClass({
    displayName: "TabPane",

    mixins: [React.addons.PureRenderMixin],
    render: function () {
        var classList = "tab-pane";
        if (this.props.Active) {
            classList += " active";
        }
        return React.createElement(
            "div",
            { className: classList, id: this.props.TabId },
            React.createElement(
                "h1",
                null,
                this.props.Title
            ),
            this.props.children
        );
    }
});

/*
 *  The following component is used for displaying the info tab content
 */
InfoTabPane = React.createClass({
    displayName: "InfoTabPane",

    mixins: [React.addons.PureRenderMixin],
    render: function () {
        return React.createElement(
            TabPane,
            { Title: "Welcome to the Data Query Tool",
                TabId: this.props.TabId, Active: true },
            React.createElement(
                "p",
                null,
                "Data was last updated on ",
                this.props.UpdatedTime,
                "."
            ),
            React.createElement(
                "p",
                null,
                "Please define or use your query by using the following tabs."
            ),
            React.createElement(
                "dl",
                null,
                React.createElement(
                    "dt",
                    null,
                    "Define Fields"
                ),
                React.createElement(
                    "dd",
                    null,
                    "Define the fields to be added to your query here."
                ),
                React.createElement(
                    "dt",
                    null,
                    "Define Filters"
                ),
                React.createElement(
                    "dd",
                    null,
                    "Define the criteria to filter the data for your query here."
                ),
                React.createElement(
                    "dt",
                    null,
                    "View Data"
                ),
                React.createElement(
                    "dd",
                    null,
                    "See the results of your query."
                ),
                React.createElement(
                    "dt",
                    null,
                    "Statistical Analysis"
                ),
                React.createElement(
                    "dd",
                    null,
                    "Visualize or see basic statistical measures from your query here."
                ),
                React.createElement(
                    "dt",
                    null,
                    "Load Saved Query"
                ),
                React.createElement(
                    "dd",
                    null,
                    "Load a previously saved query (by name) by selecting from this menu."
                ),
                React.createElement(
                    "dt",
                    null,
                    "Manage Saved Queries"
                ),
                React.createElement(
                    "dd",
                    null,
                    "Either save your current query or see the criteria of previously saved quer  ies here."
                )
            )
        );
    }
});

/*
 *  The following component is used for displaying the field select tab content
 */
FieldSelectTabPane = React.createClass({
    displayName: "FieldSelectTabPane",

    render: function () {
        return React.createElement(
            TabPane,
            { TabId: this.props.TabId },
            React.createElement(FieldSelector, { title: "Fields",
                items: this.props.categories,
                onFieldChange: this.props.onFieldChange,
                selectedFields: this.props.selectedFields,
                Visits: this.props.Visits,
                fieldVisitSelect: this.props.fieldVisitSelect
            })
        );
    }

});

/*
 *  The following component is used for displaying the filter builder tab content
 */
FilterSelectTabPane = React.createClass({
    displayName: "FilterSelectTabPane",

    render: function () {
        return React.createElement(
            TabPane,
            { TabId: this.props.TabId },
            React.createElement(FilterBuilder, { items: this.props.categories,
                updateFilter: this.props.updateFilter,
                filter: this.props.filter,
                Visits: this.props.Visits
            })
        );
    }
});

/*
 *  The following component is used for displaying the view data tab content
 */
ViewDataTabPane = React.createClass({
    displayName: "ViewDataTabPane",

    getInitialState: function () {
        return { 'sessions': [] };
    },
    runQuery: function () {
        // Wrapper function to run the current query
        if (this.props.onRunQueryClicked) {
            this.props.onRunQueryClicked(this.props.Fields, this.props.Sessions);
        }
    },
    downloadCSV: function () {
        // Downloads the current loaded data into a CSV formatted file.
        // Makes use of a web worker to format and download the data
        var headers = this.props.Fields,
            csvworker = new Worker(loris.BaseURL + '/GetJS.php?Module=dataquery&file=workers/savecsv.js');

        csvworker.addEventListener('message', function (e) {
            var dataURL, dataDate, link;
            if (e.data.cmd === 'SaveCSV') {
                dataDate = new Date().toISOString();
                dataURL = window.URL.createObjectURL(e.data.message);
                link = document.createElement("a");
                link.download = "data-" + dataDate + ".csv";
                link.type = "text/csv";
                link.href = dataURL;
                $(link)[0].click();
            }
        });
        csvworker.postMessage({
            cmd: 'SaveFile',
            data: this.props.Data,
            headers: headers,
            identifiers: this.props.Sessions
        });
    },
    changeDataDisplay: function (displayID) {
        // Wrapper function to change the data display type
        this.props.changeDataDisplay(displayID);
    },
    getOrCreateProgressElement: function (id) {
        // Helper function to display the progress of downloading the downloadable
        // fields into a ZIP folder
        var element = document.getElementById(id),
            progress;

        if (element) {
            return element;
        }

        progress = document.getElementById("progress");

        element = document.createElement("div");
        element.setAttribute("id", id);
        progress.appendChild(element);
        return element;
    },
    getOrCreateDownloadLink: function (fileName, type) {
        // Helper function to create and click a downloadable link to download the
        // downloadable fields into a ZIP folder
        var element = document.getElementById("DownloadLink" + fileName),
            parentEl,
            el2;

        if (element) {
            return element;
        }

        parentEl = document.getElementById("downloadlinksUL");

        element = document.createElement("a");
        element.download = fileName;
        element.type = type;
        element.textContent = "Zip file: " + fileName;
        element.setAttribute("id", "DownloadLink" + fileName);
        el2 = document.createElement("li");
        el2.appendChild(element);
        parentEl.appendChild(el2);
        return element;
    },
    downloadData: function () {
        // Download the downloadable fields into a ZIP folder
        // Makes use of a web worker to format and download the data
        var zip = new JSZip(),
            i = 0,
            FileList = this.props.FileData,
            CompleteMask = new Array(FileList.length),
            saveworker,
            dataURLs = [],
            that = this,
            multiLinkHandler = function (buffer) {
            return function (ce) {
                var downloadLink = document.getElementById("DownloadLink"),
                    dv = new DataView(buffer),
                    blb;

                ce.preventDefault();
                blb = new Blob([dv], { type: "application/zip" });

                downloadLink.href = window.URL.createObjectURL(blb);
                downloadLink.download = this.download;
                downloadLink.type = "application/zip";
                downloadLink.click();

                window.URL.revokeObjectURL(downloadLink.href);
            };
        };

        // Does this work if we hold a global reference instead of a closure
        // to the object URL?
        window.dataBlobs = [];

        if (FileList.length < 100 || confirm("You are trying to download more than 100 files. This may be slow or crash your web browser.\n\nYou may want to consider splitting your query into more, smaller queries by defining more restrictive filters.\n\nPress OK to continue with attempting to download current files or cancel to abort.")) {
            saveworker = new Worker(loris.BaseURL + '/GetJS.php?Module=dataquery&file=workers/savezip.js');
            saveworker.addEventListener('message', function (e) {
                var link, progress, FileName, NewFileName, downloadLinks, i;
                if (e.data.cmd === 'SaveFile') {
                    progress = that.getOrCreateProgressElement("download_progress");
                    //progress.textContent = "Downloaded files";
                    //hold a reference to the blob so that chrome doesn't release it. This shouldn't
                    //be required.
                    window.dataBlobs[e.data.FileNo - 1] = new Blob([e.data.buffer], { type: "application/zip" });;
                    dataURLs[e.data.FileNo - 1] = window.URL.createObjectURL(window.dataBlobs[e.data.FileNo - 1]);

                    link = that.getOrCreateDownloadLink(e.data.Filename, "application/zip");
                    link.href = dataURLs[e.data.FileNo - 1];
                    //link.onclick = multiLinkHandler(e.data.buffer);
                    //link.href = "#";
                    progress = that.getOrCreateProgressElement("zip_progress");
                    progress.textContent = "";
                } else if (e.data.cmd === 'Progress') {
                    progress = that.getOrCreateProgressElement("download_progress");
                    progress.innerHTML = "Downloading files: <progress value=\"" + e.data.Complete + "\" max=\"" + e.data.Total + "\">" + e.data.Complete + " out of " + e.data.Total + "</progress>";
                } else if (e.data.cmd === 'Finished') {
                    if (dataURLs.length === 1) {
                        $("#downloadlinksUL li a")[0].click();
                    }

                    if (dataURLs.length > 1) {
                        progress = document.getElementById("downloadlinks");
                        progress.style.display = "initial";

                        downloadLinks = $("#downloadlinksUL li a");
                        for (i = 0; i < dataURLs.length; i += 1) {
                            FileName = downloadLinks[i].id.slice("DownloadLinkFiles-".length, -4);
                            NewFileName = "files-" + FileName + "of" + e.data.NumFiles + ".zip";
                            downloadLinks[i].download = NewFileName;
                            downloadLinks[i].href = dataURLs[i];
                            downloadLinks[i].textContent = "Zip file: " + NewFileName;
                        }
                    }
                    progress = that.getOrCreateProgressElement("download_progress");
                    progress.textContent = "Finished generating zip files";
                    //this.terminate();
                } else if (e.data.cmd === 'CreatingZip') {
                        progress = that.getOrCreateProgressElement("zip_progress");
                        progress.textContent = "Creating a zip file with current batch of downloaded files. Process may be slow before proceeding.";
                    }
            });

            saveworker.postMessage({ Files: FileList });
        }
    },
    render: function () {
        var downloadData;
        var buttons = React.createElement(
            "div",
            { className: "row" },
            React.createElement(
                "div",
                { className: "commands col-xs-12 form-group" },
                React.createElement(
                    "button",
                    { className: "btn btn-primary", onClick: this.runQuery },
                    "Run Query"
                ),
                React.createElement(
                    "button",
                    { className: "btn btn-primary", onClick: this.downloadCSV },
                    "Download Table as CSV"
                ),
                React.createElement(
                    "button",
                    { className: "btn btn-primary", onClick: this.downloadData },
                    "Download Data as ZIP"
                )
            ),
            React.createElement("div", { id: "progress", className: "col-xs-12" }),
            React.createElement(
                "div",
                { id: "downloadlinks", className: "col-xs-12" },
                React.createElement("ul", { id: "downloadlinksUL" })
            )
        );
        var criteria = [];
        for (var el in this.props.Criteria) {
            if (!this.props.Criteria.hasOwnProperty(el)) {
                continue;
            }
            var item = this.props.Criteria[el];
            if (item === undefined) {
                criteria.push(React.createElement(
                    "div",
                    { className: "alert alert-warning", role: "alert" },
                    el,
                    " has been added as a filter but not had criteria defined."
                ));
            } else {
                criteria.push(React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "span",
                        { className: "col-sm-3" },
                        el
                    ),
                    React.createElement(
                        "span",
                        { className: "col-sm-3" },
                        item.operator
                    ),
                    React.createElement(
                        "span",
                        { className: "col-sm-3" },
                        item.value
                    )
                ));
            }
        }
        return React.createElement(
            TabPane,
            { TabId: this.props.TabId },
            React.createElement(
                "h2",
                null,
                "Query Criteria"
            ),
            criteria,
            " ",
            buttons,
            React.createElement(
                "div",
                { className: "form-group form-horizontal row" },
                React.createElement(
                    "label",
                    { "for": "selected-input", className: "col-sm-1 control-label" },
                    "Data"
                ),
                React.createElement(
                    "div",
                    { className: "col-sm-4" },
                    React.createElement(
                        "div",
                        { className: "btn-group" },
                        React.createElement(
                            "button",
                            { id: "selected-input", type: "button", className: "btn btn-default dropdown-toggle", "data-toggle": "dropdown" },
                            React.createElement(
                                "span",
                                { id: "search_concept" },
                                this.props.displayType
                            ),
                            React.createElement("span", { className: "caret" })
                        ),
                        React.createElement(
                            "ul",
                            { className: "dropdown-menu", role: "menu" },
                            React.createElement(
                                "li",
                                { onClick: this.changeDataDisplay.bind(this, 0) },
                                React.createElement(
                                    "div",
                                    { className: "col-sm-12" },
                                    React.createElement(
                                        "h5",
                                        { className: "" },
                                        "Cross-sectional"
                                    )
                                )
                            ),
                            React.createElement(
                                "li",
                                { onClick: this.changeDataDisplay.bind(this, 1) },
                                React.createElement(
                                    "div",
                                    { className: "col-sm-12" },
                                    React.createElement(
                                        "h5",
                                        { className: "" },
                                        "Longitudinal"
                                    )
                                )
                            )
                        )
                    )
                )
            ),
            React.createElement(StaticDataTable, {
                Headers: this.props.RowHeaders,
                RowNumLabel: "Identifiers",
                Data: this.props.Data,
                RowNameMap: this.props.RowInfo
            })
        );
    }
});

/*
 *  The following component is used for displaying the scatterplot graph
 *  in the stats tab using flot. The following code is a modification of
 *  code used in the couchApp implementation of the DQT
 */
ScatterplotGraph = React.createClass({
    displayName: "ScatterplotGraph",

    lsFit: function (data) {
        var i = 0,
            means = jStat(data).mean(),
            xmean = means[0],
            ymean = means[1],
            interim = 0,
            numerator = 0,
            denominator = 0,
            slope,
            xi,
            yi;

        for (i = 0; i < data.length; i += 1) {
            xi = data[i][0];
            yi = data[i][1];
            numerator += (xi - xmean) * (yi - ymean);
            denominator += (xi - xmean) * (xi - xmean);
        }

        slope = numerator / denominator;

        return [ymean - slope * xmean, slope];
    },
    minmaxx: function (arr) {
        var i, min, max;

        for (i = 0; i < arr.length; i += 1) {
            if (arr[i][0] < min || min === undefined) {
                if (arr[i][0] !== undefined && arr[i][0] !== null) {
                    min = arr[i][0];
                }
            }
            if (arr[i][0] > max || max === undefined) {
                if (arr[i][0] !== undefined && arr[i][0] !== null) {
                    max = arr[i][0];
                }
            }
        }
        return [min, max];
    },
    updateScatterplot: function () {
        var xaxis = document.getElementById("scatter-xaxis").value,
            yaxis = document.getElementById("scatter-yaxis").value,
            grouping = document.getElementById("scatter-group").value,
            data = this.props.Data,
            points = [],
            min,
            max,
            field1 = [],
            field2 = [],
            grouped_points = {},
            i = 0,
            group_label,
            minmax,
            LS,
            slope,
            start,
            plots = [],
            label,
            plotY = function (x) {
            return [x, start + slope * x];
        },
            dataset;

        for (i = 0; i < data.length; i += 1) {
            points.push([data[i][xaxis], data[i][yaxis]]);
            field1.push(data[i][xaxis]);
            field2.push(data[i][yaxis]);
            if (grouping) {
                group_label = data[i][grouping];
                if (!(grouped_points[group_label] instanceof Array)) {
                    grouped_points[group_label] = [];
                }
                grouped_points[group_label].push([data[i][xaxis], data[i][yaxis]]);
            }
        }

        if (grouping === 'ungrouped') {
            minmax = this.minmaxx(points);
            min = minmax[0];
            max = minmax[1];
            LS = this.lsFit(points);
            slope = LS[1];
            start = LS[0];

            $.plot("#scatterplotdiv", [{

                label: 'Data Points',
                data: points,
                points: { show: true }
            }, // Least Squares Fit
            {
                label: 'Least Squares Fit',
                data: jStat.seq(min, max, 3, plotY),
                lines: { show: true }
            }], {});
        } else {
            minmax = this.minmaxx(points);
            min = minmax[0];
            max = minmax[1];
            i = 0;

            for (dataset in grouped_points) {
                if (grouped_points.hasOwnProperty(dataset)) {
                    label = document.getElementById("scatter-group").selectedOptions.item(0).textContent + " = " + dataset;
                    plots.push({
                        color: i,
                        label: dataset,
                        data: grouped_points[dataset],
                        points: { show: true }
                    });
                    LS = this.lsFit(grouped_points[dataset]);
                    //LS = lsFit(grouped_points[dataset].convertNumbers());
                    slope = LS[1];
                    start = LS[0];
                    plots.push({
                        color: i,
                        // label: "LS Fit for " + dataset,
                        data: jStat.seq(min, max, 3, plotY),
                        lines: { show: true }
                    });
                    i += 1;
                }
            }
            $.plot("#scatterplotdiv", plots, {});
        }

        $("#correlationtbl tbody").children().remove();
        $("#correlationtbl tbody").append("<tr><td>" + jStat.covariance(field1, field2) + "</td><td>" + jStat.corrcoeff(field1, field2) + "</td></tr>");
    },
    render: function () {
        var options = this.props.Fields.map(function (element, key) {
            console.log(element);
            return React.createElement(
                "option",
                { value: key },
                element
            );
        });
        scatterStyle = {
            width: "500px",
            height: "500px"
        };
        return React.createElement(
            "div",
            null,
            React.createElement(
                "h2",
                null,
                "Scatterplot"
            ),
            React.createElement(
                "div",
                { className: "col-xs-4 col-md-3" },
                "Column for X Axis"
            ),
            React.createElement(
                "div",
                { className: "col-xs-8 col-md-3" },
                React.createElement(
                    "select",
                    { id: "scatter-xaxis", onChange: this.updateScatterplot },
                    React.createElement(
                        "option",
                        null,
                        "None"
                    ),
                    options
                )
            ),
            React.createElement(
                "div",
                { className: "col-xs-4 col-md-3" },
                "Column for Y Axis"
            ),
            React.createElement(
                "div",
                { className: "col-xs-8 col-md-3" },
                React.createElement(
                    "select",
                    { id: "scatter-yaxis", onChange: this.updateScatterplot },
                    React.createElement(
                        "option",
                        null,
                        "None"
                    ),
                    options
                )
            ),
            React.createElement(
                "div",
                { className: "col-xs-4 col-md-3" },
                "Group by column"
            ),
            React.createElement(
                "div",
                { className: "col-xs-8 col-md-3" },
                React.createElement(
                    "select",
                    { id: "scatter-group", onChange: this.updateScatterplot },
                    React.createElement(
                        "option",
                        null,
                        "None"
                    ),
                    options
                )
            ),
            React.createElement(
                "h3",
                null,
                "Scatterplot"
            ),
            React.createElement("div", { id: "scatterplotdiv", style: scatterStyle }),
            React.createElement(
                "h3",
                null,
                "Statistics"
            ),
            React.createElement(
                "table",
                { id: "correlationtbl" },
                React.createElement(
                    "thead",
                    null,
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "th",
                            null,
                            "Covariance"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Correlation Coefficient"
                        )
                    )
                ),
                React.createElement("tbody", null)
            )
        );
    }
});

/*
 *  The following component is used for displaying the stats tab content
 */
StatsVisualizationTabPane = React.createClass({
    displayName: "StatsVisualizationTabPane",

    getDefaultProps: function () {
        return {
            'Data': []
        };
    },
    getInitialState: function () {
        return {
            'displayed': false
        };
    },
    render: function () {
        // if(this.state.displayed === false) {
        //     var content = <div>Statistics not yet calculated.</div>;
        //     // return <TabPane content={content} TabId={this.props.TabId} />;
        // } else
        if (this.props.Data.length === 0) {
            var content = React.createElement(
                "div",
                null,
                "Could not calculate stats, query not run"
            );
            // return <TabPane content={content} TabId={this.props.TabId} />;
        } else {
                var stats = jStat(this.props.Data),
                    min = stats.min(),
                    max = stats.max(),
                    stddev = stats.stdev(),
                    mean = stats.mean(),
                    meandev = stats.meandev(),
                    meansqerr = stats.meansqerr(),
                    quartiles = stats.quartiles(),
                    rows = [];

                for (var i = 0; i < this.props.Fields.length; i += 1) {
                    rows.push(React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            null,
                            this.props.Fields[i]
                        ),
                        React.createElement(
                            "td",
                            null,
                            min[i]
                        ),
                        React.createElement(
                            "td",
                            null,
                            max[i]
                        ),
                        React.createElement(
                            "td",
                            null,
                            stddev[i]
                        ),
                        React.createElement(
                            "td",
                            null,
                            mean[i]
                        ),
                        React.createElement(
                            "td",
                            null,
                            meandev[i]
                        ),
                        React.createElement(
                            "td",
                            null,
                            meansqerr[i]
                        ),
                        React.createElement(
                            "td",
                            null,
                            quartiles[i][0]
                        ),
                        React.createElement(
                            "td",
                            null,
                            quartiles[i][1]
                        ),
                        React.createElement(
                            "td",
                            null,
                            quartiles[i][2]
                        )
                    ));
                }

                var statsTable = React.createElement(
                    "table",
                    { className: "table table-hover table-primary table-bordered colm-freeze" },
                    React.createElement(
                        "thead",
                        null,
                        React.createElement(
                            "tr",
                            { className: "info" },
                            React.createElement(
                                "th",
                                null,
                                "Measure"
                            ),
                            React.createElement(
                                "th",
                                null,
                                "Min"
                            ),
                            React.createElement(
                                "th",
                                null,
                                "Max"
                            ),
                            React.createElement(
                                "th",
                                null,
                                "Standard Deviation"
                            ),
                            React.createElement(
                                "th",
                                null,
                                "Mean"
                            ),
                            React.createElement(
                                "th",
                                null,
                                "Mean Deviation"
                            ),
                            React.createElement(
                                "th",
                                null,
                                "Mean Squared Error"
                            ),
                            React.createElement(
                                "th",
                                null,
                                "First Quartile"
                            ),
                            React.createElement(
                                "th",
                                null,
                                "Second Quartile"
                            ),
                            React.createElement(
                                "th",
                                null,
                                "Third Quartile"
                            )
                        )
                    ),
                    React.createElement(
                        "tbody",
                        null,
                        rows
                    )
                );

                var content = React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "h2",
                        null,
                        "Basic Statistics"
                    ),
                    statsTable,
                    React.createElement(ScatterplotGraph, {
                        Fields: this.props.Fields,
                        Data: this.props.Data
                    })
                );
            }
        return React.createElement(
            TabPane,
            { TabId: this.props.TabId },
            content
        );
    }
});

/*
 *  The following component is used for displaying a popout dialog for saving the current
 *  query
 */
SaveQueryDialog = React.createClass({
    displayName: "SaveQueryDialog",

    getInitialState: function () {
        return {
            'queryName': '',
            'shared': false
        };
    },
    editName: function (e) {
        this.setState({ queryName: e.target.value });
    },
    editPublic: function (e) {
        this.setState({ shared: e.target.checked });
    },
    onSaveClicked: function () {
        // Should do validation before doing anything here.. ie query name is entered, doesn't already
        // exist, there are fields selected..
        if (this.props.onSaveClicked) {
            this.props.onSaveClicked(this.state.queryName, this.state.shared);
        }
    },
    onDismissClicked: function () {
        if (this.props.onDismissClicked) {
            this.props.onDismissClicked();
        }
    },
    render: function () {
        return React.createElement(
            "div",
            { className: "modal show" },
            React.createElement(
                "div",
                { className: "modal-dialog" },
                React.createElement(
                    "div",
                    { className: "modal-content" },
                    React.createElement(
                        "div",
                        { className: "modal-header" },
                        React.createElement(
                            "button",
                            { type: "button", className: "close", "aria-label": "Close", onClick: this.onDismissClicked },
                            React.createElement(
                                "span",
                                { "aria-hidden": "true" },
                                "×"
                            )
                        ),
                        React.createElement(
                            "h4",
                            { className: "modal-title", id: "myModalLabel" },
                            "Save Current Query"
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "modal-body" },
                        React.createElement(
                            "p",
                            null,
                            "Enter the name you would like to save your query under here:"
                        ),
                        React.createElement(
                            "div",
                            { className: "input-group" },
                            "Query Name: ",
                            React.createElement("input", { type: "text", className: "form-control", placeholder: "My Query", value: this.state.queryName, onChange: this.editName })
                        ),
                        React.createElement(
                            "p",
                            null,
                            "Make query a publicly shared query? ",
                            React.createElement("input", { type: "checkbox", checked: this.state.shared ? 'checked' : '', onChange: this.editPublic, "aria-label": "Shared Query" })
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "modal-footer" },
                        React.createElement(
                            "button",
                            { type: "button", className: "btn btn-default", onClick: this.onDismissClicked },
                            "Close"
                        ),
                        React.createElement(
                            "button",
                            { type: "button", className: "btn btn-primary", onClick: this.onSaveClicked },
                            "Save changes"
                        )
                    )
                )
            )
        );
    }
});

/*
 *  The following component is used for displaying the filter of a individual query in a tree
 *  like structure
 */
ManageSavedQueryFilter = React.createClass({
    displayName: "ManageSavedQueryFilter",

    render: function () {
        var filterItem,
            filter = this.props.filterItem;
        if (filter.activeOperator) {
            var logicOp = "AND",
                children = filter.children.map(function (element, key) {
                return React.createElement(ManageSavedQueryFilter, {
                    filterItem: element
                });
            });
            if (filter.activeOperator === 1) {
                logicOp = "OR";
            }
            return React.createElement(
                "li",
                null,
                React.createElement(
                    "span",
                    null,
                    logicOp
                ),
                React.createElement(
                    "ul",
                    { className: "savedQueryTree" },
                    children
                )
            );
        } else {
            filter = this.props.filterItem;
            if (filter.instrument) {
                var operator;
                switch (filter.operator) {
                    case "equal":
                        operator = "=";
                        break;
                    case "notEqual":
                        operator = "!=";
                        break;
                    case "lessThanEqual":
                        operator = "<=";
                        break;
                    case "greaterThanEqual":
                        operator = ">=";
                        break;
                    default:
                        operator = filter.operator;
                        break;
                }
                filterItem = React.createElement(
                    "span",
                    null,
                    filter.instrument,
                    ",",
                    filter.field,
                    " ",
                    operator,
                    " ",
                    filter.value
                );
            } else {
                filterItem = React.createElement(
                    "span",
                    null,
                    filter.Field,
                    " ",
                    filter.Operator,
                    " ",
                    filter.Value
                );
            }
        }
        return React.createElement(
            "li",
            null,
            filterItem
        );
    }
});

/*
 *  The following component is used for displaying the individual saved queries in the
 *  manage saved queries tab
 */
ManageSavedQueryRow = React.createClass({
    displayName: "ManageSavedQueryRow",

    getDefaultProps: function () {
        return {
            'Name': 'Unknown',
            'Query': {
                'Fields': []
            }
        };
    },
    render: function () {
        var fields = [];
        var filters;
        if (this.props.Query.Fields && Array.isArray(this.props.Query.Fields)) {
            for (var i = 0; i < this.props.Query.Fields.length; i += 1) {
                fields.push(React.createElement(
                    "li",
                    null,
                    this.props.Query.Fields[i]
                ));
            }
        } else if (this.props.Query.Fields) {
            for (var instrument in this.props.Query.Fields) {
                for (var field in this.props.Query.Fields[instrument]) {
                    if (field === "allVisits") {
                        continue;
                    } else {
                        fields.push(React.createElement(
                            "li",
                            null,
                            instrument,
                            ",",
                            field
                        ));
                    }
                }
            }
        }

        if (fields.length === 0) {
            fields.push(React.createElement(
                "li",
                null,
                "No fields defined"
            ));
        }

        if (this.props.Query.Conditions) {
            var operator, filter;
            if (this.props.Query.Conditions.activeOperator) {
                if (this.props.Query.Conditions.children) {
                    if (this.props.Query.Conditions.activeOperator === 0) {
                        operator = React.createElement(
                            "span",
                            null,
                            "AND"
                        );
                    } else {
                        operator = React.createElement(
                            "span",
                            null,
                            "OR"
                        );
                    }
                    filter = this.props.Query.Conditions.children.map(function (element, key) {
                        return React.createElement(ManageSavedQueryFilter, {
                            filterItem: element
                        });
                    });
                } else {
                    operator = React.createElement(
                        "span",
                        null,
                        "No filters defined"
                    );
                }
            } else {
                if (this.props.Query.Conditions.length === 0) {
                    operator = React.createElement(
                        "span",
                        null,
                        "No filters defined"
                    );
                } else {
                    operator = React.createElement(
                        "span",
                        null,
                        "AND"
                    );
                    filter = this.props.Query.Conditions.map(function (element, key) {
                        return React.createElement(ManageSavedQueryFilter, {
                            filterItem: element
                        });
                    });
                }
            }
            filters = React.createElement(
                "div",
                { className: "tree" },
                React.createElement(
                    "ul",
                    { className: "firstUL savedQueryTree" },
                    React.createElement(
                        "li",
                        null,
                        operator,
                        React.createElement(
                            "ul",
                            { className: "savedQueryTree" },
                            filter
                        )
                    )
                )
            );
        }
        if (!filters) {
            filters = React.createElement(
                "strong",
                null,
                "No filters defined"
            );
        }
        return React.createElement(
            "tr",
            null,
            React.createElement(
                "td",
                null,
                this.props.Name
            ),
            React.createElement(
                "td",
                null,
                React.createElement(
                    "ul",
                    null,
                    fields
                )
            ),
            React.createElement(
                "td",
                null,
                filters
            )
        );
    }
});

/*
 *  The following component is used for displaying the manage saved queries tab content
 */
ManageSavedQueriesTabPane = React.createClass({
    displayName: "ManageSavedQueriesTabPane",

    dismissDialog: function () {
        this.setState({ 'savePrompt': false });
    },
    getInitialState: function () {
        return {
            'savePrompt': false,
            'queriesLoaded': false,
            'queries': {}
        };
    },
    saveQuery: function () {
        this.setState({ 'savePrompt': true });
    },
    savedQuery: function (name, shared) {
        if (this.props.onSaveQuery) {
            this.props.onSaveQuery(name, shared);
        }
        this.setState({ 'savePrompt': false });
    },
    getDefaultProps: function () {
        return {
            userQueries: [],
            globalQueries: [],
            queriesLoaded: false,
            queryDetails: {}
        };
    },
    render: function () {
        var queryRows = [];
        if (this.props.queriesLoaded) {
            for (var i = 0; i < this.props.userQueries.length; i += 1) {
                var query = this.props.queryDetails[this.props.userQueries[i]];
                var name = "Unnamed Query: " + this.props.userQueries[i];
                if (query.Meta.name) {
                    name = query.Meta.name;
                }

                queryRows.push(React.createElement(ManageSavedQueryRow, { Name: name, Query: query }));
            }
        } else {
            queryRows.push(React.createElement(
                "tr",
                null,
                React.createElement(
                    "td",
                    { colSpan: "3" },
                    "Loading saved query details"
                )
            ));
        }

        var savePrompt = '';
        if (this.state.savePrompt) {
            savePrompt = React.createElement(SaveQueryDialog, { onDismissClicked: this.dismissDialog, onSaveClicked: this.savedQuery });
        }
        var content = React.createElement(
            "div",
            null,
            React.createElement(
                "h2",
                null,
                "Your currently saved queries"
            ),
            React.createElement(
                "button",
                { onClick: this.saveQuery },
                "Save Current Query"
            ),
            React.createElement(
                "table",
                { className: "table table-hover table-primary table-bordered colm-freeze" },
                React.createElement(
                    "thead",
                    null,
                    React.createElement(
                        "tr",
                        { className: "info" },
                        React.createElement(
                            "th",
                            null,
                            "Query Name"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Fields"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Filters"
                        )
                    )
                ),
                React.createElement(
                    "tbody",
                    null,
                    queryRows
                )
            ),
            savePrompt
        );
        return React.createElement(
            TabPane,
            { TabId: this.props.TabId },
            content
        );
    }
});
