<!-- Main table -->
<script src="GetJS.php?Module=imaging_browser&file=imagingbrowser.js"></script>
{* Olga: show3DViewer not tested *}
{if $show3DViewer}
{*<td nowrap="nowrap">the first opening td already opened in main.tpl *}<input type="button" name="button" value="3D Viewer" class="button" id = "dccid" name = "dccid" style = "background-color: #816e91" onclick="window.open('BrainBrowser/display.html?sessionID={$subject.sessionID}')" /></td>

</br>
{/if}
</tr>

<tr>
    <td>
    <div class="row">
    {$headerTable}
    </div>
    <table class='table-header-right'>
	<tr><td>{if $files|@count}{$files|@count} file(s) displayed.</td></tr>
        <tr><td><div id="jivApplet">&nbsp;</div></td></tr>
    </table>
    </td>
</tr>
</table>
{* MAIN MRI TABLE *}
<table class='table-mri'>
{section name=file loop=$files}
<tr>
    <td class='td-mri-lefttable'>
{* LEFT SUBTABLE (SELECTIONS) *}
        <table class='table-mri-lefttable'>
    	<tr>
	    <td class='td-mri-lefttable-select'>Add panel<input class='mripanel' data-file-id='{$files[file].FileID}' type='checkbox' onClick="javascript:toggle_jiv_panel('{$files[file].JivFilename}', '{$files[file].JivAddress}');"></td>
    	</tr>
{* SELECTED DROPDOWN only for native images *}
{if $files[file].OutputType == "native"}
    	<tr>
	    <th>Selected</th>
    	</tr>
    	<tr>
	    <td id='td-mri-lefttable-select'>
	    {if $has_permission}
	    {html_options options=$selected_options selected=$files[file].Selected tabindex="3" name="selectedvol[`$files[file].FileID`]"}
	    {else}
		{if $files[file].Selected != ""}{$files[file].Selected}
		{else}&nbsp;{/if}
            {/if}   
	    </td>
        </tr>
{/if}
{* QC STATUS DROPDOWN *}
        <tr>
            <th>QC Status</th>
        </tr>
        <tr>
	    <td id='td-mri-lefttable-select'>
	    {if $has_permission}	
	        {if $files[file].New}<font color='red'>NEW</font>{/if}
		{html_options options=$status_options selected=$files[file].QCStatus tabindex="4" name="status[`$files[file].FileID`]"}
	    {else}
		{if $files[file].QCStatus != ""}{$files[file].QCStatus}
		{else}&nbsp;{/if}
	    {/if}
	    </td>
        </tr>
	{if $files[file].FileID} 
            <tr><th>Caveat Emptor</th></tr>
            <tr><td id='td-mri-lefttable-select'>
            {if $has_permission}
                {if $files[file].Caveat}
                <a href="main.php?test_name=mri_protocol_check_violations&SeriesUID={$files[file].SeriesUID}&filter=true">Caveat List</a>
                {/if}
                {html_options options=$caveat_options selected=$files[file].Caveat tabindex="5" name="caveat[`$files[file].FileID`]"}
                {else}
                {if $files[file].Caveat}<a href="main.php?test_name=mri_protocol_check_violations&SeriesUID={$files[file].SeriesUID}&filter=true">Caveats</a>
                {else}No caveats{/if}
                {/if}
                </td></tr>
            {/if}
{* LINK TO COMMENTS *}
        <tr>
            <td>{if $files[file].FileID}<a 
 onClick='window.open("feedback_mri_popup.php?fileID={$files[file].FileID}", "feedback_mri","width=500,height=800,toolbar=no,location=no,status=yes,scrollbars=yes,resizable=yes")'>Link to comments</a><br>{else}&nbsp;{/if}
            </td>
        </tr>
    </table>  
    </td>
{* MIDDLE TABLE (PICS) *}
    <td><a name="{$smarty.section.file.index}">
        <table class="table-mri-right-and-center">
            <thead>
                <tr>
                    <th>Filename</th>
                    <td colspan='2'>{if $files[file].Filename != ""}{$files[file].Filename}
		    	{else}&nbsp;{/if}</td>
		    <td{if $files[file].QCStatus != ""} class="image{$files[file].QCStatus}"{/if}>{$files[file].QCStatus}</td>
                </tr>
{* IMG *}
            </thead>
            <tbody>
                <tr>
                    <td colspan="4">
		    <a href="#noID" onClick="window.open('minc.html?minc_id={$files[file].FileID}', 'BrainBrowser Volume Viewer', 'location = 0,width = auto, height = auto')">
                    <img class='img-checkpic' src="{$files[file].CheckPic}">
                    </a>
                    </td>
                </tr>
            </tbody>
            <tfoot> 
                <tr>
                    <th>Voxel size</th>
                    <td colspan="3">
		    {if $files[file].Xstep != "" and $files[file].Ystep != ""}X: {$files[file].Xstep} mm Y: {$files[file].Ystep} mm Z: {$files[file].Zstep} mm
                    {elseif $files[file].Xstep != ""}{$files[file].Xstep}{else}&nbsp;{/if}
                    </td>
                </tr>
                {if $files[file].SourceFile != ''}
                <tr>
                    <th>Source file</th>
                    <td colspan='3'>{$files[file].SourceFile}</td>
                </tr>
                {/if}
                {if $files[file].Tool != ""}
                <tr>
                     <th>Pipeline info</th>
                     <td> {if $files[file].ProcessingPipeline != ""}{$files[file].ProcessingPipeline}{else}&nbsp;{/if}</td>
                     <td> Version: {$files[file].Tool}</td>
                     <td> {if $files[file].ProcDate > 0}Proc. Date: {$files[file].procDate|date_format}{else}&nbsp;{/if}</td>
                </tr>
                {/if}        
                {if $files[file].ProcessingPipeline eq "DTIPrepPipeline"}
                <tr>
                     <th>DTIPrep files</th>
                     <td> {if $files[file].XMLprotocol != ""}<a href="mri/jiv/get_file.php?file={$files[file].XMLprotocol}">Download XML Protocol</a>{else}&nbsp;{/if}</td>
                     <td> {if $files[file].XMLreport != ""}<a href="mri/jiv/get_file.php?file={$files[file].XMLreport}">Download XML Report</a>{else}&nbsp;{/if}</td>
                     <td> {if $files[file].NrrdFile != ""}<a href="mri/jiv/get_file.php?file={$files[file].NrrdFile}">Download NRRD</a>{else}&nbsp;{/if}</td>
                </tr>
                {/if} 
		{if $files[file].FileID}
                <tr>
                    <td>
                        <a href="#noID" onClick='javascript:show_jiv(new Array("{$files[file].JivFilename}"), new Array("{$files[file].JivAddress}"), false)' accesskey="{$smarty.section.file.index}">JIV Viewer</a>
                    </td>
                    <td colspan='2'>
                        <a href="#noID" onClick="window.open('minc.html?minc_id={$files[file].FileID}', 'BrainBrowser Volume Viewer', 'location=0,width=auto,height=auto')">BrainBrowser Volume Viewer</a>
                    </td>
                    <td>
                        <a href="mri/jiv/get_file.php?file={$files[file].FullFilename}">Download MINC</a>
		    </td>
                </tr>{/if}
            </tfoot> 
	</table></a>
    </td>
{* RIGHT SUBTABLE*}
    <td>
        <table class="table-mri-right-and-center" id='table-mri-righttable'>
        {if $files[file].Pipeline != ""}<tr><th>Pipeline</th><td>{$files[file].Pipeline}</td></tr>{/if}
        {if $files[file].OutputType != ""}<tr><th>Output Type</th><td>{$files[file].OutputType}</td></tr>{/if}
        {if $files[file].AcquisitionProtocol != "NA"}<tr><th>Protocol</th><td>{$files[file].AcquisitionProtocol}</td></tr>{/if}
        {if $files[file].CoordinateSpace != ""}<tr><th>Space</th><td>{$files[file].CoordinateSpace}</td></tr>{/if}
        {if $files[file].Algorithm != ""}<tr><th>Algorithm</th><td>{$files[file].Algorithm}</td></tr>{/if}

        {if $files[file].AcquisitionDate>0}<tr><th>Acq Date</th><td>{$files[file].AcquisitionDate|date_format}</td></tr>{/if}
        <tr><th>Inserted</th><td>{if $files[file].FileInsertDate>0}{$files[file].FileInsertDate|date_format}{elseif $smarty.section.file.index==0}Insert date{else}&nbsp;{/if}</td></tr>
 
        {if $files[file].SeriesDescription != ""}<tr><th>SerDesc</th><td>{$files[file].SeriesDescription}</td></tr>{/if}
        {if $files[file].SeriesNumber != ""}<tr><th>Ser Num</th><td>{$files[file].SeriesNumber}</td></tr>{/if}
        {if $files[file].EchoTime != "" && $files[file].EchoTime != "0.00"}<tr><th>Echo Time</th><td>{$files[file].EchoTime} ms</td></tr>{/if}
        {if $files[file].RepetitionTime != "" && $files[file].RepetitionTime != "0.00"}<tr><th>Rep Time</th><td>{$files[file].RepetitionTime} ms</td></tr>{/if}
        {if $files[file].SliceThickness != ""&& $files[file].SliceThickness != "0.00"}<tr><th>Slice Thick</th><td>{$files[file].SliceThickness} mm</td></tr>{/if}
        {if $files[file].Time != "" && $files[file].Time != "0.00"}<tr><th>Nb of vol.</th><td>{$files[file].Time} volumes</td></tr>{/if}
        {if $files[file].Comment != ""}<tr><th>Comment</th><td>{$files[file].Comment}</td></tr>{/if}
        {if $files[file].SlicewiseRejected != ""}<tr><th>Slicewise correlations (Nb)</th><td>{$files[file].SlicewiseRejected}</td></tr>{/if}
        {if $files[file].InterlaceRejected != ""}<tr><th>Interlace correlations (Nb)</th><td>{$files[file].InterlaceRejected}</td></tr>{/if}
        {if $files[file].IntergradientRejected != ""}<tr><th>Gradient-wise correlations (Nb)</th><td>{$files[file].IntergradientRejected}</td></tr>{/if}
        {if $files[file].TotalRejected != ""}<tr><th width="100px">Nb of rejected directions</th><td>{$files[file].TotalRejected}{else}&nbsp;</td></tr>{/if}
       	</table>
    </td>
</tr>
{/section}
</table>
{else}
    <p>No data selected</p>
{/if}
{if $has_permission}</form>{/if} 
