var groupCount=0;
var checkedItems=new Array();
var groupMemberships=new Array();

var selectedConditionals=new Array(); //The array of conditionals the user has selected.  [unique_id]=[field_id, operator, value, group_id]
var conditionalGroups=new Array();  //The array of groups that conditionals belong to.  [group_id]=operator(OR,AND).
var groupNesting=new Array(); //The array that represents group nesting.  [group_id]=parent_group_id;

var operatorsArray=new Array();
operatorsArray['number']=["=","!=",">=",">","<=","<"];
operatorsArray['string']=["=","!=","value*", "*value*"];
operatorsArray['enum']=["=","!=", ">=",">","<=","<"];

function addCheckedConditionals(){
   for(var fieldId in categoryFields[conditionalsActiveCategoryId]){
        var oCheckbox=document.getElementById("conditionalsSelect_"+fieldId);
        if(oCheckbox.checked){
            addConditionalToSelected(fieldId);
            oCheckbox.checked=false;
        }
    }
}

function addConditionalToSelected(fieldId){
    var id=selectedConditionals.length;
     //Get the target group id
    var targetGroupId=getTargetGroupId();
    
    //Get a reference to the target group (this is a div if its a nested group, a TD if this is the base outer group)
    var oContainer=document.getElementById("conditionalsGroup_"+targetGroupId);
    
     //Update the data array
    selectedConditionals[id]=new Array();
    selectedConditionals[id][0]=fieldId;
    selectedConditionals[id][1]=operatorsArray[fieldData[fieldId][4]][0];
    if(typeof fieldData[fieldId][5]=="object"){
        selectedConditionals[id][2]=fieldData[fieldId][5][0];
    } else {
        selectedConditionals[id][2]="";
    }
    selectedConditionals[id][3]=targetGroupId;
    
    var oDiv=createConditionalBox(id, fieldData[fieldId][1], fieldData[fieldId][4], fieldData[fieldId][5]);
    oContainer.appendChild(oDiv);
}

function createConditionalBox(id, fieldLabel, fieldType, fieldValue, selectedOperator, selectedValue){
    //Create Div
    var oDiv=document.createElement("DIV");
    oDiv.id='condDiv_'+id;
    oDiv.name='condDiv';
    oDiv.style.padding="5px";
    
    //Create Checkbox
    var oCheckbox=document.createElement("INPUT");
    oCheckbox.type="checkbox";
    oCheckbox.id="condCheckbox_"+id;
    oCheckbox.setAttribute("name","condCheckbox");
    oCheckbox.style.margin='5px';
    oCheckbox.onclick=checkSelectedConditional;
    oDiv.appendChild(oCheckbox);
    
    oDiv.appendChild(document.createTextNode(fieldLabel));
    //Create Operator Select
    var oSelect=document.createElement("SELECT");
    oSelect.id='condOperatorSelect_'+id;
    oSelect.setAttribute("name",'condOperatorSelect');
    oSelect.style.margin='5px';
    oSelect.onchange=updateConditionalData;
    oDiv.appendChild(oSelect);
    for(var i in operatorsArray[fieldType]){
        var oOption=document.createElement("OPTION");
        oOption.appendChild(document.createTextNode(operatorsArray[fieldType][i]));
        oOption.value=operatorsArray[fieldType][i];
        if(selectedOperator==operatorsArray[fieldType][i]){
            oOption.selected=true;
        }
        oSelect.appendChild(oOption);
    }
    
    //Create either value select (for ENUMs) or value text box
    if(typeof fieldValue=="object"){ //associative arrays are objects
        var oSelect=document.createElement("SELECT");
        oSelect.id='condValue_'+id;
        oSelect.name="condValue";
        oSelect.style.margin="5px";
        oSelect.onchange=updateConditionalData;
        oDiv.appendChild(oSelect);
        for(var i in fieldValue){
            var oOption=document.createElement("OPTION");
            oOption.appendChild(document.createTextNode(fieldValue[i]));
            oOption.value=fieldValue[i];
            if(selectedValue==oOption.value){
                oOption.selected=true;
            }
            oSelect.appendChild(oOption);
        }
    } else {
        var oTextBox=document.createElement("INPUT");
        oTextBox.type="text";
        oTextBox.id="condValue_"+id;
        oTextBox.name="condValue";
        oTextBox.style.margin="5px";
        oTextBox.onchange=updateConditionalData;
        if(selectedValue){
            oTextBox.value=selectedValue;
        }
        oDiv.appendChild(oTextBox);
    }
    return oDiv;
}

function updateConditionalData(){
    if(this.name=="condOperatorSelect"){
        var cid=this.id.substring(19);
        selectedConditionals[cid][1]=this.options[this.selectedIndex].value;
    } else {
        var cid=this.id.substring(10);
        if(this.tagName=="SELECT"){
            selectedConditionals[cid][2]=this.options[this.selectedIndex].value;
        } else {
            selectedConditionals[cid][2]=this.value;
        }
    }
    return true;
}
    
