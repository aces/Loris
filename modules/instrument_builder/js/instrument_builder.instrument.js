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

        // TODO: remove "table" from this file and add to .meta file instead
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
                      content += 'static{@}{@}<br />'+"\n";
                      break;
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
                        if (element.Options.dateFormat === "Date") {
                            elName = elName + "_date";
                            dropdown = "select{@}" + elName + "_status" +
                            "{@}{@}NULL=>''{-}'not_answered'=>'Not Answered'\n";
                        }

                        content += 'date{@}';
                        content += elName + "{@}" + element.Description;
                        content += "{@}" + element.Options.MinYear;
                        content += "{@}" + element.Options.MaxYear;
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
            ParseInstrument = function (content) {
                var elementNames = [];
                var Elements = [{
                        Type        : "ElementGroup",
                        GroupType   : "Page",
                        Description : "Top",
                        Elements    : []
                    }],
                    rules = (content.rules) ? content.rules.split("\n") : [],
                    fileInfo = {
                        fileName: '',
                        instrumentName: ''
                    },
                    tempElement = {},
                    specialCase = false,
                    currentPage = 0,
                    lines = (content.result) ? content.result.split("\n") : this.result.split("\n"),
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
                            try {
                              options = pieces[3].split("{-}");
                            } catch (error) {
                              console.error(error);
                              var alertMessage = [
                                "Syntax error found on element named: ",
                                tempElement.Name,
                                ".",
                                React.createElement('br'),
                                "Instrument file unable to load.",
                                React.createElement('br'),
                                "Please verify the content of your LINST or CSV file!",
                              ];
                              callback.error("syntaxError", alertMessage);
                              return;
                            }
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
                            // If dateformat is null or empty default to "Date" to support instruments developed
                            // before addition of new date formats
                            tempElement.Options = {
                                MinYear : pieces[3],
                                MaxYear : pieces[4],
                                dateFormat: pieces[5] || 'Date'
                            };
                            // To mimic the NDB_BVL_Instrument_LINST class behaviour we strip the _date
                            // from the standard dates name before loading it to the front end
                            // the _date will be re-appended on saving
                            if (tempElement.Options.dateFormat === 'Date'
                                && tempElement.Name.substring(tempElement.Name.length-5) === '_date') {
                              tempElement.Name = tempElement.Name.substring(0,tempElement.Name.length-5);
                            }
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
                            if (pieces[1] === '') {
                                if (pieces[2] === '<br />') {
                                  tempElement.Type = 'line';
                                } else {
                                  tempElement.Type = 'label';
                                }
                            } else {
                              tempElement.Type = 'score';
                            }

                            if (tempElement.Type === 'score') {
                                tempElement.Name = pieces[1];
                                tempElement.selected = {
                                    id: "score",
                                    value: "Scored Field"
                                };
                                tempElement.Description = pieces[2];
                            }
                            if (tempElement.Type === 'label') {
                                tempElement.selected = {
                                    id: "label",
                                    value: "Label"
                                };
                                tempElement.Description = pieces[2];
                            }
                            if (tempElement.Type === 'line') {
                              tempElement.selected = {
                                id: "line",
                                value: "Blank line"
                              };
                            }
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
            ConvertCSV = function () {
              const lines = parseCSVFile(this.result);
              // Extract headers
              const headersLine = lines[0];
              const headers = parseCSVRow(headersLine);
              // Extract data from subsequent lines
              const dataLines = lines.slice(1);
              const data = dataLines.map(parseCSVRow);
              // Transform to object
              const parsedCSV = data.map((array) => {
                let dataObject = {};
                headers.forEach((header, index) => {
                  dataObject[header] = array[index];
                });
                return dataObject;
              });
              let content = '';
              let tableName = '';
              let title = '';
              let sectionHeader = null;
              let lineContent = '';
              let rulesContent = '';
              const newLinst = parsedCSV.map((line) => {
                // Table name
                if (tableName !== '' && tableName !== line["Form Name"]) {
                  callback.error("multipleTests");
                } else if (tableName === '') {
                  tableName = line["Form Name"]; 
                }
                // title - take from table name
                if (title === '') {
                  const titleArr = tableName.split('_').map((word) => {
                    return (word.charAt(0).toUpperCase() + word.slice(1));
                  });
                  title = titleArr.join(" ");
                }
                // Section header and subtest
                if (line["Section Header"] != undefined
                    && line["Section Header"] !== ''
                    && line["Section Header"] !== sectionHeader
                ) {
                  sectionHeader = line["Section Header"];
                  lineContent += "page{@}{@}" + sectionHeader + "\n";
                  lineContent += "header{@}{@}" + sectionHeader + "\n";
                }
                let elementName = line["Variable / Field Name"];
                const elementType = line["Field Type"];
                // Replace newline in description with a slash
                const elementDescription = (line["Field Label"] || '').replace(/\n\n/g, "/ ");
                const validationType = line["Text Validation Type OR Show Slider Number"];
                const minValue = line["Text Validation Min"];
                const maxValue = line["Text Validation Max"];
                const branching = line["Branching Logic (Show field only if...)"];
                const required = line["Required Field?"];
                let linstType = '';
                switch (elementType) {
                  case "checkbox":
                    linstType = "multiselect{@}";
                  case "radio":
                    linstType = "select{@}";
                    lineContent += linstType;
                    lineContent += elementName + "{@}" + elementDescription + "{@}";
                    lineContent += "NULL=>''";
                    const options = line["Choices, Calculations, OR Slider Labels"];
                    let optionsContent = [];
                    if (options != undefined) {
                      const optionsArr = options.split(" | ");
                      optionsContent = optionsArr.map((option) => {
                        const value = option.split(/, (.+)/)[0];
                        const label = option.split(/, (.+)/)[1];
                        const optionContent = "{-}'" + value + "'=>'" + label + "'";
                        return optionContent;
                      });
                    }
                    lineContent += optionsContent.join("");
                    lineContent += "{-}'not_answered'=>'Not Answered'\n";
                    break;
                  case "yesno":
                    lineContent += "select{@}";
                    lineContent += elementName + "{@}" + elementDescription + "{@}";
                    lineContent += "NULL=>''";
                    lineContent += "{-}'1'=>'Yes'{-}'0'=>'No'";
                    lineContent += "{-}'not_answered'=>'Not Answered'\n";
                    break;
                  case "text":
                    // Date element type
                    if (validationType == "date_dmy"
                      || validationType == "date_ymd"
                    ) {
                      let dropdown = "";
                      let dateFormat = "";
                      // If element name ends with "_date", make it a standard date
                      // Otherwise, it can be a basic date
                      if (elementName.substring(elementName.length - 5) == "_date") {
                        // provide not_answered option
                        dropdown = "select{@}" + elementName + "_status" +
                          "{@}{@}NULL=>''{-}'not_answered'=>'Not Answered'\n";
                      } else {
                        dateFormat = "BasicDate";
                      }  
                      lineContent += "date{@}";
                      lineContent += elementName + "{@}" + elementDescription;
                      lineContent += "{@}" + minValue;
                      lineContent += "{@}" + maxValue;
                      lineContent += "{@}" + dateFormat + "\n";
                      lineContent += dropdown;
                    } else if (validationType == "number") {
                    // Numeric element type
                      lineContent += "numeric{@}";
                      lineContent += elementName + "{@}" + elementDescription;
                      lineContent += "{@}" + minValue;
                      lineContent += "{@}" + maxValue + "\n";
                      lineContent += "select{@}" + elementName + "_status" +
                        "{@}{@}NULL=>''{-}'not_answered'=>'Not Answered'\n";
                    } else {
                    // Text
                      lineContent += "text{@}";
                      lineContent += elementName + "{@}" + elementDescription + "\n";
                      lineContent += "select{@}" + elementName + "_status" +
                        "{@}{@}NULL=>''{-}'not_answered'=>'Not Answered'\n";
                    }
                    break;
                  case "notes":
                    lineContent += "textarea{@}";
                    lineContent += elementName + "{@}" + elementDescription + "\n";
                    lineContent += "select{@}" + elementName + "_status" +
                      "{@}{@}NULL=>''{-}'not_answered'=>'Not Answered'\n";
                    break;
                  case "calc":
                    lineContent += "static{@}";
                    lineContent += elementName + "{@}" + elementDescription + "\n";
                    elementName = '';
                    break;
                  case "descriptive":
                    lineContent += "static{@}{@}" + elementDescription + "\n";
                    elementName = '';
                    break;
                }
                // Add rules
                if (elementName != '') {
                  if (branching != undefined && branching != '') {
                    // then add rules
                    let dependentValue = '';
                    let dependentField = branching.match(/\[(.*?)\]/) ? branching.match(/\[(.*?)\]/)[1] : '';
                    if (dependentField.includes("(") && dependentField.includes(")")) {
                      // multiselect with CONTAINS
                      let substring = dependentField.match(/\((.*?)\)/);
                      dependentValue = substring[1];
                      dependentField = dependentField.replace(substring, '');
                      rulesContent += elementName + "{-}Required{-}" + dependentField + "{@}CONTAINS{@}" + dependentValue + "\n";
                    } else if (dependentField !== '') {
                      //select with ==
                      dependentValue = branching.match(/\'(.*?)\'/) ? branching.match(/\'(.*?)\'/)[1] : ''; 
                      rulesContent += elementName + "{-}Required{-}" + dependentField + "{@}=={@}" + dependentValue + "\n";
                    } 
                  } else {
                    if (required != 'y') {
                      rulesContent += elementName + "{-}Not required{-}" + elementName + "{@}=={@}NEVER_REQUIRED" + "\n";
                    }
                  }
                }
              });
              content += "table{@}" + tableName + "\n";
              content += "title{@}" + title + "\n";
              // Add metadata fields
              content += "date{@}Date_taken{@}Date of Administration{@}{@}\n";
              content += "static{@}Candidate_Age{@}Candidate Age (Months)\n";
              content += "static{@}Window_Difference{@}Window Difference (+/- Days)\n";
              content += "select{@}Examiner{@}Examiner{@}NULL=>''\n";
              content += lineContent;
              const csv = {};
              csv.result = content;
              csv.rules = rulesContent;
              ParseInstrument(csv);
            };
            parseCSVFile = (csvfile) => {
              let insideQuote = false,
                  entries = [],
                  entry = [];
              csvfile.split('').forEach((char) => {
                if (char === '"') {
                  insideQuote = !insideQuote;
                  entry.push(char);
                } else {
                  if (char == "\n" && !insideQuote) {
                    entries.push(entry.join(''));
                    entry = [];
                  } else {
                    entry.push(char);
                  }
                }
              });
              entries.push(entry.join(''));  
              return entries;
            };
            parseCSVRow = (row) => {
              let insideQuote = false,
                  entries = [],
                  entry = [];
              row.split('').forEach((char) => {
                if (char === '"') {
                  insideQuote = !insideQuote;
                } else {
                  if (char == "," && !insideQuote) {
                    entries.push(entry.join(''));
                    entry = [];
                  } else {
                    entry.push(char);
                  }
                }
              });
              entries.push(entry.join(''));
              return entries;
            };
        if (file.name.split('.')[1] === 'linst') {
            reader.onload = ParseInstrument;
            var data = reader.readAsText(file);
        } else if (file.name.split('.')[1] === 'csv') {
            reader.onload = ConvertCSV;
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
