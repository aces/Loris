
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

var sessionID = getParameterByName('sessionID');

var txts;

var iddata2 = {
    sessionID:sessionID,
    option: 'thickness',
    submit: 'yeah!'
};

var home;

$.ajax({
    type: 'GET',
    url: 'findURL.php',
    async: false,
    success: function(data) {
        home = data;
    }
});


$.ajax({
    type: 'POST',
    url: 'findFiles.php',
    data: iddata2,
    async: false,
    success: function(data) {
        txts = data;
    }   
});

var thicknessFiles = txts.split("\n");

for(i = 0; i < thicknessFiles.length; i++){
    if (thicknessFiles[i] != "") {
        document.write("<option value=\"" + home + "/" + thicknessFiles[i] + "\">" + /*"http:\/\/132.216.67.69:7080/" +*/ thicknessFiles[i] + "</option>");
    }
}
