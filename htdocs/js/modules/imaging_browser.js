var jivNames = [];
var jivData = [];

function is_added_jiv_panel(name) {
    "use strict";
    var i;
    for (i = 0; i < jivNames.length; i += 1) {
        if (jivNames[i] === name) {
            return true;
        }
    }
    return false;
}

function remove_jiv_panel(name) {
    "use strict";
    var newNames = [], newData = [], i;
    for (i = 0; i < jivNames.length; i += 1) {
        if (jivNames[i] !== name) {
            newNames.push(jivNames[i]);
            newData.push(jivData[i]);
        }
    }
    jivNames = newNames;
    jivData = newData;
    return true;
}

function add_jiv_panel(name, data) {
    "use strict";
    jivNames.push(name);
    jivData.push(data);
    return true;
}

function toggle_jiv_panel(name, data) {
    "use strict";
    if (is_added_jiv_panel(name)) {
        remove_jiv_panel(name);
    } else {
        add_jiv_panel(name, data);
    }
    return true;
}

/*global document: false, $: false, window: false*/
function show_jiv(name, data, combine) {
    "use strict";
    // start APPLET                                                                                                                                                                                          
    var appletCode = "<applet height=50 width=100 codebase=\"/mri/jiv\" archive=\"jiv.jar\" code=\"jiv/Main.class\" name=\"jiv_mri\">\n" + "<param name=\"inline_config\" value=\"# ;\n" + "jiv.download : upfront ;\n", panel_counter = 0, i, appletDiv = document.getElementById("jivApplet");
    for (i = 0; i < name.length; i += 1) {
        appletCode += name[i] + " : /mri/jiv/get_file.php?file=" + 'jiv/' + data[i] + ".raw_byte.gz ;\n";
        appletCode += name[i] + ".header : /mri/jiv/get_file.php?file=" + 'jiv/' + data[i] + ".header ;\n";
        appletCode += "jiv.panel." + panel_counter + " = " + name[i] + " ;\n";
        appletCode += "jiv.panel." + panel_counter + ".coding : gray ;\n";
        panel_counter += 1;

        if (combine && (i < name.length - 1)) {
            appletCode += "jiv.panel." + panel_counter + ".combine : " + name[i] + " " + name[i + 1] + " ;\n";
            panel_counter += 1;
        }
    }

    appletCode += "jiv.sync : true ;\n";

    // end APPLET                                                                                                                                                                                                
    appletCode += "\"></applet> \n";

    appletDiv.innerHTML = appletCode;
    return true;

}

$(function () {
    "use strict";
    $(".table-mri>tbody>tr:odd").css("background-color", "#d0d0d0");
    $(".table-mri>tbody>tr:even").css("background-color", "#eeeeee");

});

function open_popup(newurl) {
    "use strict";
    var x = 200, y = 400, open_param = 'width=500px,height=300px, toolbar=no, location=no,status=yes, scrollbars=yes, resizable=yes, top=' + y + ', screenY=' + y + ', left=' + x + ', screenX=' + x;
    window.open(newurl, 'feedback_mri', open_param);
}