//This function is called when the user clicks  ont he checkbox next to a selected conditional.
function checkSelectedConditional(what, uncheckAll){
    if(!what || what.type=="click"){
        what=this;
    }
    var id=what.parentNode.id;
    if(what.checked==true){
        checkedItems[id]=id;
        what.parentNode.style.backgroundColor="lightBlue";
    } else {
        delete checkedItems[id];
        what.parentNode.style.backgroundColor="";
    }
    if(!uncheckAll){
        if(countAA(checkedItems)>0){
            changeButtonStatus(false);
        } else {
            changeButtonStatus(true);
        }
    }
    return true;
}

//Unchecks selected conditinoals after an action was performed on them (like grouping)
function uncheckAll(){
    var aCheckboxes=document.getElementsByTagName("INPUT");
    for(var i=0;i<aCheckboxes.length;i++){
        if(aCheckboxes[i].name=="condCheckbox"){
            aCheckboxes[i].checked=false;
            checkSelectedConditional(aCheckboxes[i], true);
        }
    }
    changeButtonStatus(true);
    checkedItems = new Array();
    return true;    
}

function changeButtonStatus(status){
    var buttons=document.getElementsByName("conditionalsSideButtons");
    for (var i=0;i<buttons.length;i++){
        buttons[i].disabled=status;
    }
    return true;
}


//checkSameMembership ensures that all checked items have the same group membership
function checkSameMembership(){
    var tmp_group=0;
    var flag=true;
    for(var item in checkedItems){
        var id=item.substring(8);
        if(tmp_group==0){
            tmp_group=selectedConditionals[id][3];
        } else if(selectedConditionals[id][3]!=tmp_group){
            flag=false;
        } 
    }
    if(flag==false){
        return false;
    }
    return tmp_group;
}

// removeCheckedButton removes all the checked conditionals
function removeCheckedButton(){
    for(var condDiv in checkedItems){
        var cid=condDiv.substring(8);
        
        removeObject(condDiv);
        delete selectedConditionals[cid];
    }
    
    purgeEmptyGroups();
    uncheckAll();
}

//checkOnlyMembers ensures that the checked items are not the ONLY members of that group.
function checkOnlyMembers(group_id){
    var groupMembers=new Array;
    for(var item in selectedConditionals){
        if(selectedConditionals[item][3]==group_id){
               groupMembers.push(group_id);
        }
    }
    if (groupMembers.length == countAA(checkedItems)){
        return true;
    }
    return false;
}

function createGroup(oContainer, gid, gOperator){
    //Increment the group id
    groupCount++; 
    
    //Creat the Div
    var oNewGroupDiv=document.createElement("DIV");
    if(gid){
        oNewGroupDiv.id='conditionalsGroup_'+gid;
    } else {
        oNewGroupDiv.id='conditionalsGroup_'+groupCount;
    }
    oNewGroupDiv.name='conditionalsGroup';
    oNewGroupDiv.style.border="1px black solid";
    oNewGroupDiv.style.padding="5px";
    oNewGroupDiv.style.margin="10px";
    oNewGroupDiv.style.marginLeft="20px";
    if(oContainer.style.backgroundColor=="lightGrey"){
        oNewGroupDiv.style.backgroundColor="white";
    } else {
        oNewGroupDiv.style.backgroundColor="lightGrey";
    }
    
    //add in all the header elements
    addConditionalGroupHeaderElements(oNewGroupDiv, false, "Group "+groupCount, gOperator);
   
    return oNewGroupDiv;
}


function addConditionalGroupHeaderElements(oContainer, groupSelected, groupName, gOperator){
    //Create the Group Name text box
    var oRadio=addNewElement("INPUT","groupSelectRadio","radio");
    oRadio.value=groupCount;
    oRadio.style.marginRight="10px";
    oRadio.checked=groupSelected;
    oContainer.appendChild(oRadio);
    
    //Create the Group Name text box
    var oTextBox=document.createElement("INPUT");
    oTextBox.type="text";
    oTextBox.value=groupName;
    oContainer.appendChild(oTextBox);
    
    //Create the group operator select box
    var oSelect=document.createElement("SELECT");
    oSelect.onchange=changeGroupOperator;
    oContainer.appendChild(oSelect);
    var oOption=document.createElement("OPTION");
    oOption.appendChild(document.createTextNode("AND"));
    oSelect.appendChild(oOption);
    if(gOperator=="AND"){
        oOption.selected=true;
    }
    var oOption=document.createElement("OPTION");
    oOption.appendChild(document.createTextNode("OR"));
    oSelect.appendChild(oOption);
    if(gOperator=="OR"){
        oOption.selected=true;
    }
    
    //create the group header divider HR
    var oHR=document.createElement("HR");
    oHR.noShade=true;
    oHR.size="1";
    oHR.color="black";
    oHR.style.marginLeft="-5px";
    oHR.style.marginRight="-5px";
    oContainer.appendChild(oHR);
}

