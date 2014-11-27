/*global document: false, $: false, QueryRun: false */
"use strict";
var Categories = {};
var defineManager;
var popManager;

var helpers = {};
helpers.addCell = function (row, value, className) {
    var el = document.createElement("td");
    el.textContent = value;
    if (className) {
        el.classList.add(className);
    }
    row.appendChild(el);
    return row;
};

helpers.createInputForType = function (type) {
    var select, options, el, i, option_str;
    if (type.indexOf('enum') === 0) {
        select = document.createElement("select");
        select.setAttribute("class", "queryParam");
        options = type.substring(5, type.length - 1).split(",");
        for (i = 0; i < options.length; i += 1) {
            option_str = $.trim(options[i]);
            el = document.createElement("option");
            el.textContent = option_str.substring(1, option_str.length - 1);
            select.appendChild(el);
        }
        return select;
    }
    /* jslint prefers the falling through to having an else with a return
     * so consider below to be "else" .. */
    el = document.createElement("input");
    el.setAttribute("type", "text");
    el.setAttribute("class", "queryParam");
    return el;
};

helpers.createOperatorElement = function (args) {
    var el, op, i;
    el = document.createElement("select");
    el.setAttribute("class", "queryOp");
    op = document.createElement("option");
    op.textContent = '=';
    el.appendChild(op);
    op = document.createElement("option");
    op.textContent = '!=';
    el.appendChild(op);
    op = document.createElement("option");
    op.textContent = '<=';
    el.appendChild(op);
    op = document.createElement("option");
    op.textContent = '>=';
    el.appendChild(op);
    op = document.createElement("option");
    op.textContent = "startsWith";
    el.appendChild(op);
    op = document.createElement("option");
    op.textContent = 'contains';
    el.appendChild(op);

    return el;
};

helpers.createValueInputForField = function (fieldname, cell, DefaultVal) {
    var i, split_fieldname = fieldname.split(","),
        jKey = '["' + split_fieldname.join('","') + '"]',
        fields;
    fields = $.getJSON("_view/datadictionary", {
        key: jKey,
        reduce: false
    }, function (d) {
        var type, el;
        type = d.rows[0].value.Type;
        el = helpers.createInputForType(type);
        cell.appendChild(el);
        if (DefaultVal) {
            $(cell).children(".queryParam").val(DefaultVal);
        }
    });
};

helpers.createActionsCell = function (fieldname, cell) {
    var el = document.createElement('button');
    el.textContent = "Remove";
    el.classList.add("actionRemove");
    cell.appendChild(el);
    return cell;
};

Categories.list = function (selectBox) {
    var that = this, categories;
    $.ajaxSetup({'beforeSend': function (xhr) {
        if (xhr.overrideMimeType) {
            xhr.overrideMimeType("text/plain");
        }
    }});

    categories = $.ajax({
        url: "_view/categories",
        dataType: 'json',
        data: { reduce: true, group_level: 2 },
        success: function (data) {
            var i,
                el,
                categoriesSelect = document.getElementById(selectBox);
            $(categoriesSelect).children().remove();
            for (i = 0; i < data.rows.length; i += 1) {
                el = document.createElement("option");
                el.textContent = data.rows[i].key;
                if (categoriesSelect) {
                    categoriesSelect.appendChild(el);
                }
            }
            $(categoriesSelect).change();
        },
        error: function (e) {
        }
    });

};

