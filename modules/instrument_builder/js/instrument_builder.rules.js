var Rules = {
    render: function () {
        var content = '',
            rules = document.getElementById("rules_workspace"),
            Rule,
            row,
            fs,
            operator,
            value,
            i;

         for(i=1; i < rules.rows.length; i++) {
            row = rules.rows[i]
            Rule = new Array();
            Rule.push(row.firstChild.innerText); // Question
            Rule.push(row.firstChild.nextSibling.nextSibling.nextSibling.innerText)

            value = row.firstChild.nextSibling.nextSibling.innerText;
            operator = "{@}=={@}";

            // Check if it's a regex
            if(value.substring(0, 3) === '=~ ') {
                value = value.substring(3);
                operator = '{@}=~{@}';
            }
            Rule.push(row.firstChild.nextSibling.innerText + operator + value);
            content += Rule.join("{-}")
            content += "\n";
        }
         return content;
    },
    save: function () {
        var name = document.getElementById("filename").value || "instrument";

        fs = saveAs(this.render().getBlob("text/plain;charset=utf-8"), name + ".rules");
    },

    addNew: function () {
        var row = document.createElement("tr");
        var r_name = document.createElement("td");
        var r_dependency = document.createElement("td");
        var r_values = document.createElement("td");
        var r_message = document.createElement("td");

        r_name.innerText = document.getElementById("rule_q").value
        r_dependency.innerText = document.getElementById("rule_depends").value
        r_values.innerText = document.getElementById("rule_values").value
        r_message.innerText = document.getElementById("rule_message").value

        var r_regex = document.getElementById("rule_regex");
        if(r_regex.value != '') {
            r_values.innerText = "=~ " + r_regex.value
        } else {
            chosen = document.getElementById("rule_values");
            var selected = new Array()
            for(var i=0; i < chosen.length; i++) {
                if(chosen[i].selected) {
                    selected.push(Enumize(chosen[i].value))
                }
            }

            r_values.innerText = selected.join("|")
        }
        row.appendChild(r_name);
        row.appendChild(r_dependency);
        row.appendChild(r_values);
        row.appendChild(r_message);

        document.getElementById("rules_workspace").appendChild(row);
    },
    rebuildMenu: function(selectId, tableId, options) {
        var names = [];
        var table = document.getElementById(tableId);
        var select = document.getElementById(selectId);
        var i = 0;
        var el;
        if(!options) {
            options = {};
        }

        // Start at 1 to skip header row in table when getting question names
        for(i = 1;i < table.rows.length; i++) {
            if(table.rows[i].children[1].innerText) {
                if(options.dropdownOnly !== true || table.rows[i].children[1].innerText == "dropdown") {
                    names.push(table.rows[i].children[0].innerText);
                }
            }
        }

        // Clear select options
        $(select).children().remove();

        // Then recreate them
        for(i = 0; i < names.length; i++) {
            el = document.createElement("option");
            el.setAttribute("value", names[i]);
            el.innerText = names[i];
            select.appendChild(el);
        }
        $(select).change();
    }
}
