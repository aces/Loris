var Rules = {
    save: function () {
        var content = new BlobBuilder();
        var rules = document.getElementById("rules_workspace")
        var name = document.getElementById("filename").value || "instrument";

        for(var i=1; i < rules.rows.length; i++) {
            row = rules.rows[i]
            Rule = new Array();
            Rule.push(row.firstChild.innerText); // Question
            Rule.push(row.firstChild.nextSibling.nextSibling.nextSibling.innerText)
            Rule.push(row.firstChild.nextSibling.innerText + "{@}=={@}" + row.firstChild.nextSibling.nextSibling.innerText)
            content.append(Rule.join("{-}"))
            content.append("\n");
        }
        fs = saveAs(content.getBlob("text/plain;charset=utf-8"), name + ".rules");
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

        chosen = document.getElementById("rule_values");
        var selected = new Array()
        for(var i=0; i < chosen.length; i++) {
            if(chosen[i].selected) {
                selected.push(Enumize(chosen[i].value))
            }
        }

        r_values.innerText = selected.join("|")
        row.appendChild(r_name);
        row.appendChild(r_dependency);
        row.appendChild(r_values);
        row.appendChild(r_message);

        document.getElementById("rules_workspace").appendChild(row);
    }
}
