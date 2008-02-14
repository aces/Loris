
//Notes
//1)  Problem:  Mozilla parses the document so that all sorts of crap nodes end up in the tree, one for every carriage return space etc.
//    Solution:  wrote wrapper function to skip nodes that are not of type 1 when I am searching for a node.
//2)  Problem:  Divs are not returned when you do a getElementsByName for no reason apparent to me.
//    Solution:  Cycle through the divs using getElementsByTagName and compare their names against whatever you are looking for
//3)  Problem:  Mozilla does not have the .name property
//    Solution:  Use getAttribute("name") and setAttribute("name","value");
//4)  Problem:  When using innerHTML, it apparently only accepts valid html strings on each assignment, so you can't break an element over several
//                     assignments.
//    Solution:  Just don't do that.
//5)  Problem:  InnerHTML is veeery slow when adding lots of elements to a page.
//    Solution: Manually add each element through the DOM.
//6) Note:  Mozilla lets you get away with the following things:
//      using for(i in myvar)  instead of for(var i in myvar)
//      oElement=document.createElement("TAG");oElement.setAttribute("name","myName");  IE:  oElement=document.createElement("<TAG NAME='myName'>");


var IFrameDoc; //IFrame document
var IFrameObj; // IFrame object

var IFrameReady = true;  //This variable keeps track of whether the iframe is currently processing a request or not.
var remotingQueue = new Array();  //This variable queues up the remoting requests

var loadingData = new Array();

//Number of currently selected fields.
var selectedFieldsCount=0;

//Currently Active Category Id.
var fieldsActiveCategoryId="none";
var conditionalsActiveCategoryId="none";

var categoryNames=new Array(); //Array of info about the categories (currently only their full names)  format is [cat_id]=name
var categoryFields=new Array(); //Array of fields ids for each cat.  This is a convenience array.  format is [cat_id]=fieldid

var stepNumber=1; //The currently active step in the DQ process (1-4)

var cachedCategories=new Array();  //Whether the category is cached or not.   [id]=true/false

var fieldData=new Array();  //The field information, loaded by remote.  [id]=[id, name, description, cat_id, type, [values]]

var selectedFields = new Array();  //The array of fields the user has selected.  [id]=true/false;

var currentMode = "Basic"; // either Basic or Advanced

//INITIALIZATION  ---------------------------------------------------------
//Initialize function for the page run on body load.
function initialize(){
    initializeRemotingIFrame();
    sendRemoteDataQuery("query_gui_data_loader.php?mode=categories");

    sendRemoteDataQuery("query_gui_data_loader.php?mode=listQueries");
}



//REMOTING FUNCTIONS ---------------------------------------------------------
//initializeRemotingIFrame creates the iframe used for remoting.  most of it is just finagling the differences between browsers.  This code
//was lifted from an O'reilly example and hacked up to suit our purposes.
function initializeRemotingIFrame() {
    if (!IFrameObj && document.createElement) {
        // create the IFrame and assign a reference to the
        // object to our global variable IFrameObj.
        var tempIFrame=document.createElement('iframe');
        tempIFrame.setAttribute('id','RSIFrame');
        tempIFrame.style.border='0px';
        tempIFrame.style.width='0px';
        tempIFrame.style.height='0px';
        IFrameObj = document.body.appendChild(tempIFrame);
    }
    setTimeout("initializeRemotingFrameVariables()",10);
}

function initializeRemotingFrameVariables(){
    if(document.frames){ //IE
        IFrameDoc=document.frames("RSIFrame").document;
    } else {//Mozilla
        IFrameDoc=document.getElementById("RSIFrame").contentDocument;
    }
}
//If the IFrame is ready, send the request directly, otherwise push it onto the remoting queue to be run when the iframe is available.
function sendRemoteDataQuery(URL){
    if(!IFrameReady){
        remotingQueue.push(URL);
    } else {
        IFrameReady=false;
        IFrameObj.src=URL;
    }
}

//If there are requests waiting in the queue, process the next one, otherwise do nothing.
function processRemotingQueue(){
    if(remotingQueue.length>0){
        IFrameReady=false;
        IFrameObj.src=remotingQueue.pop();
    }
}

