/*global document: false, $: false, window: false, Worker: false, defineManager: false, QueryManager: false, popManager: false, jStat: false, FileReader: false, jQuery: false, User: false, JSZip: false, Categories: false*/
"use strict";
var qmanager;
var QueryRun = false;
var worker;
var dataTable;
var resizeAll = function () {
    var header = $(".ui-tabs-nav"),
        tabs = $("#tabs"),
        windowSize = window.innerHeight,
        workspace_height,
        halfsizes;
    tabs.css("height", windowSize - 25);
    workspace_height = tabs.outerHeight() - header.outerHeight();
    workspace_height -= 15;
    $(".ui-tabs-panel").css("height", workspace_height);
    halfsizes = $(".half");
    $(".half").css("height", (workspace_height / 2) - 5);
};
var FileList = [];
function getOrCreateDownloadLink(fileName, type) {
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
}

function getOrCreateProgressElement(id) {
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
}

function PopulateDataTable() {
}

function convertObjectToTable(object) {
    if (worker) {
        worker.terminate();
    }
    worker = new Worker('GetJS.php?Module=dataquery&file=ui.tablerender.js');
    worker.postMessage({
        cmd: 'ConvertObject',
        obj: object,
        group_level: document.getElementById("group_level").value,
        SelectedElements: defineManager.getSelectedNames()
    });
    var progress = getOrCreateProgressElement("progress_conversion"),
        cols = 0,
        headers;

    FileList = [];

    worker.addEventListener('message', function (e) {
        var i, tbl, thead, trow, headers, headersEl, csvworker;
        if (e.data.cmd === 'Status') {
            progress.innerHTML = "Combining instrument data: <progress value=\"" + e.data.RowNum + "\" max=\"" + e.data.Total + "\">" + e.data.RowNum + " / " + e.data.Total + "</progress>";
        } else if (e.data.cmd === "PopulateHeaders") {
            if (dataTable && dataTable.fnClearTable) {
                dataTable.fnClearTable();
                dataTable.fnDestroy();
            }
            tbl = $("#data");
            thead = $("#data thead");
            thead.children().remove();
            thead.append('<tr>');
            trow = $("#data thead tr");
            cols = e.data.Headers.length;
            for (i = 0; i < cols; i += 1) {
                trow.append("<th>" + e.data.Headers[i] + "</th>");
            }
            dataTable = $("#data").dataTable({
                bJQueryUI: true,
                sPaginationType: "full_numbers",
                bDestroy: true,
                "bAutoWidth" : false,
                "sScrollX": "100%",
                /*"sScrollXInner" : "110%", */
                bScrollCollapse: true
            });
            $("#data").css('width', 'auto');
            dataTable.fnAdjustColumnSizing();
            headers = e.data.Headers;

        } else if (e.data.cmd === 'AddRow') {
            progress.innerHTML = "Loading into data table: <progress value=\"" + e.data.RowNum + "\" max=\"" + e.data.TotalRows + "\">" + e.data.RowNum + " / " + e.data.TotalRows + "</progress>";
            if (dataTable.fnAddData) {
                dataTable.fnAddData(e.data.Row, false);
            }
            if (e.data.RowNum === e.data.TotalRows) {
                progress.textContent = '';
                dataTable.fnDraw();
                worker.terminate();
            }
        } else if (e.data.cmd === 'AddFile') {
            FileList.push(e.data.Filename);
        }
    }, true);
    worker.postMessage({
        cmd: 'ConvertObject',
        obj: object,
        group_level: document.getElementById("group_level").value,
        SelectedElements: defineManager.getSelectedNames()
    });
}



