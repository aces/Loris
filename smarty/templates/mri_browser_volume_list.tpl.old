{literal}
<script language="javascript" type="text/javascript">
<!--
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
var appletCode = "<applet height=50 width=200 codebase=\"/mri/jiv\" archive=\"jiv.jar\" code=\"jiv/Main.class\" name=\"jiv_mri\">\n" + 
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
{if $has_permission}<form action="" method="post">{/if}
<table><tr>
    <td>
    <table class="fancytableleft" cellpadding="2">
        <tr><th nowrap="nowrap">QC Status</th>
            <td nowrap="nowrap">
                {*if $has_permission}
                    {html_options options=$status_options selected=$subject.mriqcstatus name=visit_status tabindex=1> }
                {else *}
                    {$subject.mriqcstatus}
                {* /if *}
            </td>
            <th nowrap="nowrap">PSCID</th><td nowrap="nowrap">{$subject.pscid}</td>
            <th nowrap="nowrap">Site</th><td nowrap="nowrap">{$subject.site}</td>
        </tr>
        <tr><th nowrap="nowrap">QC Pending</th>
            <td nowrap="nowrap">
                {*if $has_permission}
                    {html_options options=$pending_options selected=$subject.mriqcpending name=visit_pending tabindex=2}
                {else*}
                    {if $subject.mriqcpending=="Y"}<img src="images/check_blue.gif" width="12" height="12">{else}&nbsp;{/if}
                {*/if*}
            </td>
            <th nowrap="nowrap">DCCID</th><td nowrap="nowrap">{$subject.candid}</td>
            <th nowrap="nowrap">Visit Label</th><td nowrap="nowrap">{$subject.visitLabel}</td>
        </tr>
        <tr>
        <tr>
            <th nowrap="nowrap">DOB</th><td nowrap="nowrap">{$subject.dob}</td>
            <th nowrap="nowrap">Gender</th><td nowrap="nowrap">{$subject.gender}</td>
            <th nowrap="nowrap">Output Type</th><td nowrap="nowrap">{$outputType}</td>
        </tr>

        <tr>
            <th nowrap="nowrap">Scanner</th><td nowrap="nowrap">{$subject.scanner}</td>
            <th nowrap="nowrap">Subproject</th><td nowrap="nowrap">{$subject.SubprojectTitle}</td>
            <th nowrap="nowrap">Current Stage</th><td nowrap="nowrap">{$subject.Current_stage}</td>
        </tr>
        <tr>
            <th>Mantis ID</th><td colspan="5">{$subject.pscid} {$subject.candid} {$subject.visitLabel}</td>
        </tr>
        <tr>
            <td colspan="5"><a href="#" onClick="javascript:window.open('feedback_mri_popup.php?sessionID={$subject.sessionID}', 'feedback_mri', 
            'width=500%,height=300,toolbar=no,location=no,status=yes,scrollbars=yes,resizable=yes')">Link to visit-level feedback</a></td>
            <td colspan="1">{if $has_permission}<input class="button" type="submit" accesskey="s" value="Save" name="save_changes"></td>{/if}
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


<input type="button" accesskey="c" class="button" value="3-D with combined" onClick="javascript:show_jiv(jivNames, jivData, true);"><br>
<input type="button" accesskey="d" class="button" value="3-D" onClick="javascript:show_jiv(jivNames, jivData, false);"><br>


{* show the files *}
<table border="0" cellspacing="0" cellpadding="0" width="80%">
    {section loop=$files name=fIdx}
    {cycle values="#eeeeee,#d0d0d0" assign="rowBgColor"}
    <tr bgcolor="{$rowBgColor}">
        <td align="center">
        <table class="std">
{* checked boxes can be viewed with Alt + d *}
        <tr><td>Add panel<input type="checkbox" onClick="javascript:toggle_jiv_panel('{$files[fIdx].jivFilename}', '{$files[fIdx].jivAddress}');">
        </td></tr>

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
            <tr><th>Caveat Emptor</th></tr>
            <tr><td>
            {if $has_permission}
                {if $files[fIdx].Caveat}
                <a href="main.php?test_name=mri_violations&SeriesUID={$files[fIdx].SeriesUID}&filter=true">Caveat List</a>
                {/if}
                {html_options options=$caveat_options selected=$files[fIdx].Caveat tabindex=5 name=caveat[`$files[fIdx].fileID`]}
            {else}
                {if $files[fIdx].Caveat}<a href="main.php?test_name=mri_violations&SeriesUID={$files[fIdx].SeriesUID}&filter=true">Caveats</a>
                {else}No caveats{/if}
                </a>
            {/if}
            </td></tr>

            <tr><td>&nbsp;</td></tr>
{* LINK TO COMMENTS *}
            <tr><td>
            {if $files[fIdx].fileID}<a href="#{$smarty.section.fIdx.index}" 
            onClick='javascript:window.open("feedback_mri_popup.php?fileID={$files[fIdx].fileID}", "feedback_mri", 
            "width=500%,height=800,toolbar=no,location=no,status=yes,scrollbars=yes,resizable=yes")'>Link to comments</a><br>{else}&nbsp;{/if}
            </td></tr>
        </table>
        </td>
{* ----------------- This is the end of the first section ---------------- *}    

        <td><a name="{$smarty.section.fIdx.index}"><table class="fancytableleft" border="1">
            <tr>
                <th>Filename</th><td>{if $files[fIdx].filename != ""}{$files[fIdx].filename}{else}&nbsp;{/if}</td>
            </tr>
            
