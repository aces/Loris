{literal}
<script language="javascript" type="text/javascript">
<!--

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
var appletCode = "<applet height=50 width=100 codebase=\"/mri/jiv\" archive=\"jiv.jar\" code=\"jiv/Main.class\" name=\"jiv_mri\">\n" + 
    "<param name=\"inline_config\" value=\"# ;\n" + 
    "jiv.download : upfront ;\n";

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
//-->
</script>
{/literal}    

<!-- listing of files -->
<!-- table with candidate profile info -->
<table><tr>
{literal}<!--script>document.write('<a href="BrainBrowser/display.html?sessionID='+sID+'" id = "dccid" name = "dccid">&nbsp;3D Viewer</a>');</script-->{/literal}
<!--<a href="BrainBrowser/display.html?dccid={$subject.candid}" id = "dccid" name  = "dccid" value = "{$subject.dccid}" onclick = "getValue(this)">&nbsp;3D Viewer</a>-->
{if $show3DViewer}

<td nowrap="nowrap"><input type="button" name="button" value="3D Viewer" class="button" id = "dccid" name = "dccid" style = "background-color: #816e91" onclick="window.open('BrainBrowser/display.html?sessionID={$subject.sessionID}')" /></td>

</br>
{/if}
</tr>
    <td>
    <table class="fancytableleft" cellpadding="2">
        <tr>
            <th nowrap="nowrap">QC Status</th>
            <td nowrap="nowrap">{$subject.mriqcstatus}</td>
            <th nowrap="nowrap">PSCID</th><td nowrap="nowrap">{$subject.pscid}</td>
            <th nowrap="nowrap">Site</th><td nowrap="nowrap">{$subject.site}</td>
        </tr>
        <tr>
        <th nowrap="nowrap">QC Pending</th>
            <td nowrap="nowrap">
                    {if $subject.mriqcpending=="Y"}<img src="images/check_blue.gif" width="12" height="12">{else}&nbsp;{/if}
            </td>
            <th nowrap="nowrap">DCCID</th><td nowrap="nowrap">{$subject.candid}</td>
            <th nowrap="nowrap">Visit Label</th><td nowrap="nowrap">{$subject.visitLabel}</td>
        </tr>
            <th nowrap="nowrap">DOB</th><td nowrap="nowrap">{$subject.dob}</td><th nowrap="nowrap">Gender</th><td nowrap="nowrap">{$subject.gender}</td>
            <th nowrap="nowrap">Output Type</th><td nowrap="nowrap">{$outputType}</td>
        </tr>
        <tr>
            <th nowrap="nowrap">Scanner</th><td nowrap="nowrap">{$subject.scanner}</td>
            <th nowrap="nowrap">Subproject</th><td nowrap="nowrap">{$subject.SubprojectTitle}</td>
            <th nowrap="nowrap">EDC</th><td nowrap="nowrap">{$subject.edc}</td>
        </tr>
    </table>
</td>
<td>
    <table>
        <tr><td>{if $numFiles}{$numFiles} file(s) displayed.</td></tr>
        <tr><td><div id="jivApplet">&nbsp;</div></td></tr>
    </table>
</td>
</tr>
</table>

{* show the files *}
<table border="0" cellspacing="0" cellpadding="0" width="80%">
    {section loop=$files name=fIdx}
    {cycle values="#eeeeee,#d0d0d0" assign="rowBgColor"}
    <tr bgcolor="{$rowBgColor}">
        <td align="center">
        <table class="std">
{* checked boxes can be viewed with Alt + d *}
        <tr><td>Add panel<input class="mripanel" data-file-id="{$files[fIdx].fileID}" type="checkbox" onClick="javascript:toggle_jiv_panel('{$files[fIdx].jivFilename}', '{$files[fIdx].jivAddress}');"></td></tr>

