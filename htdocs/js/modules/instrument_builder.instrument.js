var Instrument = {
    validate: function() {
        var names = []
        var table = document.getElementById("workspace");
        var name, type, question;
        for(var i=1; i < table.rows.length; i++) {
            //alert("Checking row" + i);
            row = table.rows[i];
            name = $.trim(row.children[0].textContent);
            type = $.trim(row.children[1].textContent);
            question = $.trim(row.children[2].textContent);

            if(type == "textbox" || type == "dropdown" || type == "scored" || type == "textarea" || type == "date" || type == 'multiselect') {
                if(name == '') {
                    alert("Must supply database name for " + type);
                    return false;
                } else if(names.indexOf(name) >= 0) {
                    alert("Duplicate question name: " + name);
                    return false;
                }
            }
            names.push(name);

        }
        alert("Instrument appears valid");
        return true;
    },

    save: function() {
        var valid = this.validate();
        if(!valid) {
            return;
        }
        var content = this.render();

        fs = saveAs(content.getBlob("text/plain;charset=utf-8"), name + ".linst");
        fs.onwriteend = function() {
            alert("Saved file");
        }
        fs.onwritestart = function() {
            alert("Saving " + name + ".linst");
        }
    },
    render: function() {
        var content = new BlobBuilder();
        //name = prompt("Enter filename of instrument")
        var name = document.getElementById("filename").value || "instrument";
        if(!name) {
            alert("Invalid name");
            return;
        }

        content = new BlobBuilder();
        content.append("table{@}" + name + "\n");
        title = document.getElementById("longname").value;
        if(title) {
            content.append("title{@}" + title + "\n");
            // Add metadata fields
            content.append("date{@}Date_taken{@}Date of Administration{@}2006{@}2012\n");
            content.append("static{@}Candidate_Age{@}Candidate Age (Months)\n")
            content.append("static{@}Window_Difference{@}Window Difference (+/- Days)\n")
            content.append("select{@}Examiner{@}Examiner{@}NULL=>''\n");

        }

        table = document.getElementById("workspace");
        var rows = table.rows;
        for(var i=1; i < rows.length; i++) {
            row = rows[i];
            if(row.children.length < 3) {
                continue;
            }
            name = $.trim(row.children[0].textContent);
            type = $.trim(row.children[1].textContent);
            questionCell = row.children[2];

            if(questionCell.firstChild) {
                qVal = $.trim(questionCell.firstChild.textContent);
            } else { 
                qVal = '';
            }

            addStatus = false;
            switch(type) {
                case 'header':
                    content.append('header'); break;
                case 'textbox':
                    content.append('text'); 
                    addStatus = true;
                    break;
                case 'textarea':
                    content.append('textarea'); 
                    addStatus = true;
                    break;
                case 'date':
                    content.append('date'); 
                    name = name + "_date";
                    addStatus = true;
                    break;
                case 'dropdown':
                    content.append('select');
                    selectOptions = questionCell.firstChild.nextSibling;
                    // Dropdowns have not answered as an option, not as a separate dropdown
                    addStatus = false;
                    break;
                case 'multiselect':
                    content.append('selectmultiple');
                    selectOptions = questionCell.firstChild.nextSibling;
                    addStatus = false;
                    break;
                case 'page':
                    content.append('page'); break;
                case 'scored':
                case 'line':
                case 'label':
                    content.append('static'); break;
                default: break;
            }

            content.append("{@}");
            content.append(name);
            content.append("{@}");
            content.append(qVal);
            if(type == 'line') {
                content.append('<br />');
            }

            if(type == 'dropdown' || type == 'multiselect') {
                content.append('{@}');
                content.append("NULL=>''");
                options = selectOptions.children;
                for(var j = 0; j < options.length; j++) {
                    option = options[j].innerText
                    enum_option = Enumize(options[j].innerText);
                    content.append("{-}'" + enum_option + "'=>'" + option + "'");
                    
                }
                content.append("{-}'not_answered'=>'Not Answered'");
            }

            content.append("\n");
            if(addStatus) {
                content.append("select{@}" + name + "_status" +
                    "{@}{@}NULL=>''{-}'not_answered'=>'Not Answered'\n");
            }
        }
        return content;
   },
   load: function () {
        var ParseSelectOptions = function (opt, type) {
            if(!type) {
                type = ''
            }
            var options = opt.split("{-}");
            for(var i = 0; i < options.length; i++) {
                var option = options[i]
                var keyval = option.split("=>");
                if(keyval[0] != 'NULL' && keyval[1]) {
                    // hack off the ' at the start and end
                    val = keyval[1].substr(1, keyval[1].length-2);
                    // Don't add "not_answered", because save automagically adds it.
                    if(val != 'Not Answered') {
                        document.getElementById("new" + type + "SelectOption").value = val;
                        //addDropdownOption("multi");
                        addDropdownOption(type);
                    }
                }
            }

        }       
        var ParseInstrument = function() {
            table = document.getElementById("workspace")
            $("table#workspace tr td").each(function() {
                $(this).closest("tr").remove();
            });
            for(var i = 1; i < table.rows.length; i++) {
                table.deleteRow(1)
            }
            lines = this.result.split("\n");
            for(var i = 0; i < lines.length; i++) {
                pieces = lines[i].split("{@}");
                if(pieces[1] == "Date_taken" || pieces[1] == "Examiner" || pieces[1] == "Candidate_Age" || pieces[1] == "Window_Difference" || 
                        (pieces[1] && pieces[1].indexOf && pieces[1].indexOf("_status") >= 0)) {
                    continue;
                }

                if(pieces[0] == 'date') {
                    dateIdx = pieces[1].indexOf("_date");
                    if(dateIdx >= 0) {
                        pieces[1] = pieces[1].substring(0, dateIdx);
                    }
                }
                switch(pieces[0]) {
                    case "table":
                        document.getElementById("filename").value = pieces[1]; continue;
                    case "title":
                        document.getElementById("longname").value = pieces[1]; continue;
                    case "text":
                        $("#textbox").click(); break;
                    case "selectmultiple":
                        $("#multiselect").click();
                        ParseSelectOptions(pieces[3], "multi");
                        break;
                    case "select":
                        $("#dropdown").click();
                        ParseSelectOptions(pieces[3]);
                        break;
                    case "header":
                        // lots of things are saved as "header".. need to do
                        // a little detective work
                        if(pieces[1]) {
                            $("#scored").click(); break;
                        }
                        $("#header").click(); break;
                    case "static":
                        if(pieces[1]) {
                           $("#scored").click(); break;
                        } else {
                           if(pieces[2] == '<br />') {
                               $("#line").click(); break;
                           } else {
                               $("#label").click(); break;
                           }
                        }
                    default:
                        $("#" + pieces[0]).click(); break;
                        break;
                        
                }

                document.getElementById("questionName").value = pieces[1];
                document.getElementById("questionText").value = pieces[2];
                addQuestion();
                clearDropdownOption();
                document.getElementById("questionName").value = '';
                document.getElementById("questionText").value = '';
            }
        }

        var file = document.getElementById("instfile").files[0];
        var reader = new FileReader();
        reader.onload = ParseInstrument;
        var data = reader.readAsText(file);
        alert("Instrument Loaded");
    }
}
