
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

var objs;

var iddata = {
    sessionID:sessionID,
    option:'surface',
    submit: 'yeah!'
};

$.ajax({
    type: 'POST',
    url: 'findFiles.php',
    data: iddata, 
    async: false,
    success: function(data) {
        objs = data;
    }
});

var home;

$.ajax({
    type: 'GET',
    url: 'findURL.php',
    async: false,
    success: function(data) {
        home = data;
    }
});

var objFiles = objs.split("\n");

for(i = 0; i < objFiles.length; i++){
    if (objFiles[i] != ""){
        document.write("<option value=\"" + home + "/" +  objFiles[i] + "\">" + objFiles[i] + "</option>");
    } 
}