$(document).ready(function () {
    var lsFit = function (data) {
        var i = 0,
            means = jStat(data).mean(),
            xmean = means[0],
            ymean = means[1],
            interim = 0,
            numerator  = 0,
            denominator = 0,
            slope,
            xi,
            yi;

            for (i = 0; i < data.length; i += 1) {
                xi = data[i][0];
                yi = data[i][1];
                numerator += (xi - xmean) * (yi - ymean);
                denominator += ((xi - xmean) * (xi - xmean));
            }

            slope = numerator / denominator;

            return [(ymean - slope * xmean), slope];
    },
    minmaxx = function (arr) {
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
    }, updateScatterplot = function () {
            var xaxis = document.getElementById("scatter-xaxis").value,
                yaxis = document.getElementById("scatter-yaxis").value,
                grouping = document.getElementById("scatter-group").value,
                data = dataTable.fnGetData(),
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
                plotY = function (x) { return [x, start + (slope * x)]; },
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
                minmax = minmaxx(points);
                min = minmax[0];
                max = minmax[1];
                LS = lsFit(points);
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
                minmax = minmaxx(points);
                min = minmax[0];
                max = minmax[1];
                i = 0;

                for (dataset in grouped_points) {
                    if (grouped_points.hasOwnProperty(dataset)) {
                        label = document.getElementById("scatter-group").selectedOptions.item().textContent + " = " + dataset;
                        plots.push({
                            color: i,
                            label: dataset,
                            data: grouped_points[dataset],
                            points: { show: true }
                        });
                        LS = lsFit(grouped_points[dataset]);
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
    };
    qmanager = new QueryManager("current_filter");
    $("#tabs").tabs();
    // Enable the logout button so that it's not greyed out.
    $("#tabs").tabs("enable", 5);
    resizeAll();
    $(window).resize(resizeAll);
    $("#shownormals").click(function () {
        // All the data is already cached, so just rerun it to
        // update the graph
        //$("#runquery").click();
    });
    $("#runquery").click(function () {
        var that = qmanager;
        QueryRun = true;
        $("#ViewData").css("cursor", "progress");
        qmanager.run(function () {
            var fields = defineManager.getSelected(),
                sessions = that.getSessions(),
                field_split,
                DocTypes = [],
                i = 0,
                Fields = {},
                DataObject = {},
                CompleteBitmask = [],
                WaitForCallback = !(that.populationExplicit()),
                keys,
                sessionsIdx,
                merged,
                create_callback = function (DocType, docidx, maxdocidx, callback) {
                    return function (data, textStatus) {
                        var Completed,
                            jsonworker = new Worker('GetJS.php?Module=dataquery&file=ui.tablerender.js');

                        jsonworker.addEventListener('message', function (e) {
                            var i,
                                msg = e.data,
                                progressElement,
                                progressDiv;
                            if (msg.cmd === 'AddRow') {
                                if (!DataObject[msg.RowID]) {
                                    DataObject[msg.RowID] = [];
                                }
                                progressElement = getOrCreateProgressElement(DocType + "_progress");

                                progressElement.innerHTML = DocType + " processing: <progress value=\"" + msg.Idx + "\" max=\"" + msg.TotalRows + "\">" + msg.Idx + " out of " + msg.TotalRows + "</progress>";
                            } else if (msg.cmd === 'AddValueToRow') {
                                DataObject[msg.RowID][msg.Field] = {
                                    TextValue: msg.Value,
                                    IsFile: false,
                                    DocID: msg.DocID
                                };
                                if (defineManager.isFileField([DocType, msg.Column])) {
                                    DataObject[msg.RowID][msg.Field].IsFile = true;
                                }
                            } else if (msg.cmd === 'FinishedConvertJSON') {
                                this.terminate();
                                progressElement = getOrCreateProgressElement(DocType + "_progress");
                                progressElement.textContent = DocType + ": Finished processing";
                                CompleteBitmask[docidx] = true;
                                Completed = true;
                                for (i = 0; i < maxdocidx; i += 1) {
                                    if (CompleteBitmask[i] !== true) {
                                        Completed = false;
                                        break;
                                    }
                                }

                                if (callback && Completed) {
                                    progressElement = document.getElementById("progress");
                                    progressElement.textContent = '';
                                    callback(convertObjectToTable(DataObject));
                                    $("#ViewData").css("cursor", "auto");
                                }
                            }
                        });
                        jsonworker.postMessage({
                            cmd: 'ConvertJSON',
                            data: data,
                            GroupLevel: document.getElementById("group_level").value,
                            Sessions: sessions,
                            Elements: Fields[DocType]
                        });

                    };
                },
                downloadProgressHandler = function (DocType) {
                    return function (jqXHR, settings) {
                        var xhr = this.xhr();
                        xhr.addEventListener("progress", function (e) {
                            var progressElement = getOrCreateProgressElement(DocType + "_progress"),
                                msg = DocType + ": Downloaded " + Math.round(e.loaded / 1024) + " kilobytes";
                            progressElement.textContent = msg;
                        });
                        xhr.addEventListener("load", function (e) {
                            var progressElement = getOrCreateProgressElement(DocType + "_progress");
                            progressElement.textContent = "Downloaded data for " + DocType;
                        });
                        this.OverloadedXHR = xhr;
                        this.xhr = function () { return this.OverloadedXHR; };
                    };
                };
            for (i = 0; i < fields.length; i += 1) {
                field_split = $(fields[i]).children(".queryField")[0].textContent.split(",");
                DocTypes.push(field_split[0]);
                if (Fields[field_split[0]] === undefined) {
                    Fields[field_split[0]] = [];
                }
                Fields[field_split[0]].push(field_split[1]);
            }

            DocTypes = DocTypes.unique();

            for (i = 0; i < DocTypes.length; i += 1) {
                keys = [];
                for (sessionsIdx = 0; sessionsIdx < sessions.length; sessionsIdx += 1) {
                    merged = [];
                    merged.push(DocTypes[i]);
                    merged = merged.concat(sessions[sessionsIdx]);

                    keys.push(merged);
                }

                $.ajax({
                    type: "POST",
                    url: "_view/instruments?include_docs=true&reduce=false",
                    beforeSend: downloadProgressHandler(DocTypes[i]),
                    data: JSON.stringify({ 'keys' : keys }),
                    success: create_callback(DocTypes[i], i, DocTypes.length, PopulateDataTable),
                    contentType: 'application/json',
                    /* Even though the data is JSON, return it as text because
                     * we want to parse it in a webworker, not the UI thread */
                    dataType: 'text'
                });
            }
            document.getElementById("current_sessions").textContent = "[" + sessions.join("], [") + "]";
            $("a[href='#ViewData']").fadeTo('fast', 0.25);
            $("a[href='#ViewData']").fadeTo('slow', 1);
        });
    });


    $("#CalculateStats").click(function (e) {
        var headers = dataTable.fnSettings().aoColumns.map(function (row) { return row.sTitle; }),
            worker = new Worker("script/ui.stats.js"),
            tbl = $("#stats tbody"),
            selectedColumns = [],
            xaxis = document.getElementById("scatter-xaxis"),
            yaxis = document.getElementById("scatter-yaxis"),
            groups = document.getElementById("scatter-group");

        tbl.children().remove();
        worker.postMessage({
            cmd: 'PopulateTable',
            Headers: headers,
            Data: dataTable.fnGetData()
        });

        $(xaxis).children().remove();
        $(yaxis).children().remove();
        $(groups).children().remove();

        worker.addEventListener("message", function (e) {
            var tbl, 
                row, 
                cell,
                data = e.data,
                addCell = function(row, data) {
                    var cell = document.createElement("td");
                    cell.textContent = data;
                    row.appendChild(cell);
                    return cell;
                }, scatterdropdown;

            if(data.Cmd === 'TableAddRow') {
                tbl = $("#stats tbody");
                row = document.createElement("tr");

                addCell(row, data.Header);
                addCell(row, data.RowData.Minimum);
                addCell(row, data.RowData.Maximum);
                addCell(row, data.RowData['Standard Deviation']);
                addCell(row, data.RowData.Mean);
                addCell(row, data.RowData['Mean Squared Error']);
                addCell(row, data.RowData['First Quartile']);
                addCell(row, data.RowData['Second Quartile']);
                addCell(row, data.RowData['Third Quartile']);

                if(!isNaN(data.RowData.Mean)) {
                    // It's a numeric column, so add it to the x/y axis options
                    // for the scatterplot dropdown.
                    scatterdropdown = document.createElement("option");
                    scatterdropdown.textContent = data.Header;
                    scatterdropdown.value = e.data.Index;

                    xaxis.appendChild(scatterdropdown);
                    yaxis.appendChild(scatterdropdown.cloneNode(true));
                } else {
                    // It's not a numeric column, so add it to the Groups options for the
                    // dropdown.
                    scatterdropdown = document.createElement("option");
                    scatterdropdown.textContent = data.Header;
                    scatterdropdown.value = e.data.Index;
                    groups.appendChild(scatterdropdown);
                };
                row.addEventListener("click", function (mousee) {
                    $(this).toggleClass("selected");
                    $(this).toggleClass("ui-state-highlight");
                    if ($(this).hasClass("selected")) {
                        selectedColumns.push(e.data.Index);
                    } else {
                        // Remove from selected columns
                        if(selectedColumns.indexOf(e.data.Index) > -1) {
                            selectedColumns.splice(selectedColumns.indexOf(e.data.Index), 1);
                        }
                    }

                    worker.postMessage({
                        cmd : "PopulateHistogram",
                        Columns: selectedColumns
                    });
                });


                tbl.append(row);

            } else if (data.Cmd === 'FinishedTable') {
                $("#stats").dataTable();
                //worker.terminate();
            } else if (data.Cmd === 'CreateHistogram') {
                $.plot("#plotdiv", data.Plots,
                        {
                            yaxes: [{}, { position: "right" }]
                        }
                      );
            };

        });
    });

    $("#scatter-xaxis").change(updateScatterplot);
    $("#scatter-yaxis").change(updateScatterplot);
    $("#scatter-group").change(updateScatterplot);

    $("#UploadPopulation").change(function (e) {
        var file = e.target.files[0],
            reader = new FileReader();
        reader.onload = function (data) {
            var lines = data.target.result.replace(/\r\n/g, '\n').replace(/\n\r/g, '\n').replace(/\r/g, '\n').split("\n"),
                tabDelimited = lines[0].split("\t"),
                commaDelimited = lines[0].split(","),
                delimiter = '\t',
                population = [],
                i = 0;

            if (commaDelimited.length >= tabDelimited.length) {
                delimiter = ',';
            }
            for (i = 0; i < lines.length; i += 1) {
                if (lines[i] !== '') {
                    population.push(lines[i].split(delimiter));
                }

            }

            qmanager.setPopulation(population);
        };
        reader.readAsText(file);
    });
    $("#addAll").click(function () {
        var table = $("#fields").dataTable(),
            data = table.fnGetData(),
            i,
            curEl;

        for (i = 0; i < data.length; i += 1) {
            // 0 is the field name, 1 is the description, 2 is "Downloadable"
            // in the data table. So add 0
            curEl = data[i][0];
            defineManager.add(curEl);
        }
        table.$("tr").addClass("selected");
        table.$("tr").addClass("ui-state-highlight");
        //popManager.toggle(document.getElementById(selected[i]));
    });
    $("#removeAll").click(function () {
        var table = $("#fields").dataTable(),
            data = $("#fields").dataTable().fnGetData(),
            i,
            curEl;

        for (i = 0; i < data.length; i += 1) {
            curEl = data[i][0];
            defineManager.remove(curEl);
        }
        table.$("tr").removeClass("selected");
        table.$("tr").removeClass("ui-state-highlight");
    });

    // HTML tooltips courtesy of Tarek
    $(".html_tool_tip_trigger").on("mouseenter", function (event) {
        var trigger = jQuery(this),
            tool_tip_id = trigger.attr("data-tool-tip-id"),
            tool_tip = jQuery("#" + tool_tip_id),
            offset_x = trigger.attr("data-offset-x") || '30',
            offset_y = trigger.attr("data-offset-y") || '0',
            x,
            y;

        if ((tool_tip.css('top') === '' || tool_tip.css('top') === '0px')
                && (tool_tip.css('left') === '' || tool_tip.css('left') === '0px')) {
            x = trigger.position().left + parseInt(offset_x, 10);
            y = trigger.position().top  + parseInt(offset_y, 10);

            tool_tip.css('top',  y + 'px');
            tool_tip.css('left', x + 'px');
        }

        tool_tip.show();
    }).on("mouseleave", function (event) {
        var trigger = jQuery(this),
            tool_tip_id = trigger.attr("data-tool-tip-id"),
            tool_tip = jQuery("#" + tool_tip_id);

        tool_tip.hide();
    });

    // User login/logout
    window.user = new User();

    $("#loginbutton").click(function () {
        window.user.login(
            document.getElementById("username_form").value,
            document.getElementById("password_form").value
        );
        return false;

    });
    $("#SaveQuery").click(function () {
        $("#SaveDialog").dialog("open");
    });

    Categories.list("categories");
    Categories.list("categories_pop");

    window.user._loadSavedQueries = function (data) {
        var saved = document.getElementById("savedqueries"),
            tblEl,
            tblRow,
            btn,
            i,
            row,
            j,
            label,
            body = saved.querySelector("tbody"),
            loadClickHandler = function (row, tblRow) {
                return function () {
                    var i = 0, el, cell, addedEl;
                    /* Load fields */
                    defineManager.clear();
                    for (i = 0; i < row.Fields.length; i += 1) {
                        //console.log(row.Fields[i]);
                        defineManager.add(row.Fields[i]);
                    }
                    $("a[href='#DefineFields']").fadeTo('fast', 0.25);
                    $("a[href='#DefineFields']").fadeTo('slow', 1);


                    /* Load conditions */
                    popManager.clear();
                    for (i = 0; i < row.Conditions.length; i += 1) {
                        el = document.createElement("tr");
                        el.classList.add("selectable");
                        cell = document.createElement("td");
                        cell.textContent = row.Conditions[i].Field;
                        el.appendChild(cell);

                        cell = document.createElement("td");
                        cell.textContent = "";
                        el.appendChild(cell);

                        cell = document.createElement("td");
                        cell.textContent = "";
                        el.appendChild(cell);

                        addedEl = popManager.add(el, row.Conditions[i].Value);
                        $(addedEl).children(".queryOp").val(row.Conditions[i].Operator);
                    }
                    $("a[href='#DefinePopulation']").fadeTo('fast', 0.25);
                    $("a[href='#DefinePopulation']").fadeTo('slow', 1);
                    Categories.list("categories");
                    Categories.list("categories_pop");
                };
            },
            deleteClickHandler = function (row, tblRow) {
                return function () {
                    var del = document.getElementById("deletequery");

                    del.textContent = row._id;
                    del.setAttribute("data-rev", row._rev);
                    $("#DeleteDialog").dialog("option", "Row", tblRow);

                    $("#DeleteDialog").dialog("open");
                };
            };
        $("#savedqueries").dataTable().fnDestroy();
        body.textContent = '';
        for (i = 0; i < data.length; i += 1) {
            row = data[i];
            tblRow = document.createElement("tr");

            // Actions
            tblEl  = document.createElement("td");
            btn = document.createElement("button");
            btn.textContent = "Load";
            $(btn).click(loadClickHandler(row, tblRow));
            tblEl.appendChild(btn);
            btn = document.createElement("button");
            btn.textContent = "Delete";
            $(btn).click(deleteClickHandler(row, tblRow));
            tblEl.appendChild(btn);
            tblRow.appendChild(tblEl);



            // Name
            tblEl = document.createElement("td");
            tblEl.textContent = row._id;
            tblRow.appendChild(tblEl);

            // Fields
            tblEl = document.createElement("td");
            for (j = 0; row.Fields && j < row.Fields.length; j += 1) {
                tblEl.appendChild(document.createTextNode(row.Fields[j]));
                tblEl.appendChild(document.createElement("br"));
            }
            tblRow.appendChild(tblEl);

            // Conditions
            tblEl = document.createElement("td");
            for (j = 0; j < row.Conditions.length; j += 1) {
                label = '';
                label += row.Conditions[j].Field;
                label += row.Conditions[j].Operator;
                label += row.Conditions[j].Value;
                tblEl.appendChild(document.createTextNode(label));
                tblEl.appendChild(document.createElement("br"));
            }
            tblRow.appendChild(tblEl);

            body.appendChild(tblRow);

        }
        $("#savedqueries").dataTable({
            bJQueryUI: true,
            bAutoWidth: false,
            sPaginationType: "full_numbers",
            bDestroy: true,
            "oLanguage" : {
                "sZeroRecords" : "No saved queries found."
            }
        });
    };
    $("#DeleteDialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: [
            {
                text: "Confirm delete",
                click: function () {
                    var ele = document.getElementById("deletequery"),
                        tblRow = $(this).dialog("option", "Row");
                    qmanager.deleteQuery(ele.textContent, ele.getAttribute("data-rev"));

                    $("#savedqueries").dataTable().fnDestroy();
                    $(tblRow).remove();

                    $("#savedqueries").dataTable({
                        "oLanguage": {
                            "sZeroRecords" : "No saved queries found."
                        },
                        bJQueryUI: true,
                        sPaginationType: "full_numbers",
                        bDestroy: true
                    });
                    $(this).dialog("close");
                }
            },
            {
                text: "Cancel",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]

    });
    $("#SaveDialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: [
            {
                text: "Save query",
                click: function () {
                    var el = document.getElementById("SaveDialogName"), error = document.getElementById("SaveDialogError");
                    error.textContent = '';

                    if (el === undefined || el.value === '') {
                        error.textContent = "A name must be provided for the saved query.";
                    } else {
                        qmanager.saveQuery(el.value, window.user.getSavedQueries);
                        $("a[href='#Home']").fadeTo('fast', 0.25);
                        $("a[href='#Home']").fadeTo('slow', 1);
                        // Reload the saved queries, because
                        // it's fast enough and easier than
                        // reparsing everything.
                        //window.user.getSavedQueries();
                        $(this).dialog("close");
                    }
                }
            },
            {
                text: "Cancel",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    });
    $("#SaveCSV").click(function () {
        var headers = dataTable.fnSettings().aoColumns.map(function (row) { return row.sTitle; }),
            csvworker = new Worker('script/ui.savecsv.js');

        /* for (i = 0; i < headersEl.length; i += 1) {
            headers[i] = headersEl[i].textContent;
        } */

        csvworker.addEventListener('message', function (e) {
            var dataURL, dataDate, link;
            if (e.data.cmd === 'SaveCSV') {
                dataDate = new Date().toISOString();
                dataURL = window.URL.createObjectURL(e.data.message);
                link = document.getElementById("DownloadLink");
                link.download = "data-" + dataDate + ".csv";
                link.type = "text/csv";
                link.href = dataURL;
                $(link)[0].click();

            }
        });
        csvworker.postMessage({
            cmd: 'SaveFile',
            data: $("#data").dataTable().fnGetData(),
            headers: headers
        });



    });
    $("#SaveZip").click(function () {
        var zip = new JSZip(),
            i = 0,
            CompleteMask = new Array(FileList.length),
            saveworker,
            dataURLs = [],
            multiLinkHandler = function(buffer) { return function(ce) {
                var downloadLink = document.getElementById("DownloadLink"),
                    dv = new DataView(buffer),
                    blb;

                    ce.preventDefault();
                    blb = new Blob([dv], { type : "application/zip" });

                    downloadLink.href = window.URL.createObjectURL(blb);
                    downloadLink.download = this.download;
                    downloadLink.type = "application/zip";
                    downloadLink.click();

                    window.URL.revokeObjectURL(downloadLink.href);
                }
            };

        // Does this work if we hold a global reference instead of a closure
        // to the object URL?
        window.dataBlobs = [];

        if(FileList.length < 100 || confirm("You are trying to download more than 100 files. This may be slow or crash your web browser.\n\nYou may want to consider splitting your query into more, smaller queries by defining more restrictive filters.\n\nPress OK to continue with attempting to download current files or cancel to abort." )) {
            saveworker = new Worker('script/ui.savezip.js');
            saveworker.addEventListener('message', function (e) {
                var link,
                progress,
                FileName,
                NewFileName,
                downloadLinks,
                i;
            if (e.data.cmd === 'SaveFile') {
                progress = getOrCreateProgressElement("download_progress");
                //progress.textContent = "Downloaded files";
                //hold a reference to the blob so that chrome doesn't release it. This shouldn't
                //be required.
                window.dataBlobs[e.data.FileNo - 1] = new Blob([e.data.buffer], { type : "application/zip" });;
                dataURLs[e.data.FileNo - 1] = window.URL.createObjectURL(window.dataBlobs[e.data.FileNo - 1]);

                link = getOrCreateDownloadLink(e.data.Filename, "application/zip");
                link.href = dataURLs[e.data.FileNo - 1];
                //link.onclick = multiLinkHandler(e.data.buffer);
                //link.href = "#";
                progress = getOrCreateProgressElement("zip_progress");
                progress.textContent = "";

            } else if (e.data.cmd === 'Progress') {
                progress = getOrCreateProgressElement("download_progress");
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
                progress = getOrCreateProgressElement("download_progress");
                progress.textContent = "Finished generating zip files";
                //this.terminate();

            } else if (e.data.cmd === 'CreatingZip') {
                progress = getOrCreateProgressElement("zip_progress");
                progress.textContent = "Creating a zip file with current batch of downloaded files. Process may be slow before proceeding.";
            }

            });

            saveworker.postMessage({ Files: FileList });
        }
    });
    // This didn't work using within-document messaging, so we make a global
    // function to call from loadConfigOptions 
    //window.addEventListener("message", function(m) {
    //    console.log("Received message", m);
    //});
    window.handleConfig = function (Config, Val) {
        "use strict";
        var el, i;
        if(Config === 'GroupString') {
            el = document.getElementById('GroupString');
            el.textContent = Val;
        } else if (Config === 'GroupOptions') {
            el = document.getElementById('group_level');
            $(el).children().remove();
            for (i = 0; i < Val.length; i += 1) {
                $(el).append(new Option(Val[i], i));
            }
        }
    };
});
