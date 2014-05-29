<!-- selection filter -->
<form>
    <table class="std">
    <tr>    
        <th colspan="6">Selection Filter</th>
        </tr>
        <tr>
        <td>Site</td><td>{html_options options=$site_options selected=$filter.site name="filter[site]"}</td>
        <td>&nbsp;</td><td>&nbsp;</td>
        </tr>
        <tr>
        <td>PatientID</td><td><input type='text' name='filter[patientID]' value='{$filter.patientID}' size="20"></td>
        <td>PatientName</td><td><input type="text" name="filter[PatientName]" value="{$filter.PatientName}" size="20"</td>
        </tr>
        <tr>
        <td>Gender</td><td><input type="text" name="filter[PatientGender]" value="{$filter.PatientGender}" size="20"</td>
        <td>Date of Birth</td><td><input type="text" name="filter[DoB]" value="{$filter.DoB}" size="20"</td>
        <td>&nbsp;</td><td>&nbsp;</td>
        </tr>
        <tr>
        <td>Acquisition Date</td><td><input type="text" name="filter[DateAcquired]" value="{$filter.DateAcquired}" size="20"</td>
        <td>Archive Location</td><td><input type="text" name="filter[ArchiveLocation]" value="{$filter.ArchiveLocation}" size="20"</td>
        </tr>
        <tr>
        <td colspan="2"></td>
        <td><input class="button" type="submit"></td>
        <td><input class="button" onclick="location.href='dicom_archive?filter[site]='" type="button" value="Clear Form"></td>
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
<th><a href="?filter[orderby]=DateSent{if $filter.orderby == 'DateSent'} DESC{/if}">Transfer Status</a></th>
{/if}
<th><a href="?filter[orderby]=PatientID{if $filter.orderby == 'PatientID'} DESC{/if}">Patient ID</a></th>
<th><a href="?filter[orderby]=PatientName{if $filter.orderby == 'PatientName'} DESC{/if}">Patient Name</a></th>
<th><a href="?filter[orderby]=PatientGender{if $filter.orderby == 'PatientGender'} DESC{/if}">Gender</a></th>
<th><a href="?filter[orderby]=PatientDoB{if $filter.orderby == 'PatientDoB'} DESC{/if}">Date of birth</a></th>
<th><a href="?filter[orderby]=DateAcquired{if $filter.orderby == 'DateAcquired'} DESC{/if}">Acquisition</a></th>
<th><a href="?filter[orderby]=ArchiveLocation{if $filter.orderby == 'ArchiveLocation'} DESC{/if}">Archive Location</a></th>
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
<td>{$archives[archiveIdx].ArchiveLocation}</td>
<td><a href="dicom_archive.php?TarchiveID={$archives[archiveIdx].TarchiveID}&backURL={$backURL|escape:"url"}">View Details</a></td>
<td>{if $archives[archiveIdx].SessionID != ""}<a href="mri_browser.php?sessionID={$archives[archiveIdx].SessionID}&outputType=native&backURL={$backURL|escape:"url"}">View Images</a>{else}&nbsp;{/if}</td>
</tr>

{sectionelse}
<tr>
        <td colspan="12">No data selected</td>
</tr>
    {/section}
</table>

