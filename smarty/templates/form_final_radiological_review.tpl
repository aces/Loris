<form method="post" name="new_final_review" id="final_review">
{if $conflicts}
<ul class="error">
{foreach from=$conflicts item=conflict}
    <li>{$conflict}</li>
    {/foreach}
</ul>
{/if}

<h1>General Information</h1>
<table width="80%" class="instrument">
<tr>
</tr>
<tr>
    <td>{$form.PSCID.label}</td>
    <td>{$form.PSCID.html}</td>
</tr>
<tr>
    <td>{$form.CandID.label}</td>
    <td>{$form.CandID.html}</td>
</tr>
<tr>
    <td>{$form.Visit_label.label}</td>
    <td>{$form.Visit_label.html}</td>
</tr>
<tr>
    <td>{$form.DICOM_Folder_Name.label}</td>
    <td>{$form.DICOM_Folder_Name.html}</td>
</tr>
<tr>
    <td>Go to:</td>
    <td><a href="mri_browser.php?sessionID={$form.SessionID.html}" target="_blank">MRI Browser</a><br /><a href="main.php?test_name=radiology_review&candID={$form.CandID.html}&sessionID={$form.SessionID.html}&commentID={$form.CommentID.html}" target="_blank">Original Radiology Review</a></td>
</tr>
</table>

<h1>Review Values</h1>
<table width="80%" class="std">
<tr>
    <th>Field</th>
    <th colspan="2">Project Reviews</th>
    <th>Site Review</th>
</tr>
<tr>
    <th>&nbsp;</th>
    <th>Final Review</th>
    <th>Extra Review</th>
    <th>&nbsp;</th>
</tr>
<tr>
    <td>{$form.Final_Examiner.label}</td>
    <td>{$form.Final_Examiner.html}</td>
    <td>{$form.Final_Examiner2.html}</td>
    <td>{$form.Original_Examiner.html}</td>
</tr>
<tr>
    <td>{$form.Review_Done.label}</td>
    <td>{$form.Review_Done.html}</td>
    <td>{$form.Review_Done2.html}</td>
    <td>{$form.Original_Scan_Done.html}</td>
</tr>
<tr>
    <td>{$form.Final_Review_Results.label}</td>
    <td>{$form.Final_Review_Results.html}</td>
    <td>{$form.Final_Review_Results2.html}</td>
    <td>{$form.Original_Review_Results.html}</td>
</tr>
<tr>
    <td>{$form.Final_Exclusionary.label}</td>
    <td>{$form.Final_Exclusionary.html}</td>
    <td>{$form.Final_Exclusionary2.html}</td>
    <td>{$form.Original_Exclusionary.html}</td>
</tr>
<tr>
    <td>{$form.SAS.label}</td>
    <td>{$form.SAS.html}</td>
    <td>{$form.SAS2.html}</td>
    <td>&nbsp;</td>
</tr>
<tr>
    <td>{$form.PVS.label}</td>
    <td>{$form.PVS.html}</td>
    <td>{$form.PVS2.html}</td>
    <td>&nbsp;</td>
</tr>
<tr>
    <td>{$form.Final_Incidental_Findings.label}</td>
    <td>{$form.Final_Incidental_Findings.html}</td>
    <td>{$form.Final_Incidental_Findings2.html}</td>
    <td>{$form.Original_Incidental_Findings.html}</td>
</tr>
<tr>
    <td>{$form.Finalized.label}</td>
    <td>{$form.Finalized.html}</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
</tr>
</table>
<input type="submit" name="fire_away" value="Save" />
	
{$form.hidden}
</form>
<h1>Change Log</h1>
<table class="std">
<tr>
<th>Time</th>
<th>User</th>
<th>Field</th>
<th>Old Value</th>
<th>New Value</th>
</tr>
{$form.history.html}
</table>
