<!-- listing of files -->
<!-- table with candidate profile info -->
{if $has_permission}<form action="" method="post">{/if}
<table class="list" cellpadding="2">
    <tr>
        <th nowrap="nowrap">Site</th>
        <th nowrap="nowrap">DCCID</th>
        <th nowrap="nowrap">PSCID</th>
        <th nowrap="nowrap">Visit Label</th>
        <th nowrap="nowrap">DOB</th>
        <th nowrap="nowrap">EDC</th>
        <th nowrap="nowrap">Gender</th>
        <th nowrap="nowrap">Subproject</th>
        <th nowrap="nowrap">QC Status</th>
        <th nowrap="nowrap">QC Pending</th>
        <th nowrap="nowrap">Scanner</th>
        <th nowrap="nowrap">Output Type</th>
    </tr>
    <tr>
        <td nowrap="nowrap">{$subject.site}</td>
        <td nowrap="nowrap">{$subject.candid}</td>
        <td nowrap="nowrap">{$subject.pscid}</td>
        <td nowrap="nowrap">{$subject.visitLabel}</td>
        <td nowrap="nowrap">{$subject.dob}</td>
        <td nowrap="nowrap">{$subject.edc}</td>
        <td nowrap="nowrap">{$subject.gender}</td>
        <td nowrap="nowrap">{$subject.SubprojectTitle}</td>
        <td nowrap="nowrap">
            {if $has_permission}
                {html_options options=$status_options selected=$subject.mriqcstatus name=visit_status}
            {else}
                {$subject.mriqcstatus}
            {/if}
        </td>
        <td nowrap="nowrap">
            {if $has_permission}
                {html_options options=$pending_options selected=$subject.mriqcpending name=visit_pending}
            {else}
                {if $subject.mriqcpending=="Y"}<img src="images/check_blue.gif" width="12" height="12">{else}&nbsp;{/if}
            {/if}
            </td>
        <td nowrap="nowrap">{$subject.scanner}</td>
        <td nowrap="nowrap">{$outputType}</td>
    </tr>
</table>
{if $has_permission}<input type="submit" value="Save" name="save_changes">{/if}

<p><a href="#" onClick="javascript:window.open('feedback_mri_popup.php?sessionID={$subject.sessionID}', 'feedback_mri', 'width=800%,height=400,toolbar=no,location=no,status=yes,scrollbars=yes,resizable=yes')">Link to visit-level feedback</a></p>

{* show the files *}