{* IMG *}
            <tr><td colspan="2">
{* This was the old way with an additional popup window 
            <a href="#{$smarty.section.fIdx.index}" accesskey="{$smarty.section.fIdx.index}" 
            onClick='javascript:window.open("mri/jiv/show_one_jiv_file.php?jiv[name][]={$files[fIdx].jivFilename}&jiv[data][]={$files[fIdx].jivAddress}", "mri_jiv", 
            "width=415, height=55, toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no")'>
*}
            <a href="#{$smarty.section.fIdx.index}" onClick='javascript:show_jiv(new Array("{$files[fIdx].jivFilename}"), new Array("{$files[fIdx].jivAddress}"), false)' accesskey="{$smarty.section.fIdx.index}">
            <img src="{$files[fIdx].checkpicFilename}" height="180" border="0">
            </a>
            </td></tr>
            <tr><th>Voxel size</th>
                    <td>{if $files[fIdx].xstep != "" and $files[fIdx].ystep != ""}X: {$files[fIdx].xstep} mm Y: {$files[fIdx].ystep} mm Z: {$files[fIdx].zstep} mm
                    {elseif $files[fIdx].xstep != ""}{$files[fIdx].xstep}{else}&nbsp;{/if}
                    </td>
            </tr>
            <tr>
                {if $files[fIdx].fileID}
                <td><a href='minc.html?minc_id={$files[fIdx].fileID}' target="_blank"> Link to Brain Browser </a></td>
                {/if}
            </tr>

            </table>
        </td>

{* ----------------- This is the end of the second section ---------------- *}    

        <td><table class="fancytableleft" border="1">

            <tr><th>Protocol</th><td>{if $files[fIdx].acquisitionProtocol != ""}{$files[fIdx].acquisitionProtocol}{else}&nbsp;{/if}</td></tr>
            <tr><th>Space</th><td>{if $files[fIdx].coordinateSpace != ""}{$files[fIdx].coordinateSpace}{else}&nbsp;{/if}</td></tr>
            <tr><th>Cls Alg</th><td>{if $files[fIdx].classifyAlgorithm != ""}{$files[fIdx].classifyAlgorithm}{else}&nbsp;{/if}</td></tr>

            <tr><th>Acq Date</th><td>{if $files[fIdx].acquisitionDate>0}{$files[fIdx].acquisitionDate|date_format}{elseif $smarty.section.fIdx.index==0}Acquisition date{else}&nbsp;{/if}</td></tr>
            <tr><th>Inserted</th><td>{if $files[fIdx].fileInsertDate>0}{$files[fIdx].fileInsertDate|date_format}{elseif $smarty.section.fIdx.index==0}Insert date{else}&nbsp;{/if}</td></tr>
                                                
            <tr><th>Ser Desc</th><td>{if $files[fIdx].seriesDescription != ""}{$files[fIdx].seriesDescription}{else}&nbsp;{/if}</td></tr>
            <tr><th>Ser Num</th><td>{if $files[fIdx].seriesNumber != ""}{$files[fIdx].seriesNumber}{else}&nbsp;{/if}</td></tr>
            <tr><th>Echo Time</th><td>{if $files[fIdx].echoTime != ""}{$files[fIdx].echoTime} ms{else}&nbsp;{/if}</td></tr>
            <tr><th>Rep Time</th><td>{if $files[fIdx].repetitionTime != ""}{$files[fIdx].repetitionTime} ms{else}&nbsp;{/if}</td></tr>
            <tr><th>Slice Thick</th><td>{if $files[fIdx].sliceThickness != ""}{$files[fIdx].sliceThickness} mm{else}&nbsp;{/if}</td></tr>
            
            </table>
        </td>        
</tr>
{/section}
</table>
{else}
    <p>No data selected.</p>
{/if}
{if $has_permission}</form>{/if}
