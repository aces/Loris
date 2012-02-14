
function executeQuery(sendTo){
    if(sendTo == 'download') {
        var oCbrainField=IFrameDoc.getElementById("download");
        oCbrainField.value="execute";
        var m = document.getElementById("message");
        m.innerHTML = "Packaging your files. They'll be ready to download <a href=\"main.php?test_name=download_files\">here</a> in a few minutes."; 
    }

    var oQueryField=IFrameDoc.getElementById("queryData");
    var oModeField=IFrameDoc.getElementById("mode");
    oModeField.value="executeQuery";

    var oOutputFormatRemote=IFrameDoc.getElementById("outputFormat");
    var oOutputFormatLocal=document.getElementById("outputFormat");
    oOutputFormatRemote.value=oOutputFormatLocal.value;

    oQueryField.value="{-@-}";
    
    
    for(var i in selectedFields){
        oQueryField.value+=i+"\n";
    }
    oQueryField.value+="{-@-}";
    
    for(var i in selectedConditionals){
        for(var x=0;x<4;x++){
            oQueryField.value+=selectedConditionals[i][x];
            if(x!=3){
                oQueryField.value+="{@}";
            }
        }
        oQueryField.value+="\n";
    }
    oQueryField.value+="{-@-}";
    
    for(var i in conditionalGroups){
        oQueryField.value+=i+"{@}"+conditionalGroups[i]+"{@}"+groupNesting[i]+"\n";
    }
    
    var oForm=IFrameDoc.getElementById("saveQueryForm");
    oForm.submit();
}

//Creates a popup message window that has a high z index, thus disabling all forms
function createDivWindow(message){
    var oDiv=document.createElement("DIV");
    oDiv.id="divWindow";
    oDiv.style.width=screen.width;
    oDiv.style.height=screen.height;
    oDiv.style.position="absolute";
    oDiv.style.top="200px";
    oDiv.zIndex="1000";
    oDiv.innerHTML="<center><table style='border:2px black solid;height:200px;width:500px;background-color:lightGrey'><tr><td align='center'>"+message+"</td></tr></table>";
    document.body.appendChild(oDiv);
    
}

//Kills the popup div window
function removeDivWindow(){
    var dw=document.getElementById("divWindow");
    dw.parentNode.removeChild(dw);
    return true;
}


//Notifies the user that their query has been saved and recreates the query list table
function querySaved(){
        alert("Your query has been saved.");
        sendRemoteDataQuery("query_gui_data_loader.php?mode=executeQuery");
}

function doNothing(){
    return true;  
}