{* SELECTED DROPDOWN only for native images*}
{if $files[fIdx].outputType == "native"} 
            <tr><th>Selected</th></tr>
            <tr><td> 
            {if $has_permission}
                {html_options options=$selected_options selected=$files[fIdx].selected tabindex=3  name=selectedvol[`$files[fIdx].fileID`]}
            {else}
                {if $files[fIdx].selected != ""}{$files[fIdx].selected}{else}&nbsp;{/if}
            {/if}
            </td></tr>
{/if}
        
{* QC STATUS DROPDOWN *}
            <tr><th>QC Status</th></tr>
            <tr><td>
            {if $has_permission}
                {if $files[fIdx].new}<font color="red">NEW</font> {/if}
                {html_options options=$status_options selected=$files[fIdx].qcStatus  tabindex=4 name=status[`$files[fIdx].fileID`]}
            {else}
                {if $files[fIdx].qcStatus != ""}{$files[fIdx].qcStatus}{else}&nbsp;{/if}
            {/if}
            </td></tr>
            <tr><td>&nbsp;</td></tr>
{* LINK TO COMMENTS *}
            <tr><td>
            {if $files[fIdx].fileID}<a href="#{$smarty.section.fIdx.index}" 
            onClick='javascript:window.open("feedback_mri_popup.php?fileID={$files[fIdx].fileID}", "feedback_mri", 
            "width=500,height=800,toolbar=no,location=no,status=yes,scrollbars=yes,resizable=yes")'>Link to comments</a><br>{else}&nbsp;{/if}
            </td></tr>
        </table>
        </td>
{* ----------------- This is the end of the first section ---------------- *}    

        <td><a name="{$smarty.section.fIdx.index}"><table class="fancytableleft" border="1">
            <tr>
                <th>Filename</th>
                <td> {if $files[fIdx].filename != ""}{$files[fIdx].filename}{else}&nbsp;{/if}</td>
                <td {if $files[fIdx].qcStatus != ""}class="image{$files[fIdx].qcStatus}{/if}">{$files[fIdx].qcStatus}</td>
            </tr>
            
{* IMG *}


            <tr>
                <td colspan="3">
            	<a href="#{$smarty.section.fIdx.index}" onClick="window.open('minc.html?minc_id={$files[fIdx].fileID}', 'BrainBrowser Volume Viewer', 'location = 0,width = auto, height = auto')">
               	<img src="{$files[fIdx].checkpicFilename}" height="180" border="0">
            	</a>
            	</td>
            </tr>
            <tr>
            	<th>Voxel size</th>
                <td colspan="2">{if $files[fIdx].xstep != "" and $files[fIdx].ystep != ""}X: {$files[fIdx].xstep} mm Y: {$files[fIdx].ystep} mm Z: {$files[fIdx].zstep} mm
                    {elseif $files[fIdx].xstep != ""}{$files[fIdx].xstep}{else}&nbsp;{/if}
                </td>
            </tr>
            {if $files[fIdx].fileID}
	   		<tr>
                <td><a href="#{$smarty.section.fIdx.index}" onClick='javascript:show_jiv(new Array("{$files[fIdx].jivFilename}"), new Array("{$files[fIdx].jivAddress}"), false)' accesskey="{$smarty.section.fIdx.index}">JIV Viewer</a></td>
                <td>
            	<a href="#{$smarty.section.fIdx.index}" onClick="window.open('minc.html?minc_id={$files[fIdx].fileID}', 'BrainBrowser Volume Viewer', 'location = 0,width = auto, height = auto')">
                BrainBrowser Volume Viewer
                </a>
                </td>
                <td>
                    <a href="mri/jiv/get_file.php?file={$files[fIdx].fullFilename}">Download</a>
                </td>
       	  </td>
            </tr>
			{/if}
            </table>
        </td>

