<!-- selection filter -->
<form>
    <table class="std">
    <tr>    
        <th colspan="6">Selection Filter</th>
    </tr>
    <tr>
        <th>Site</th><td>{html_options options=$site_options selected=$filter.site name=filter[site]}</td>
	    <th>PatientID</th><td><input type='text' name='filter[patientID]' value='{$filter.patientID}' size="20"></td>
	    <td><input class="button" type="submit"></td>
    </tr>
    </table>
</form>

<!-- listing of archives -->
{if $numArchives}
	{$numArchives} study dicom archive(s) selected.<br><br>
{/if}

<table class="fancytable" width="90%">
<tr>
{if $showTransferStatus == 1}
    <th>Transfer Status</th>
{/if}
	<th>Patient ID</th>
	<th>Patient Name</th>
	<th>Gender</th>
	<th>Date of birth</th>
	<th>Acquisition</th>
	<th>Metadata</th>
	<th>MRI Browser</th>
</tr>
{section name=archiveIdx loop=$archives}
<tr>
{if $showTransferStatus == 1}
	<td class="{$archives[archiveIdx].transferStatusClass}">{$archives[archiveIdx].TransferStatus}</td>
{/if}
	<td{if $archives[archiveIdx].patientIDValid == 0} class="error"{/if}>{$archives[archiveIdx].PatientID}</td>
	<td{if $archives[archiveIdx].patientNameValid == 0} class="error"{/if}>{$archives[archiveIdx].PatientName}</td>
	<td>{if $archives[archiveIdx].PatientGender != "M" && $archives[archiveIdx].PatientGender != "F" }N/A{else}{$archives[archiveIdx].PatientGender}{/if}</td>
	<td>{$archives[archiveIdx].PatientDoB}</td>
	<td>{$archives[archiveIdx].DateAcquired}</td>
	<td><a href="dicom_archive.php?TarchiveID={$archives[archiveIdx].TarchiveID}&backURL={$backURL|escape:"url"}">View Details</a></td>
	<td>{if $archives[archiveIdx].SessionID != ""}<a href="mri_browser.php?sessionID={$archives[archiveIdx].SessionID}&outputType=native&backURL={$backURL|escape:"url"}">View Images</a>{else}&nbsp;{/if}</td>
</tr>
    {sectionelse}
<tr>
        <td colspan="12">No data selected</td>
</tr>
    {/section}
</table>

