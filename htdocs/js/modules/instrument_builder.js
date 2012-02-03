$(document).ready(function() {
    $(".option").click(function() {
        $(".options").hide();
        $(".option").removeClass("selected");
        $(this).addClass("selected");
        id = $(this).attr("id");
        $("#" + id + "options").toggle();
    });
    $("#textboxoptions").hide();
    $("#dropdownoptions").hide();

    $("#load").click(function() {
        LoadInstrument();
    });
    document.getElementById("saveform").addEventListener("submit", function(ev) {
        ev.preventDefault();
        save();
    }, false);
    $("#elements").accordion({
        clearStyle: true,
        active: 1,
        autoHeight: false
    }
    );
    $("#questionText").keyup(function(event) {
        if(event.keyCode == 13) {
            addQuestion();
            this.value = '';
        }

    });
});


function alert(msg) {
        message = document.getElementById("message");
        message.innerHTML = msg;
        return;
}

function addQuestion() {

    selected = $(".selected").attr("id");
    if(!selected) {
        alert("No element type selected");
        return;
    }

    questionText = document.getElementById("questionText");
    questionName = document.getElementById("questionName");
    if(questionText.value == '' && selected != 'line') {
        if(selected == 'page') {
            alert("Must use question text as page header");
        } else {
            alert("No question text specified");
        }
        return;
    } 
    if(questionName.value == '' && selected != "header" && selected != "label" && selected != 'line' && selected != 'page') {
        alert("Must specifiy name for database to save value into");
        return;
    }
    question = document.createElement("span");
    question.innerHTML = questionText.value;
    question.setAttribute("contenteditable", "true");

    if(selected == "textbox" || selected == "textarea") {
        q = addTextQuestion(question);
    } else if(selected == "dropdown") {
        q  = addDropdownQuestion(question);
    } else if(selected == 'multiselect') {
        q  = addDropdownQuestion(question, 'multi');
    } else if(selected == "scored" || selected == "header" || selected == "label" || selected == "page") {
        q = addStaticQuestion(selected, question);
    } else if (selected == "date") {
        q = addDateQuestion(question)
    } else {
        q = [];
    }

    display = document.createElement("td");
    for(e in q) {
        if(q[e]) {
            display.appendChild(q[e]);
        }
    }
    row = document.createElement("tr");
    $(row).addClass("_moveable");
    dbname = document.createElement("td");
    if(selected != "header" && selected != "label" && selected != "line" && selected != "page") {
        dbname.innerHTML = questionName.value;
        dbname.setAttribute("contenteditable", "true");
    }
    dbtype = document.createElement("td");
    dbtype.innerHTML = selected;

    actions = document.createElement("td");
    actions.innerHTML = '(<a onclick="return moveUp(this);" href="javascript:return 0;">up</a>) (<a onclick="return moveDown(this);" href="javascript:return 0;">down</a>) (<a onclick="remove(this);" href="javascript:return 0;">delete</a>)';

    row.appendChild(dbname);
    row.appendChild(dbtype);
    row.appendChild(display);
    row.appendChild(actions);
    document.getElementById("workspace").appendChild(row);
}

function addDropdownQuestion(question, type) {
    if(!type) {
        type = '';
    }

    optionList = document.getElementById(type + "selectOptions");
    options= document.createElement("select")
    if(type == 'multi') {
        options.setAttribute("multiple", true);
    }
    options.setAttribute("contenteditable", "true");
    for(i=0; i < optionList.options.length; i++) {
        opt = document.createElement("option");
        opt.innerHTML = optionList.options[i].innerHTML;
        options.appendChild(opt);
    }

    return [question, options];

}
function addStaticQuestion(type) {
    if (type == 'header') {
        bold = document.createElement("b");
        bold.appendChild(question);

        question = bold;
    } 

    if(type == 'scored') {
        /*
        val = document.createElement('span');
        val.innerHTML = '(Scored Value)';
        return [question, val];
        */
    } 
    return [question];
}

function addDateQuestion(question) {
    var days = document.createElement('select');
    var months = document.createElement('select');
    var years = document.createElement('select');
    
    for(var day = 1; day <= 31; day++) {
        var day_el = document.createElement("option");
        day_el.innerHTML = day;
        days.appendChild(day_el);
    }
    var months_ar = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for(var mo in months_ar) {
        var month_el = document.createElement("option");
        month_el.innerHTML = months_ar[mo];
        months.appendChild(month_el);
    }
    for(var year = 2010; year < 2020; year++) {
        year_el = document.createElement("option");
        year_el.innerHTML = year;
        years.appendChild(year_el);
    }
    return [question, days, months, years];
}
function addTextQuestion(question) {

    textbox = document.createElement("input");
    textbox.setAttribute("type", "text");

    not_answered = document.createElement("select");
    not_answered.appendChild(document.createElement("option"));
    not_answered_option = document.createElement("option");
    not_answered_option.innerHTML = "Not Answered";
    not_answered_option.setAttribute("value", "not_answered");
    not_answered.appendChild(not_answered_option);

    options = document.createElement('span');
    options.appendChild(textbox);
    options.appendChild(not_answered);
    return [question, options];
}

