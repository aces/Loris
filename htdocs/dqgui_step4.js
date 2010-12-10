
function saveQuery(){
    var oName=document.getElementById("saveName");
    var oFields=document.getElementById("saveFields");
    var oConditionals=document.getElementById("saveConditionals");
    if(oName.value==""){
        alert("you must enter a name to save a query");
        return false;
    }
    if(oFields.checked==false && oConditionals.checked==false){
        alert("You must choose to save at least the fields, or the conditionals.");
        return false;
    }
    
    //IE likes to FORCE you to do it this way, which probably won't work in moz
    
    var oQueryField=IFrameDoc.getElementById("queryData");
    var oModeField=IFrameDoc.getElementById("mode");
    oModeField.value="saveQuery";
    
    oQueryField.value=oName.value+"{-@-}";
    
    if(oFields.checked){
        for(var i in selectedFields){
            oQueryField.value+=i+"\n";
        }
    }
    oQueryField.value+="{-@-}";
    if(oConditionals.checked){
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
    } else {
        oQueryField.value+="{-@-}";
    }
    var oForm=IFrameDoc.getElementById("saveQueryForm");
    oForm.submit();
}

//Notifies the user that their query has been saved and recreates the query list table
function querySaved(){
        alert("Your query has been saved.");
        sendRemoteDataQuery("query_gui_data_loader.php?mode=listQueries");
}

function callLoadQuery(){
    var bits=this.id.split("-");
    var action=bits[0];
    var qid=bits[1];
    
    sendRemoteDataQuery("query_gui_data_loader.php?mode=loadQuery&action="+action+"&qid="+qid);
}

function loadQuery(action, qid, queryName, qrUsedCategories, qrFields, qrConditionals, qrConditionalsGroups, qrGroupsNesting){
    if(!loadingData['dataLoaded']){
        createDivWindow("Loading query '"+queryName+"', please wait..");
        loadingData['qid']=qid;
        loadingData['queryName']=queryName;
        loadingData['action']=action;
        loadingData['qrFields']=qrFields;
        loadingData['qrConditionals']=qrConditionals;
        loadingData['qrConditionalsGroups']=qrConditionalsGroups;
        loadingData['qrGroupsNesting']=qrGroupsNesting;
        loadingData['qrUsedCategories']=qrUsedCategories;
        loadingData['dataLoaded']=true;
    }
    
    //Load categories (if not already loaded)
    for (var catId in loadingData['qrUsedCategories']){
        if(!cachedCategories[catId]){
            //If the frame is NOT ready then wait a second and recall this function.  Argument passing seems to be defunct, thus the previous recording of args
            //into a global array
             if(!IFrameReady){
                setTimeout('loadQuery()',100);
                return;
            }
            sendRemoteDataQuery("query_gui_data_loader.php?mode=fields&cat_id="+catId+"&type=fields");
        }
    }
    
    //Once again, don't do anything till we have our data.
    if(!IFrameReady){
        setTimeout('loadQuery()',100);
        return;
    }
            
    //Load fields
    if(loadingData['qrFields'] && (loadingData['action']=='query_load_fields' || loadingData['action']=='query_load_both')){
        loadFieldsSet(loadingData['qrFields']);
    }
    
    //Load conditionals
    if(loadingData['qrConditionals'] && (loadingData['action']=='query_load_conditionals' || loadingData['action']=='query_load_both')){
        loadConditionalsSet(loadingData['qrConditionals'], loadingData['qrConditionalsGroups'], loadingData['qrGroupsNesting']);
    }
    
    //clear the loading data array and remove the loading window
    loadingData=null;
    loadingData=new Array();
    removeDivWindow();
}


function loadFieldsSet(qrFields){
    //remove prior selected fields
    var oOldChecked=document.getElementsByName("fieldsSelectCheckbox");
    if(oOldChecked.length>0){
        for(var i=0;i<oOldChecked.length;i++){
            if(oOldChecked[i].checked){
                oOldChecked[i].checked=false;
                addFieldToSelected(oOldChecked[i].id, false, true);
            }
        }
    }
    //uncheck Checkall boxes
    var oOldCheckAll=document.getElementsByName("checkAllCheckbox");
    if(oOldCheckAll.length>0){
        for(var i=0;i<oOldCheckAll.length;i++){
            oOldCheckAll[i].checked=false;
        }
    }
    //Check the box off
    for(var fid in qrFields){
        var oCheckbox=document.getElementById("fieldsSelect_"+fid);
        oCheckbox.checked=true;
        var el=oCheckbox;
        while(el.tagName!="DIV"){
            el=el.parentNode;
        }
        addFieldToSelected("fieldsSelect_"+fid, true, true);
    }
}


function loadConditionalsSet(qrConditionals, qrConditionalsGroups, qrGroupsNesting){
    //remove prior conditionals
    var oContainerTD=document.getElementById("conditionalsGroup_0");
    var oContainerTR=oContainerTD.parentNode;
    oContainerTR.removeChild(oContainerTD);
    
    var oContainerTD=document.createElement("TD");
    oContainerTD.id='conditionalsGroup_0';
    oContainerTD.setAttribute("valign","top");
    oContainerTR.appendChild(oContainerTD);
    
    //Add in group header elemetns
    addConditionalGroupHeaderElements(oContainerTD, true, "Main Group");
    
    //destroy existing data arrays
    delete selectedConditionals;
    delete conditionalGroups;
    delete groupNesting;
    
    selectedConditionals=new Array();
    selectedConditionals=qrConditionals;
    conditionalGroups=new Array(); 
    conditionalGroups=qrConditionalsGroups;
    groupNesting=new Array();
    groupNesting=qrGroupsNesting;
    
    var oGroups=new Array();
    //create new data arrays
    for(var gid in qrConditionalsGroups){
        oGroups[gid]=createGroup(oContainerTD, gid, qrConditionalsGroups[gid]);
    }
    oGroups[0]=oContainerTD;
    for(var gid in qrGroupsNesting){
        oGroups[qrGroupsNesting[gid]].appendChild(oGroups[gid]);
    }
    //create and append conditionals
    for(var cid in qrConditionals){
        var fieldId=qrConditionals[cid][0];
        var oConditional=createConditionalBox(cid, fieldData[fieldId][1], fieldData[fieldId][4], fieldData[fieldId][5], qrConditionals[cid][1], qrConditionals[cid][2]);
        oGroups[qrConditionals[cid][3]].appendChild(oConditional);
    }
    //add groups
    
    
    //add conditionals
    
}


