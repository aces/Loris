<table class="outer-table">
	<tr><th width="11%">Acquisition ID</th><td width="89%"><a href="main.php?test_name=mri_violations&PatientName={$archive.PatientName}&filter=true">{$archive.DicomArchiveID}</a></td></tr>
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
    <tr><th class="valign-top">Series</th><td>
        <table class="inner-series-table">
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
            <td><a href="main.php?test_name=mri_violations&PatientName={$archive.PatientName}&SeriesUID={$archive_series[record].SeriesUID}&filter=true">{$archive_series[record].SeriesUID}</a></td>
        </tr>
{/section}
        </table>
    </td></tr>
    <tr><th class="valign-top">Files</th><td><a href="javascript:toggleLayer('filesBlock');">Show/Hide files</a><br><div id="filesBlock">
    <table class="inner-files-table">    
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
	<tr><th class="valign-top">Metadata</th><td><a href="javascript:toggleLayer('metadataBlock');">Show/Hide metadata</a><br><div id="metadataBlock"><pre>{$archive.AcquisitionMetadata}</pre></div></td></tr>
</table>