//Called by remoting frame to indicate it has processed the request and submitted any data to the relevant target.
function loadComplete(){
    IFrameReady=true;
    initializeRemotingFrameVariables();
    processRemotingQueue();
}

//STEP CHANGING FUNCTIONS ---------------------------------------------------------
//Changes the currently active step to the next one.
function goNextStep(){
	if(currentMode=="Advanced" && stepNumber==1) {
		setStepDiv(stepNumber+1);
	} else {
	   setStepDiv(stepNumber+2);
	}
}

//Changes the currently active step to the previous one.
function goPreviousStep(){
	var oToggleModeText=document.getElementById('toggleModeText');

	if(currentMode=="Advanced" && stepNumber==3) {
		setStepDiv(stepNumber-1);
	} else {
	   setStepDiv(stepNumber-2);
	}
}

function toggleMode() {
	setStepDiv(1);

	var oStep2Title=document.getElementById('step2Title');
	var oToggleModeText=document.getElementById('toggleModeText');

	if(currentMode=="Basic") {
		oStep2Title.style.display="";
		oToggleModeText.innerHTML="Basic Mode";
		currentMode="Advanced";
   } else {
		oStep2Title.style.display="none";
		oToggleModeText.innerHTML="Advanced Mode";
		currentMode="Basic";
	}

}

//Sets which step is active by hiding/showing the appropriate step divs
function setStepDiv(newStep){
    //show/hide the approriate steps.
    for(var i=1; i<5;i++){
        var oStepDiv=document.getElementById('step'+i+'Div');
        var oStepTitle=document.getElementById('step'+i+'Title');
        if(i==newStep){
            oStepDiv.style.display="block";
            oStepTitle.style.fontWeight="bold";
        } else {
            oStepDiv.style.display="none";
            oStepTitle.style.fontWeight="normal";
        }
    }

    //record the new step
    stepNumber=newStep;
}

//MISC FUNCTIONS ---------------------------------------------------------

function getActiveCategoryId(type){
    if(type=="fields"){
        return fieldsActiveCategoryId;
    } else {
        return conditionalsActiveCategoryId;
    }
}

function setActiveCategoryId(type, categoryId){
    if(type=="fields"){
        fieldsActiveCategoryId=categoryId;
    } else {
        conditionalsActiveCategoryId=categoryId;
    }
}

//Merge two arrays, overwriting existing keys/values in the first with those of the second.
function mergeArrays(array1, array2){
    for(var i in array2){
        array1[i]=array2[i];
    }
    return array1;
}

//removeObject deletes a child with the specified id.
function removeObject(id){
    oitem=document.getElementById(id);
    oitem.parentNode.removeChild(oitem);
}


//getFirstTagNodeByType grabs the first node found on a horizontal branch that is not a garbage node created by mozilla and is of the correct tag type
function getFirstTagNodeByType(node, tagType){
    while(node.nodeType!=1 || node.tagName!=tagType){
        node=node.nextSibling;
    }
    return node;
}


function countAA(array){
   var i=0;
    for(var item in array){
        i++;
   }
   return i;
}

function getElementByIndex(array, index){
 var i=0;
    for(var item in array){
        if(i==index){
            return array[item];
        }
        i++;
   }
}

function addNewElement(tag, name, inputType){
        var aUnclosedTags=new Array();
        aUnclosedTags['INPUT']=true;
        aUnclosedTags['input']=true;
    if(window.navigator.appName=="Microsoft Internet Explorer"){
        var tagName="<"+tag;
        if(inputType){
            tagName+=" TYPE='"+inputType+"'";
        }
        if(name){
            tagName+=" NAME='"+name+"'";
        }
        tagName+=">";
        if(!aUnclosedTags[tag]){
            tagName+="</"+tag+">";
        }
        var oElement=document.createElement(tagName);
        if(!oElement.name){
            oElement.name=name;
        }
    } else {
        var oElement=document.createElement(tag);
        if(inputType){
            oElement.type=inputType;
        }
        if(name){
            oElement.name=name;
        }
    }
    return oElement;
}

function getEventTarget(mozTarget, ieTarget){
    if(mozTarget){
        return mozTarget;
    } else {
        return ieTarget;
    }
}