{if $numFiles}
    <p>{$numFiles} file(s) displayed.</p>

    <table class="something" border="1">
    <tr>
        {section loop=$files name=fIdx}
            <td>{if $files[fIdx].fileID}<a name="{$smarty.section.fIdx.index}"><a href="#{$smarty.section.fIdx.index}" onClick='javascript:window.open("feedback_mri_popup.php?fileID={$files[fIdx].fileID}", "feedback_mri", "width=800%,height=400,toolbar=no,location=no,status=yes,scrollbars=yes,resizable=yes")'>Link to comments</a>{else}&nbsp;{/if}</td>
        {/section}</tr><tr>
        {section loop=$files name=fIdx}
            <td>{if $files[fIdx].acquisitionProtocol != ""}{$files[fIdx].acquisitionProtocol}{else}&nbsp;{/if}</td>
        {/section}</tr><tr>
        {section loop=$files name=fIdx}
            <td>{if $files[fIdx].coordinateSpace != ""}{$files[fIdx].coordinateSpace}{else}&nbsp;{/if}</td>
        {/section}</tr><tr>
        {section loop=$files name=fIdx}
            <td>{if $files[fIdx].classifyAlgorithm != ""}{$files[fIdx].classifyAlgorithm}{else}&nbsp;{/if}</td>
        {/section}</tr><tr>
        {section loop=$files name=fIdx}
            <td>
            {if $smarty.section.fIdx.index==0}
                Selected
            {else}
                {if $has_permission}
                    {html_options options=$selected_options selected=$files[fIdx].selected name=selectedvol[`$files[fIdx].fileID`]}
                {else}
                    {if $files[fIdx].selected != ""}Selected {$files[fIdx].selected}{else}&nbsp;{/if}
                {/if}
            {/if}
            </td>
        {/section}</tr><tr>
        {section loop=$files name=fIdx}
            <td>
            {if $smarty.section.fIdx.index==0}
                QC Status
            {else}
                {if $has_permission}
                    {if $files[fIdx].new and $smarty.section.fIdx.index>0}<font color="red">NEW</font> {/if}
                    {html_options options=$status_options selected=$files[fIdx].qcStatus name=status[`$files[fIdx].fileID`]}
                {else}
                    {if $files[fIdx].qcStatus != ""}{$files[fIdx].qcStatus}{else}&nbsp;{/if}
                {/if}
            {/if}
            </td>
        {/section}</tr><tr>
        {section loop=$files name=fIdx}
            <td>
            {if $smarty.section.fIdx.index>0}
                <a href="#{$smarty.section.fIdx.index}" onClick='javascript:window.open("http://nihpdjiv.bic.mni.mcgill.ca/show_one_jiv_file.php?jiv[name][]={$files[fIdx].jivFilename}&jiv[data][]={$files[fIdx].jivAddress}", "mri_jiv", "width=415, height=55, toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no")'>
                    <img src="{$files[fIdx].checkpicFilename}" width="256" height="762" border="0">
                </a>
            {else}
                &nbsp;
            {/if}
            </td>
        {/section}</tr><tr>
        {section loop=$files name=fIdx}
            <td>{if $files[fIdx].acquisitionDate>0}{$files[fIdx].acquisitionDate|date_format}{elseif $smarty.section.fIdx.index==0}Acquisition date{else}&nbsp;{/if}</td>
        {/section}</tr><tr>
        {section loop=$files name=fIdx}
            <td>{if $files[fIdx].fileInsertDate>0}{$files[fIdx].fileInsertDate|date_format}{elseif $smarty.section.fIdx.index==0}Insert date{else}&nbsp;{/if}</td>
        {/section}</tr><tr>
        {section loop=$files name=fIdx}
            <td>{if $files[fIdx].filename != ""}{$files[fIdx].filename}{else}&nbsp;{/if}</td>
        {/section}</tr><tr>
        {section loop=$files name=fIdx}
            <td>{if $files[fIdx].seriesDescription != ""}{$files[fIdx].seriesDescription}{else}&nbsp;{/if}</td>
        {/section}</tr><tr>
        {section loop=$files name=fIdx}
            <td>{if $files[fIdx].seriesNumber != ""}{$files[fIdx].seriesNumber}{else}&nbsp;{/if}</td>
        {/section}</tr><tr>
        {section loop=$files name=fIdx}
            <td>{if $files[fIdx].echoTime != ""}{$files[fIdx].echoTime} ms{else}&nbsp;{/if}</td>
        {/section}</tr><tr>
        {section loop=$files name=fIdx}
            <td>{if $files[fIdx].repetitionTime != ""}{$files[fIdx].repetitionTime} ms{else}&nbsp;{/if}</td>
        {/section}</tr><tr>
        {section loop=$files name=fIdx}
            <td>{if $files[fIdx].sliceThickness != ""}{$files[fIdx].sliceThickness} mm{else}&nbsp;{/if}</td>
        {/section}</tr><tr>
        {section loop=$files name=fIdx}
            <td>{if $files[fIdx].xstep != "" and $files[fIdx].ystep != ""}X: {$files[fIdx].xstep} mm Y: {$files[fIdx].ystep} mm Z: {$files[fIdx].zstep} mm{elseif $files[fIdx].xstep != ""}{$files[fIdx].xstep}{else}&nbsp;{/if}</td>
        {/section}
    </tr></table>
{else}
    <p>No data selected.</p>
{/if}

{if $has_permission}</form>{/if}