//Activated when user clicks "group checked" button
function groupButton(){
    //Make sure at least 2 conditionals are selected
    if(countAA(checkedItems) < 2){
        alert("You must select at least 2 conditionals to form a group.");
        return;
    }
    
    //Make sure the checked items are all of the same group membership
    var parentGroupId=checkSameMembership();
    if(parentGroupId===false){
        alert("To group items they must either be ungrouped, or belong to the same group");
        return false;
    }
    
    //Make sure they are not the *only* members of that group
    //if(checkOnlyMembers(parentGroupId)){
        //alert("You cannot further group items if they are the only members of a group");
        //return false;
    //} 
    
    //Get a reference to the parent group (this is a div if its a nested group, a TD if this is the base outer group)
    var oContainer=document.getElementById("conditionalsGroup_"+parentGroupId);
    //Create the group Div
    var oNewGroupDiv=createGroup(oContainer);
    //Get a referene to the first checked item.
    var oItem=document.getElementById(getElementByIndex(checkedItems,0));
    
    //Attach the new group div at the position of the first checked item.
    oNewGroupDiv=oContainer.appendChild(oNewGroupDiv);
    //Is this a nested group?
    groupNesting[groupCount]=parentGroupId;
    conditionalGroups[groupCount]='AND';

    //Have the checked items assigned to the newly created group
    groupTargetButton(groupCount);
    
}

//Groups selected elements into the targetGroupId group.  Is used by both "move to checked" and "group checked"
function groupTargetButton(targetGroupId){
    //Get the targte group id
    if(!targetGroupId){
        var targetGroupId=getTargetGroupId();
    }
    //Get a reference to the target group (this is a div if its a nested group, a TD if this is the base outer group)
    var oContainer=document.getElementById("conditionalsGroup_"+targetGroupId);
    
    for (var i in checkedItems){
        var id=i.substring(8);
        if(selectedConditionals[id][3]!=targetGroupId){
            //Move the item
            var oItem=document.getElementById(checkedItems[i]);
            oContainer.appendChild(oItem);
            //Update the data array
            selectedConditionals[id][3]=targetGroupId;
        }
    }
    
    //Delete emtpy groups
    purgeEmptyGroups();
    
    //Uncheck all of the boxes
    uncheckAll();
}

//Delete all empty groups (except main)
function purgeEmptyGroups(){
    var usedGroups=new Array();
    
    //figure out which groups are in use and should not be deleted
    for(var i in selectedConditionals){
        usedGroups[selectedConditionals[i][3]]=true;
    }
    
    //go through groups and if theya re not in use, delete them.
    for(var groupId in conditionalGroups){
        if(!usedGroups[groupId] && !isGroupAParent(groupId)){
            var oGroupDiv=document.getElementById("conditionalsGroup_"+groupId);
            delete groupNesting[groupId];
            delete conditionalGroups[groupId];
            oGroupDiv.parentNode.removeChild(oGroupDiv);
        }
    }
}

function isGroupAParent(groupId){
    for(var i in groupNesting){
        if(groupNesting[i]==groupId){
            return true;
        }
    }
    return false;
}

function getTargetGroupId(){
    //Figure out the target Group
    var radioSelects=document.getElementsByName("groupSelectRadio");
    for(var i=0;i<radioSelects.length;i++){
        if(radioSelects[i].checked){
            var targetGroupId=radioSelects[i].value;
        }
    }
    return targetGroupId;
}

function unGroupButton(){
    //Make sure the checked items are all of the same group membership
    var parentGroupId=checkSameMembership();
    if(parentGroupId===0){
        alert("These items can not be ungrouped further");
        return false;
    }
    
    if(parentGroupId===false){
        alert("To group items they must either be ungrouped, or belong to the same group");
        return false;
    }
    
    //find out whether they are the *only* members of that group
    var onlyMembers=checkOnlyMembers(parentGroupId)
    
    //Get a reference to the parent group (this is a div if its a nested group, a TD if this is the base outer group)
    var oContainer=document.getElementById("conditionalsGroup_"+groupNesting[parentGroupId]);
    
    //Get a reference to the group div
    var oGroupDiv=document.getElementById("conditionalsGroup_"+parentGroupId);
    
    //Move the checked items into the parent container.
    for (var i in checkedItems){
        var oItem=document.getElementById(checkedItems[i]);
        oContainer.insertBefore(oItem,oGroupDiv);
        var id=i.substring(8);
        selectedConditionals[id][3]=groupNesting[parentGroupId];
    }
    
    //If these are the only members of the group, destroy it
    if(onlyMembers){
        delete groupNesting[parentGroupId];
        delete conditionalGroups[parentGroupId];
        oGroupDiv.parentNode.removeChild(oGroupDiv);
    }
    
    //Uncheck all of the boxes
    uncheckAll();
}

function changeGroupOperator(what){
    //Get the element triggering the event.
    //When an event is registered through html it does NOT pass a reference to the event as the first parameter, so you have to use this ridiculous wrap
    if(what && what.type=="select-one"){  //This happens from the main group event (it passes "this")
        var el=what;
    } else if (window.event) { //IE
        var el=window.event.srcElement;
    } else { //Gecko
        var el=arguments[0].target;
    }
    var groupId=el.parentNode.id.substring(18);
    conditionalGroups[groupId]=el.options[el.selectedIndex].value;
    return true;   
}
