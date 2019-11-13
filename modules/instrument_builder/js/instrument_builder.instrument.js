/*global document: false, $: false, alert: false, saveAs: false, Enumize: false*/
var Instrument = {
   //  validate: function () {
   //      "use strict";
   //      var names = [],
   //          table = document.getElementById("workspace"),
   //          name,
   //          type,
   //          question,
   //          i,
   //          row;

   //      for (i = 0; i < table.rows.length; i += 1) {
   //          //alert("Checking row" + i);
   //          row = table.rows[i];
   //          name = $.trim(row.children[0].textContent);
   //          type = $.trim(row.children[1].textContent);
   //          question = $.trim(row.children[2].textContent);

   //          if (type === "textbox" || type === "dropdown" || type === "scored" || type === "textarea" || type === "date" || type === 'multiselect') {
   //              if (name === '') {
   //                  alert("Must supply database name for " + type);
   //                  return false;
   //              } else if (names.indexOf(name) >= 0) {
   //                  alert("Duplicate question name: " + name);
   //                  return false;
   //              }
   //          }
   //          names.push(name);

   //      }
   //      alert("Instrument appears valid");
   //      return true;
   //  },

    save: function (saveInfo, elements) {
        "use strict";
        var name = saveInfo.fileName || "instrument",
            content = this.render(saveInfo, elements),
            element = document.createElement("a"),
            blob = new Blob([content], { type: 'text/plain;base64' }),
            url = URL.createObjectURL(blob);


        // var valid = this.validate(), content, name, fs, element;
        // if (!valid) {
        //     return;
        // }
        // content = this.render();
        // name = document.getElementById("filename").value || "instrument";

        element.href = url;
        element.download = name + ".linst";
        element.style.display = "none";
        // add element to the document so that it can be clicked
        // this is need to download in firefox
        document.body.appendChild(element);
        element.click();
        // remove the element once it has been clicked
        document.body.removeChild(element);
    },
    render: function (saveInfo, elements) {
        "use strict";
        var content = '',
            name = saveInfo.fileName || "instrument",
            title = saveInfo.instrumentName,
            element,
            i,
            option;
        if (!name) {
            alert("Invalid name");
            return;
        }

        content += "table{@}" + name + "\n";
        if (title) {
            content += "title{@}" + title + "\n";
            // Add metadata fields
            content += "date{@}Date_taken{@}Date of Administration{@}2006{@}2012\n";
            content += "static{@}Candidate_Age{@}Candidate Age (Months)\n";
            content += "static{@}Window_Difference{@}Window Difference (+/- Days)\n";
            content += "select{@}Examiner{@}Examiner{@}NULL=>''\n";

        }

        for (i = 0; i < elements.length; i++) {
            if (i > 0) {
                content += "page{@}{@}" + elements[i].Description + "\n";
            }
            for (element of elements[i].Elements) {
                switch (element.Type) {
                    case "line":
                        content += 'static{@}{@}<br>\n';
                    case "select":
                        if (element.Options.AllowMultiple) {
                            content += "selectmultiple{@}"
                        } else {
                            content += "select{@}"
                        }
                        content += element.Name + "{@}" + element.Description + "{@}";
                        content += "NULL=>''";
                        for (option in element.Options.Values) {
                            if (option !== '') {
                                content += "{-}'" + option + "'=>'" + element.Options.Values[option] + "'";
                            }
                        }
                        content += "{-}'not_answered'=>'Not Answered'\n";
                        break;
                    case "text":
                        if (element.Options.Type === "large") {
                            content += 'textarea{@}';
                        } else {
                            content += 'text{@}';
                        }
                        content += element.Name + "{@}" + element.Description + "\n";
                        content += "select{@}" + element.Name + "_status" +
                            "{@}{@}NULL=>''{-}'not_answered'=>'Not Answered'\n";
                        break;
                    case "date":
                        var elName = element.Name.replace(/\s/g, "").toLowerCase();
                        var dropdown = "";

                        // Add dropdown and special naming when no date format is set
                        // (i.e when addDateElement() is used)
                        if (element.Options.dateFormat === "") {
                            elName = elName + "_date";
                            dropdown = "select{@}" + elName + "_status" +
                            "{@}{@}NULL=>''{-}'not_answered'=>'Not Answered'\n";
                        }

                        content += 'date{@}';
                        content += elName + "{@}" + element.Description;
                        content += "{@}" + element.Options.MinDate.split('-')[0];
                        content += "{@}" + element.Options.MaxDate.split('-')[0];
                        content += "{@}" + element.Options.dateFormat + "\n";
                        content += dropdown;
                        break;
                    case "numeric":
                        content += 'numeric{@}';
                        content += element.Name + "{@}" + element.Description;
                        content += "{@}" + element.Options.MinValue;
                        content += "{@}" + element.Options.MaxValue + "\n";
                        content += "select{@}" + element.Name + "_status" +
                            "{@}{@}NULL=>''{-}'not_answered'=>'Not Answered'\n";
                        break;
                    case "score":
                        content += 'static{@}';
                        content += element.Name + "{@}" + element.Description + "\n";
                        break;
                    case "label":
                        content += 'static{@}{@}' + element.Description + "\n";
                        break;
                    case "header":
                        content += 'header{@}{@}' + element.Description + "\n";
                        break;
                    default:
                        break;
                }
            }
        }
        return content;
   },
    load: function (file, callback) {
        var reader = new FileReader();
            ParseInstrument = function () {
                var elementNames = [];
                var Elements = [{
                        Type        : "ElementGroup",
                        GroupType   : "Page",
                        Description : "Top",
                        Elements    : []
                    }],
                    fileInfo = {
                        fileName: '',
                        instrumentName: ''
                    },
                    tempElement = {},
                    specialCase = false,
                    currentPage = 0,
                    lines = this.result.split("\n"),
                    options,
                    keyVal;
                for (line of lines) {
                    if (line == '') {
                        continue;
                    }
                    pieces = line.split("{@}");
                    if(pieces[1] == "Date_taken" || pieces[1] == "Examiner" || pieces[1] == "Candidate_Age" || pieces[1] == "Window_Difference" ||
                            (pieces[1] && pieces[1].indexOf && pieces[1].indexOf("_status") >= 0)) {
                        continue;
                    }
                    switch (pieces[0]) {
                        case "table":
                            fileInfo.fileName = pieces[1];
                            continue;
                        case "title":
                            fileInfo.instrumentName = pieces[1];
                            continue;
                        case "page":
                            Elements.push({
                                Type        : "ElementGroup",
                                GroupType   : "Page",
                                Description : pieces[2],
                                Elements    : []
                            });
                            currentPage++;
                            continue;
                        case "selectmultiple":
                            specialCase = true;
                        case "select":
                            tempElement.Type = 'select';
                            tempElement.Name = pieces[1];
                            tempElement.Description = pieces[2];
                            tempElement.Options = {
                                Values : {},
                                AllowMultiple : specialCase
                            };
                            options = pieces[3].split("{-}");
                            for (option of options) {
                                keyVal = option.split("=>");
                                if (keyVal[0].indexOf('not_answered') == -1) {
                                    if (keyVal[0] == "NULL") {
                                        tempElement.Options.Values['']
                                            = keyVal[1].substr(1, keyVal[1].length-2);
                                    } else {
                                        tempElement.Options.Values[keyVal[0].substr(1, keyVal[0].length-2)]
                                            = keyVal[1].substr(1, keyVal[1].length-2);
                                    }
                                }
                            }
                            tempElement.selected = {
                                id: (specialCase) ? "multiselect" : "dropdown",
                                value: (specialCase) ? "Multiselect" : "Dropdown"
                            };
                            break;
                        case "textarea":
                            specialCase = true;
                        case "text":
                            tempElement.Type = 'text';
                            tempElement.Name = pieces[1];
                            tempElement.Description = pieces[2];
                            tempElement.Options = {
                                Type : (specialCase) ? 'large' : 'small'
                            };
                            tempElement.selected = {
                                id: (specialCase) ? "textarea" : "textbox",
                                value: (specialCase) ? "Textarea" : "Textbox"
                            };
                            break;
                        case "date":
                            tempElement.Type = 'date';
                            tempElement.Name = pieces[1];
                            tempElement.Description = pieces[2];
                            tempElement.Options = {
                                MinDate : pieces[3] + "-01-01",
                                MaxDate : pieces[4] + "-12-31"
                            };
                            tempElement.selected = {
                                id: "date",
                                value: "Date"
                            };
                            break;
                        case "numeric":
                            tempElement.Type = 'numeric';
                            tempElement.Name = pieces[1];
                            tempElement.Description = pieces[2];
                            tempElement.Options = {
                                MinValue : pieces[3],
                                MaxValue : pieces[4]
                            };
                            tempElement.selected = {
                                id: "numeric",
                                value: "Numeric"
                            };
                            break;
                        case "static":
                            tempElement.Type = (pieces[1] === '') ? 'label' : 'score';
                            if (tempElement.Type === 'score') {
                                tempElement.Name = pieces[1];
                                tempElement.selected = {
                                    id: "score",
                                    value: "Scored Field"
                                };
                            } else {
                                tempElement.selected = {
                                    id: "label",
                                    value: "Label"
                                };
                            }
                            tempElement.Description = pieces[2];
                            break;
                        case "header":
                            tempElement.Type = 'header';
                            tempElement.Description = pieces[2];
                            tempElement.selected = {
                                id: "header",
                                value: "Header"
                            };
                            break;
                        default:
                            break;
                    }

                    /* "Header" elements always have 'undefined' as their Name. These should not trigger an error message. */
                    if (tempElement.Name) {
                        if (elementNames.indexOf(tempElement.Name) < 0) {
                            if (tempElement.Type != "header") {
                                elementNames.push(tempElement.Name)
                            }
                        } else {
                            var alertMessage = [
                                "Duplicate entry on element named: ",
                                tempElement.Name,
                                ".",
                                React.createElement('br'),
                                "Instrument file can not contain elements with identical names.",
                                React.createElement('br'),
                                "Please verify the format of your LINST file!",
                            ];
                            callback.error("duplicateEntry", alertMessage);
                            return;
                        }
                    }

                    Elements[currentPage].Elements.push(tempElement);
                    tempElement = {};
                    specialCase = false;
                }
                callback.success(Elements, fileInfo);
            };
        if (file.name.split('.')[1] === 'linst') {
            reader.onload = ParseInstrument;
            var data = reader.readAsText(file);
        } else {
            callback.error("typeError");
        }
    },
    enumize: function (option) {
        var enum_option = option.replace(/ /g, "_");
        enum_option = enum_option.replace(/\./, "");
        enum_option = enum_option.toLowerCase();
        return enum_option;
    },
    clone: function(obj) {
        return JSON.parse(JSON.stringify(obj))
    }
}