Categories.show = function (category, output_div, options) {
    var createOptionElement = function (args) {
        var el, i, options, option_str;
        if (args === null || args.Type === undefined) {
            el = document.createElement("span");
            el.textContent = "Empty";
        }
        return el;
    };
    $("#tabs").css("cursor", "progress");
    $.get("_view/datadictionary", {
        reduce: false,
        startkey: '["' + category + '"]',
        endkey: '["' + category + '\u9999"]',
    }, function (d) {
        var i,
            data = $.parseJSON(d),
            datarow,
            fieldsSelect = document.getElementById(output_div),
            el,
            checkBox,
            row;
        $(fieldsSelect).parent("table").dataTable().fnDestroy();
        fieldsSelect.textContent = '';

        // Remove the previous category
        if (fieldsSelect.hasChildNodes()) {
            while (fieldsSelect.childNodes.length >= 1) {
                fieldsSelect.removeChild(fieldsSelect.firstChild);
            }
        }

        for (i = 0; i < data.rows.length; i += 1) {
            datarow = data.rows[i];
            if (datarow.value !== null || !options.showOptions) {
                row = document.createElement("tr");

                if (options.selectedManager && options.selectedManager.contains(data.rows[i].key)) {
                    row.setAttribute("class", "selectable selected ui-state-highlight");
                } else {
                    row.setAttribute("class", "selectable");
                }

                row = helpers.addCell(row, datarow.key);
                row = helpers.addCell(row, datarow.value.Description);

                if (datarow.value.IsFile === true) {
                    row = helpers.addCell(row, "Yes");
                } else {
                    row = helpers.addCell(row, "No");
                }

                $(row).on("click", function(e) {
                    options.selectedManager.toggle(this);
                });
                row.setAttribute("id", "selectable_" + output_div.replace("list", "") + "_" + data.rows[i].key);
                fieldsSelect.appendChild(row);
            }
        }
        $("#tabs").css("cursor", "auto");
        $(fieldsSelect).parent("table").dataTable();
    });
    Clickableize(popManager);
};

