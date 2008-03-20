{literal}
<script type="text/javascript">
<!--
function toggleLayer(whichLayer)
{
if (document.getElementById)
{
// this is the way the standards work
var style2 = document.getElementById(whichLayer).style;
style2.display = style2.display == "block" ? "none":"block";
}
else if (document.all)
{
// this is the way old msie versions work
var style2 = document.all[whichLayer].style;
style2.display = style2.display == "block" ? "none":"block";
}
else if (document.layers)
{
// this is the way nn4 works
var style2 = document.layers[whichLayer].style;
style2.display = style2.display == "block" ? "none":"block";
}
}
// -->
</script>
{/literal}

<table class="fancytableleft" width="90%">
	<tr><th width="11%">Acquisition ID</th><td width="89%">{$archive.DicomArchiveID}</td></tr>
	<tr><th>Patient ID</th><td{if $archive.patientIDValid == 0} class="error"{/if}>{$archive.PatientID}</td></tr>
	<tr><th>Patient Name</th><td{if $archive.patientNameValid == 0} class="error"{/if}>{$archive.PatientName}</td></tr>
	<tr><th>Patient Birthdate</th><td>{$archive.PatientDoB}</td></tr>
	<tr><th>Date acquired</th><td>{$archive.DateAcquired}</td></tr>
	<tr><th>Acquired at</th><td>{$archive.CenterName}</td></tr>
	<tr><th>Number of Acquisitions</th><td>{$archive.AcquisitionCount}</td></tr>
	<tr><th>Archived by</th><td>{$archive.CreatingUser}</td></tr>
	<tr><th>Last update</th><td>{$archive.LastUpdate}</td></tr>
	<tr><th>Summary type version</th><td>{$archive.sumTypeVersion}</td></tr>
	<tr><th>Source location</th><td>{$archive.SourceLocation}</td></tr>
	<tr><th>Archive type version</th><td>{$archive.tarTypeVersion}</td></tr>
	<tr><th>Archive location</th><td>{$archive.ArchiveLocation}</td></tr>
	<tr><th>Archiving log</th><td><pre>{$archive.CreateInfo}</pre></td></tr>
	<tr><th>md5sum of Archive</th><td><pre><br><b>{$archive.md5sumArchive}</pre></b></td></tr>
	<tr><th>md5sum of Dicom unzipped</th><td><br><b><pre>{$archive.md5sumDicomOnly}</pre></b></td></tr>
    <tr><th valign="top">Series</th><td>
    <table width="100%" border="1px" cellpadding="5px">
    <tr>
        <th>Series Number</th>
        <th>Series Description</th>
        <th>Sequence Name</th>
        <th>Echo Time</th>
        <th>Repetition Time</th>
        <th>Inversion Time</th>
        <th>Slice Thickness</th>
        <th>Phase Encoding</th>
        <th>Number of Files</th>
        <th>SeriesUID</th>
    </tr>
{section name=record loop=$archive_series}
    <tr>
        <td>{$archive_series[record].SeriesNumber}</td>
        <td>{$archive_series[record].SeriesDescription}</td>
        <td>{$archive_series[record].SequenceName}</td>
        <td>{$archive_series[record].EchoTime}</td>
        <td>{$archive_series[record].RepetitionTime}</td>
        <td>{$archive_series[record].InversionTime}</td>
        <td>{$archive_series[record].SliceThickness}</td>
        <td>{$archive_series[record].PhaseEncoding}</td>
        <td>{$archive_series[record].NumberOfFiles}</td>
        <td>{$archive_series[record].SeriesUID}</td>
    </tr>
{/section}
    </table>
    </td></tr>

    <tr><th valign="top">Files</th><td><a href="javascript:toggleLayer('filesBlock');">Show/Hide files</a><br><div id="filesBlock" style="display: none;">
    <table width="100%" border="1px" cellpadding="5px">
    <tr>
        <th>SeriesNumber</th>
        <th>FileNumber</th>
        <th>EchoNumber</th>
        <th>SeriesDescription</th>
        <th>Md5Sum</th>
        <th>FileName</th>
    </tr>
{section name=record loop=$archive_files}
    <tr>
        <td>{$archive_files[record].SeriesNumber}</td>
        <td>{$archive_files[record].FileNumber}</td>
        <td>{$archive_files[record].EchoNumber}</td>
        <td>{$archive_files[record].SeriesDescription}</td>
        <td>{$archive_files[record].Md5Sum}</td>
        <td>{$archive_files[record].FileName}</td>
    </tr>
{/section}
    </table></div>
    </td></tr>
	<tr><th valign="top">Metadata</th><td><a href="javascript:toggleLayer('metadataBlock');">Show/Hide metadata</a><br><div id="metadataBlock" style="display: none;"><pre>{$archive.AcquisitionMetadata}</pre></div></td></tr>
</table>