{* ----------------- This is the end of the second section ---------------- *}    

        <td><table width="300px" class="fancytableleft" border="1">
            {if $files[fIdx].Pipeline != ""}<tr><th width="100px">Pipeline</th><td>{$files[fIdx].Pipeline}{else}&nbsp;</td></tr>{/if}
            {if $files[fIdx].outputType != ""}<tr><th width="100px">Output Type</th><td>{$files[fIdx].outputType}{else}&nbsp;</td></tr>{/if}
            {if $files[fIdx].acquisitionProtocol != "NA"}<tr><th width="100px">Protocol</th><td>{$files[fIdx].acquisitionProtocol}{else}&nbsp;</td></tr>{/if}
            {if $files[fIdx].coordinateSpace != ""}<tr><th width="100px">Space</th><td>{$files[fIdx].coordinateSpace}{else}&nbsp;</td></tr>{/if}
            {if $files[fIdx].Algorithm != ""}<tr><th width="100px">Algorithm</th><td>{$files[fIdx].Algorithm}{else}&nbsp;</td></tr>{/if}

            {if $files[fIdx].acquisitionDate>0}<tr><th width="100px">Acq Date</th><td>{$files[fIdx].acquisitionDate|date_format}{else}&nbsp;</td></tr>{/if}
            <tr><th width="100px">Inserted</th><td>{if $files[fIdx].fileInsertDate>0}{$files[fIdx].fileInsertDate|date_format}{elseif $smarty.section.fIdx.index==0}Insert date{else}&nbsp;{/if}</td></tr>
                                                
            {if $files[fIdx].seriesDescription != ""}<tr><th width="100px">Ser Desc</th><td>{$files[fIdx].seriesDescription}{else}&nbsp;</td></tr>{/if}
            {if $files[fIdx].seriesNumber != ""}<tr><th width="100px">Ser Num</th><td>{$files[fIdx].seriesNumber}{else}&nbsp;</td></tr>{/if}
            {if $files[fIdx].echoTime != "" && $files[fIdx].echoTime != "0.00" }<tr><th width="100px">Echo Time</th><td>{$files[fIdx].echoTime} ms{else}&nbsp;</td></tr>{/if}
            {if $files[fIdx].repetitionTime != "" && $files[fIdx].repetitionTime != "0.00"}<tr><th width="100px">Rep Time</th><td>{$files[fIdx].repetitionTime} ms{else}&nbsp;</td></tr>{/if}
            {if $files[fIdx].sliceThickness != ""&& $files[fIdx].sliceThickness != "0.00"}<tr><th width="100px">Slice Thick</th><td>{$files[fIdx].sliceThickness} mm{else}&nbsp;</td></tr>{/if}
            {if $files[fIdx].time != ""&& $files[fIdx].time != "0.00"}<tr><th width="100px">Nb of vol.</th><td>{$files[fIdx].time} volumes{else}&nbsp;</td></tr>{/if}
            {if $files[fIdx].Comment != ""}<tr><th width="100px">Comment</th><td>{$files[fIdx].Comment}{else}&nbsp;</td></tr>{/if}  
            {if $files[fIdx].processingPipeline != ""}<tr><th width="100px">Processing pipeline</th><td>{$files[fIdx].processingPipeline}{else}&nbsp;</td></tr>{/if}
            {if $files[fIdx].totalRejected != ""}<tr><th width="100px">Nb of rejected directions</th><td>{$files[fIdx].totalRejected}{else}&nbsp;</td></tr>{/if}
            {if $files[fIdx].slicewiseRejected != ""}<tr><th width="100px">Slicewise correlations (Nb)</th><td>{$files[fIdx].slicewiseRejected}{else}&nbsp;</td></tr>{/if}
            {if $files[fIdx].interlaceRejected != ""}<tr><th width="100px">Interlace correlations (Nb)</th><td>{$files[fIdx].interlaceRejected}{else}&nbsp;</td></tr>{/if}
            {if $files[fIdx].intergradientRejected != ""}<tr><th width="100px">Gradient-wise correlations (Nb)</th><td>{$files[fIdx].intergradientRejected}{else}&nbsp;</td></tr>{/if}
            </table>
        </td>        
</tr>
{/section}
</table>
{else}
    <p>No data selected.</p>
{/if}
{if $has_permission}</form>{/if}
