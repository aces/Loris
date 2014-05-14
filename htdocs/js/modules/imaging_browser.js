function getParameterByName(name)
{
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if(results == null)
	return "";
  else
      return decodeURIComponent(results[1].replace(/\+/g, " "));
}

sID = getParameterByName('sessionID');


var jivNames = new Array();
var jivData = new Array();

function toggle_jiv_panel(name, data) {
    if(is_added_jiv_panel(name, data))
        remove_jiv_panel(name, data);
    else
        add_jiv_panel(name,data);
    return true;
}

function add_jiv_panel(name, data) {
    jivNames.push(name);
    jivData.push(data);
    return true;
}

function remove_jiv_panel(name, data) {
    var newNames = new Array();
    var newData = new Array();

    for(var i=0; i<jivNames.length; i++) {
        if(jivNames[i] != name) {
            newNames.push(jivNames[i]);
            newData.push(jivData[i]);
	}
    }
    jivNames = newNames;
    jivData = newData;
    return true;
}

function is_added_jiv_panel(name, data) {
    for(var i=0; i<jivNames.length; i++) {
        if(jivNames[i] == name) {
            return true;
        }
    }
    return false;
}
function show_jiv(name, data, combine) {
    // start APPLET
    var appletCode = "<applet height=50 width=100 codebase=\"/mri/jiv\" archive=\"jiv.jar\" code=\"jiv/Main.class\" name=\"jiv_mri\">\n" + "<param name=\"inline_config\" value=\"# ;\n" + "jiv.download : upfront ;\n";

    var panel_counter = 0;
    for(var i=0; i<name.length; i++) {
       	appletCode += name[i]+" : /mri/jiv/get_file.php?file="+'jiv/'+ data[i]+".raw_byte.gz ;\n";
	appletCode += name[i]+".header : /mri/jiv/get_file.php?file="+ 'jiv/' + data[i]+".header ;\n";
	appletCode += "jiv.panel."+panel_counter+" = "+name[i]+" ;\n";
	appletCode += "jiv.panel."+panel_counter+".coding : gray ;\n";
//  appletCode += "jiv.panel."+panel_counter+".range : 0.10 0.63 ;\n";
	panel_counter++;

	if(combine && (i < name.length - 1)) {
            appletCode += "jiv.panel."+panel_counter+".combine : " + name[i] + " " + name[i+1] + " ;\n";;
	    panel_counter++;
	}
    }

    appletCode += "jiv.sync : true ;\n";

// end APPLET
    appletCode += "\"></applet> \n";

// alert(appletCode);

    var appletDiv = document.getElementById("jivApplet");
    appletDiv.innerHTML = appletCode;
    return true;

}

$(function() {
    $(".mri>tbody>tr:odd").css("background-color", "#d0d0d0");
    $(".mri>tbody>tr:even").css("background-color", "#eeeeee");
    
});

function open_popup(newurl) {
    var x = 200, y = 400;
    var open_param = 'width=500px,height=300px, toolbar=no, location=no,status=yes, scrollbars=yes, resizable=yes, top='+y+', screenY='+y+', left='+x+', screenX='+x;
    window.open(newurl, 'feedback_mri', open_param);
}