function addDropdownOption(type) {
    if(!type) {
        type = '';
    }
    n = document.getElementById("new" + type + "SelectOption");
    list = document.getElementById(type + "selectOptions");
    option = document.createElement("option");
    option.innerHTML = n.value;
    list.appendChild(option);
}
function clearDropdownOption(type) {
    if(!type) {
        type = '';
    }
    n = document.getElementById(type + "selectOptions");
    n.options.length = 0;
}

/* Controls for rows */
function remove(aEl) {
    table = document.getElementById("workspace");
    for (i in table.rows) {
        if(aEl.parentNode.parentNode == table.rows[i]) {
            table.deleteRow(i);
            return false;
        }
    }
    return false;
}
/* from http://stackoverflow.com/questions/518382/reordering-of-table-rows-with-arrow-images-for-up-and-down */
function moveUp(aEl) {
    var me = $($(aEl).parents('tr').get(0));
    var prev = me.prev('tr');
    if (prev.attr('class') == '_moveable') me.insertBefore(prev);
    return false;
}
function moveDown(aEl) {
    var me = $($(aEl).parents('tr').get(0));
    var next = me.next('tr');
    if (next.attr('class') == '_moveable') me.insertAfter(next);
    return false;
}
/* Validate/save */
function validate() {
    names = []
    table = document.getElementById("workspace");
    for( i in table.rows) {
        if(i == 0) continue; // Skip header row
        alert("Checking row" + i);
        row = table.rows[i];
        nameCell = row.firstChild;

        if(nameCell) {
            typeCell = nameCell.nextSibling;
        } else { continue; }
        if(typeCell) {
            questionCell = typeCell.nextSibling;
        } else { continue; } 

        nameVal = $.trim(nameCell.innerText);
        rowType = typeCell.innerText;
        if(rowType == "textbox" || rowType == "dropdown" || rowType == "scored" || rowType == "textarea" || rowType == "date" || rowType == 'multiselect') {
            if(nameVal == '') {
                alert("Must supply database name for " + rowType);
                return false;
            } else if(names.indexOf(nameVal) >= 0) {
                alert("Duplicate question name: " + nameVal);
                return false;
            }
        }
        names.push(nameCell.innerText);

    }
    alert("Instrument appears valid");
    return true;
}

function save() {
    valid = validate();
    if(!valid) {
        return;
    }

    //name = prompt("Enter filename of instrument")
    name = document.getElementById("filename").value || "instrument";
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
    for( i in table.rows) {
        if(i == 0) continue; // skip header
        row = table.rows[i];
        nameCell = row.firstChild;

        if(nameCell) {
            typeCell = nameCell.nextSibling;
        } else { continue; }
        if(typeCell) {
            questionCell = typeCell.nextSibling;
            if(questionCell.firstChild) {
                qVal = $.trim(questionCell.firstChild.innerText);
            } else { 
                qVal = '';
            }
        } else { continue; } 

        nameVal = $.trim(nameCell.innerText);
        rowType = $.trim(typeCell.innerText);
        addStatus = false;
        switch(rowType) {
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
                nameVal = nameVal + "_date";
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
        content.append(nameVal);
        content.append("{@}");
        content.append(qVal);
        if(rowType == 'line') {
            content.append('<br />');
        }

        if(rowType == 'dropdown' || rowType == 'multiselect') {
            content.append('{@}');
            content.append("NULL=>''");
            options = selectOptions.children;
            for(i = 0; i < options.length; i++) {
                option = options[i].innerText;
                enum_option = option.replace(/ /g, "_");
                enum_option = enum_option.replace(/\./, "");
                enum_option = enum_option.toLowerCase();
                content.append("{-}'" + enum_option + "'=>'" + option + "'");
                
            }
            content.append("{-}'not_answered'=>'Not Answered'");
        }

        content.append("\n");
        if(addStatus) {
            content.append("select{@}" + nameVal + "_status" +
                "{@}{@}NULL=>''{-}'not_answered'=>'Not Answered'\n");
        }
    }
    //alert(name + ".linst: " + content.getBlob());
    fs = saveAs(content.getBlob("text/plain;charset=utf-8"), name + ".linst");
    fs.onwriteend = function() {
        alert("Saved file");
    }
    fs.onwritestart = function() {
        alert("Saving " + name + ".linst");
    }

}

function ParseSelectOptions(opt, type) {
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
                addDropdownOption("multi");
            }
        }
    }

}
function ParseInstrument() {
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
        if(pieces[1] == "Date_taken" || pieces[1] == "Examiner" || pieces[1] == "Candidate_Age" || pieces[1] == "Window_Difference" || pieces[1].indexOf("_status") >= 0) {
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
function LoadInstrument() {
    var file = document.getElementById("instfile").files[0];
    var reader = new FileReader();
    reader.onload = ParseInstrument;
    var data = reader.readAsText(file);
    alert("Instrument Loaded");
}