var SelectedManager = function (divname, options) {
    var that = this,
        container = document.getElementById(divname),
        description = {};
    return {
        clear: function () {
            $(container).children().remove();
        },
        refreshDescriptions: function () {
            console.log("Hello");

        },
        add: function (el, DefaultVal) {
            var AddedRow,
                ClickedRow,
                FieldName,
                Description,
                cell,
                i,
                row,
                removeCallback = function () {
                    that.remove(FieldName);
                },
                descriptionCallback = function (row2) {
                    var otherRow = row2;
                    return function (d) {
                        var type,
                            el,
                            Description,
                            row = d.rows[0].value;
                        Description = row.Description;
                        $(otherRow).find(".queryDescription").text(Description);
                        if (row.IsFile === true) {
                            $(otherRow).find(".queryIsFile").text("Yes");
                        } else {
                            $(otherRow).find(".queryIsFile").text("No");
                        }
                    };
                },
                id,
                otherdivname,
                FieldNameArray,
                IsFile;
            if (typeof el === "string") {
                id = container.id + "_" + el;
                otherdivname = divname.replace("selected", "");
                FieldName = el;
                FieldNameArray = FieldName.split(",");
                el = document.getElementById("selectable" + "_" + otherdivname + "_" + el);

            }
            /*
            if (!$(el).hasClass("selectable")) {
                return;
            }
            */
            $(el).addClass("selected");
            $(el).addClass("ui-state-highlight");
            if (container.tagName === 'TBODY') {
                ClickedRow = $(el).children();

                if (FieldName === undefined) {
                    FieldName = ClickedRow[0].textContent;
                    Description = ClickedRow[1].textContent;
                    IsFile = ClickedRow[2].textContent;
                }


                row = document.createElement("tr");
                row.setAttribute("id", container.id + "_" + FieldName);

                for (i = 0; i < options.order.length; i += 1) {
                    if (options.order[i] === "actions") {
                        cell = document.createElement("td");
                        helpers.createActionsCell(FieldName, cell);
                        row.appendChild(cell);
                        that = this;
                        $(row).find(".actionRemove").click(removeCallback);
                    } else if (options.order[i] === "field") {
                        row = helpers.addCell(row, FieldName, "queryField");
                    } else if (options.order[i] === "description") {
                        row = helpers.addCell(row, Description, "queryDescription");
                    } else if (options.order[i] === "operator") {
                        row.appendChild(helpers.createOperatorElement());
                    } else if (options.order[i] === "isfile") {
                        row = helpers.addCell(row, IsFile, "queryIsFile");
                    } else if (options.order[i] === "value") {
                        cell = document.createElement("td");
                        row.appendChild(cell);
                        helpers.createValueInputForField(FieldName, cell, DefaultVal);
                    } else if (options.order[i] === "sessions") {
                        row = helpers.addCell(row, "");
                    } else {
                        row = helpers.addCell(row, options.order[i]);
                    }
                }

                if (FieldNameArray !== undefined) {
                    // Was called by API, not by clicking.
                    $.getJSON("_view/datadictionary", {
                        key: JSON.stringify(FieldNameArray),
                        reduce: false
                    },
                        descriptionCallback(row)
                        );
                }
                container.appendChild(row);

                row.scrollIntoView();
            }
            return row;
        },
        remove: function (el) {
            var id, selecto, otherdivname;

            if (typeof el === "string") {
                id = container.id + "_" + el;
                otherdivname = divname.replace("selected", "");
                el = document.getElementById("selectable" + "_" + otherdivname + "_" + el);
            } else {
                id = container.id + "_" + $(el).children()[0].textContent;
            }

            selecto = document.getElementById(id);

            $(el).removeClass("selected");
            $(el).removeClass("ui-state-highlight");
            if (selecto && selecto.parentNode) {
                selecto.parentNode.removeChild(selecto);
            }
        },
        toggle: function (el) {
            var jel = $(el);
            if (jel.hasClass("selectable")) {
                if (jel.hasClass("selected")) {
                    this.remove(el);
                } else {
                    this.add(el);
                }
            }
        },
        contains: function (el) {
            var selecto = document.getElementById(container.id + "_" + el);
            if (selecto) {
                return true;
            }
            return false;
        },
        setSessions: function (fieldname, value) {
            var i, j, selecto, span, list, el, r_fieldname = fieldname.replace(",", "-");
            selecto = document.getElementById(container.id + "_" + fieldname);
            for (i = 0; i < options.order.length; i += 1) {
                if (options.order[i] === 'sessions') {

                    span = document.createElement("span");
                    span.setAttribute("class", "html_tool_tip_trigger");
                    span.setAttribute("data-tool-tip-id", "tooltip-" + r_fieldname);
                    span.textContent = "Sessions";
                    //span.setAttribute("title", "[" + value.join(", ") + "]");

                    list = document.createElement("ul");
                    list.setAttribute("class", "tooltip");
                    list.setAttribute("id", "tooltip-" + r_fieldname);

                    for (j = 0; j < value.length; j += 1) {
                        el = document.createElement("li");
                        el.textContent = value[j];
                        list.appendChild(el);
                    }



                    $(selecto).children()[i].appendChild(span);
                    $(selecto).children()[i].appendChild(list);
                    $(list).hide();
                    //textContent  = "<span title=\"" + value.join(", ") + "]\">See sessions</span>";
                }
            }
        },
        getSelected: function () {
            var selectedEl = $(container).children("tr");
            return selectedEl;
        },
        getSelectedNames: function () {
            var selectedEl = $(container).children("tr"),
                selected = [],
                i = 0,
                val;

            for (i = 0; i < selectedEl.length; i += 1) {
                val = $(selectedEl[i]).children(".queryField")[0].textContent;
                if (val && val !== '') {
                    selected.push(val);
                }
            }
            return selected;
        },
        getValue: function (id) {
            var allEls = $(container).children(),
                i = 0;

            for (i = 0; i < allEls.length; i += 1) {
                if (allEls[i].childNodes[1].textContent === id) {
                    return $(allEls[i]).children(".queryParam").val();
                }
            }
        },
        getOperator: function (id) {
            var allEls, i;
            allEls = $(container).children();
            i = 0;

            for (i = 0; i < allEls.length; i += 1) {
                if (allEls[i].childNodes[1].textContent === id) {
                    return $(allEls[i]).children("select.queryOp").val();
                }
            }
        },

        isFileField: function (FieldName) {
            var row = document.getElementById(container.id + "_" + FieldName);

            return ($(row).find(".queryIsFile").text() === "Yes");
            //console.log(FieldName);
            //return false;
        }

    };
};

function Clickableize(manager) {
    $("#DefinePopulation .selectable").on("click", function (e) {
        var el = e.currentTarget;
        popManager.toggle(el);
    });
}
$(document).ready(function () {
    defineManager = new SelectedManager("selectedfields", { order: ["actions", "field", "description", "isfile"] });
    popManager = new SelectedManager("selectedpopfields", { order: ["actions", "field", "operator", "value", "sessions"] });
    Categories.list("categories");
    Categories.list("categories_pop");
});