//Creates a popup message window that has a high z index, thus disabling all forms
function createDivWindow(message){
    var oDiv=document.createElement("DIV");
    oDiv.id="divWindow";
    oDiv.style.width=screen.width-100;
    oDiv.style.height=screen.height-300;
    oDiv.style.position="absolute";
    oDiv.style.top="0px";
    oDiv.zIndex="1000";
    oDiv.innerHTML="<center><table style='margin-top:200px;border:2px black solid;height:200px;width:500px;background-color:lightGrey'><tr><td align='center'>"+message+"</td></tr></table>";
    document.body.appendChild(oDiv);
    
}

//Kills the popup div window
function removeDivWindow(){
    var dw=document.getElementById("divWindow");
    dw.parentNode.removeChild(dw);
    return true;
}



function deleteQuery(){
    var bits=this.id.split("-");
    var action=bits[0];
    var qid=bits[1];
    if(confirm("Are you sure you want to delete this query?")){
        sendRemoteDataQuery("query_gui_data_loader.php?mode=deleteQuery&qid="+qid);   
    }
}

function queryDeleted(){
    alert("Query deleted");
    sendRemoteDataQuery("query_gui_data_loader.php?mode=listQueries");
}

//listQueries creates the table of stored queries, with all the appropriate buttons
function listQueries(queryList){
    var oContainer=document.getElementById("queryListTable");
    
    //Remove the old list
    var oTbody=getFirstTagNodeByType(oContainer.firstChild, "TBODY");
    oContainer.removeChild(oTbody);
    var oTbody=document.createElement("TBODY");
    oTbody.style.fontSize="small";
    oContainer.appendChild(oTbody);
    
    //If there are no queries show the no queries row
    if(countAA(queryList)==0){
        var oEmptyRow=document.createElement("TR");
        oTbody.appendChild(oEmptyRow);
        var oEmptyCell=document.createElement("TD");
        oEmptyCell.setAttribute("colspan",5);
        oEmptyCell.setAttribute("valign","top");
        oEmptyCell.style.fontStyle="italic";
        oEmptyRow.appendChild(oEmptyCell);
        oEmptyCell.appendChild(document.createTextNode("No stored queries found"));
    } else {  //otherwise showt he queries
        for(var qid in queryList){
            //create the row
            var oRow=document.createElement("TR");
            oTbody.appendChild(oRow);
            
            //Create name cell
            var oCell=document.createElement("TD");
            oCell.style.borderBottom="1px black solid";
            oCell.setAttribute("width","40%");
            oRow.appendChild(oCell);
            oCell.appendChild(document.createTextNode(queryList[qid][1]));
            
             //Create fields cell
            var oCell=document.createElement("TD");
            oCell.style.borderBottom="1px black solid";
            oCell.setAttribute("width","15%");
            oRow.appendChild(oCell);
            if(queryList[qid][2]){
                var oButton=document.createElement("INPUT");
                oButton.setAttribute("type","button");
                oButton.setAttribute("value","Load Variables");
                oButton.onclick=callLoadQuery;
                oButton.id="query_load_fields-"+queryList[qid][0];
                oCell.appendChild(oButton);
            } else {
                oCell.appendChild(document.createTextNode("None Stored"));
            }
            
            //Create conditionals cell
            var oCell=document.createElement("TD");
            oCell.style.borderBottom="1px black solid";
            oCell.setAttribute("width","15%");
            oRow.appendChild(oCell);
            if(queryList[qid][3]){
                var oButton=document.createElement("INPUT");
                oButton.setAttribute("type","button");
                oButton.setAttribute("value","Load Population");
                oButton.onclick=callLoadQuery;
                oButton.id="query_load_conditionals-"+queryList[qid][0];
                oCell.appendChild(oButton);
            } else {
                oCell.appendChild(document.createTextNode("None Stored"));
            }
            
            //Create both cell
            var oCell=document.createElement("TD");
            oCell.style.borderBottom="1px black solid";
            oCell.setAttribute("width","15%");
            oRow.appendChild(oCell);
            
            var oButton=document.createElement("INPUT");
            oButton.setAttribute("type","button");
            oButton.setAttribute("value","Load Both");
            oButton.onclick=callLoadQuery;
            oButton.id="query_load_both-"+queryList[qid][0];
            oCell.appendChild(oButton);
            
             //Create options cell
            var oCell=document.createElement("TD");
            oCell.style.borderBottom="1px black solid";
            oCell.setAttribute("width","15%");
            oRow.appendChild(oCell);

            // only allow deletion if the query is private
            if(queryList[qid][4]) {
               var oButton=document.createElement("INPUT");
               oButton.setAttribute("type","button");
               oButton.setAttribute("value","Delete");
               oButton.onclick=deleteQuery;
               oButton.id="query_delete-"+queryList[qid][0];
               oCell.appendChild(oButton);
            } else {
                oCell.appendChild(document.createTextNode("Not deletable"));
            }       
        }
    }
        
    
}
