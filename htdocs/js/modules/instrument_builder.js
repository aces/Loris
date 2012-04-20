$(document).ready(function() {
    $.getScript("js/modules/instrument_builder.instrument.js");
    $.getScript("js/modules/instrument_builder.rules.js");
    $(".options").hide();
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
        Instrument.load()
    });
    document.getElementById("saveform").addEventListener("submit", function(ev) {
        ev.preventDefault()
        Instrument.save();
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
    $("#rule_depends").change(function() {
        table = document.getElementById("workspace")
        for(i = 1; i < table.rows.length; i++) {
            row = table.rows[i]
            questionName = row.firstChild.textContent
            questionType = row.firstChild.nextSibling.textContent
            questionDisplayCell = row.firstChild.nextSibling.nextSibling

            if(row.firstChild.innerHTML == this.value) {
                if(questionType == 'dropdown') {
                    options = questionDisplayCell.firstChild.nextSibling
                    document.getElementById("rule_values").innerHTML = options.innerHTML

                }
                return;
            }
        }
    });
    $("#preview").click(function() {
        var instrument = Instrument.render();
        var rules = Rules.render();
        var instrument_reader = new FileReader();
        var rules_reader = new FileReader();
        var instloaded = false;
        var rulesloaded = false;
        var that = this;
        instrument_reader.onload = function() {
            instloaded = true;
            document.getElementById("instrumentdata").value = this.result;
            if(instloaded && rulesloaded) {
                document.getElementById("preview").form.submit();
            }
        }
        instrument_reader.readAsText(instrument.getBlob());

        rules_reader.onload = function() {
            rulesloaded = true;
            document.getElementById("instrumentrules").value = this.result;
            if(instloaded && rulesloaded) {
                document.getElementById("preview").form.submit();
            }
        }
        rules_reader.readAsText(rules.getBlob());
        return false;
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
        min = parseInt(document.getElementById('datemin').value, 10);
        max = parseInt(document.getElementById('datemax').value, 10);
        q = addDateQuestion(question, min, max)
    } else if (selected == 'numeric') {
        min = parseInt(document.getElementById('numericmin').value, 10);
        max = document.getElementById('numericmax').value;
        q = addNumericQuestion(question, min, max);
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
        $(dbname).bind("change", function() { Rules.rebuildMenu("rule_q", "workspace"); Rules.rebuildMenu("rule_depends", "workspace", { dropdownOnly: true }); });
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

    // Add the question to the rules dropdowns too
    if(questionName.value) {
        select = document.createElement("option");
        select.setAttribute("value", questionName.value);
        select.innerHTML = questionName.value;
        document.getElementById("rule_q").appendChild(select);
        document.getElementById("rule_depends").appendChild(select.cloneNode(true));
    }
    Rules.rebuildMenu("rule_q", "workspace");
    Rules.rebuildMenu("rule_depends", "workspace", { dropdownOnly: true });
}

function addNumericQuestion(question, min, max) {
    var options = document.createElement('select'),
        option;

    if(min === undefined || min === '') {
        min = 0;
    };
    if(max === undefined || max === '') {
        max = 20;
    }
    for(i = min; i <= max; i++) {
        option = document.createElement("option");
        option.textContent = i;
        options.appendChild(option);
    }
    return [question, options];
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

function addDateQuestion(question, minyear, maxyear) {
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
    if(minyear === undefined || minyear === '') {
        minyear = 2000;
    }
    if(maxyear === undefined || maxyear === '') {
        maxyear = 2020;
    }
    for(var year = minyear; year <=maxyear; year++) {
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

function Enumize(option) {
    var enum_option = option.replace(/ /g, "_");
    enum_option = enum_option.replace(/\./, "");
    enum_option = enum_option.toLowerCase();
    return enum_option
}

// from http://stackoverflow.com/questions/1391278/contenteditable-change-events
$('[contenteditable]').live('focus', function() {
    var $this = $(this);
    $this.data('before', $this.html());
    return $this;
}).live('blur paste', function() {
    var $this = $(this);
    if ($this.data('before') !== $this.html()) {
        $this.data('before', $this.html());
        $this.trigger('change');
    }
    return $this;
});
