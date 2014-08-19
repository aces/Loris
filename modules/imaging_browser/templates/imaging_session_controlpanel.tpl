<!-- Control Panel -->
    {if $subject.backURL!=""}<h3>Navigation</h3>{/if}
    <ul>{if $subject.backURL != ""}
        <li><a href="{$subject.backURL}"><img class='img-navigation-array' src="images/left.gif" alt="Back"><img class='img-navigation-array' src="images/left.gif" alt="Back">&nbsp;Back to list</a></li>{/if}
        {if $subject.prevTimepoint.URL != ''}<li><a href="{$subject.prevTimepoint.URL}">&nbsp;&nbsp;&nbsp;<img class='img-navigation-array' src="images/left.gif" alt="Prev">&nbsp;Previous</a></li>{/if}
       	{if $subject.nextTimepoint.URL != ''}<li><a href="{$subject.nextTimepoint.URL}">&nbsp;&nbsp;&nbsp;<img class='img-navigation-array' src="images/right.gif" alt="Next">&nbsp;Next</a></li>{/if}
    </ul>
    {if $prevTimepoint.URL!="" && $nextTimepoint.URL!=""}<br><br>{/if}
    <h3>3D Panel Viewing</h3>
    <ul>
       	<li><input id="bboverlay" type="button" class="button" accesskey="c" value="3D+Overlay"></li>
       	<li><input id="bbonly" type="button" class="button" accesskey="d" value="3D Only"></li>
    </ul>

    <h3>Links</h3>
    <ul>
        <li><a href="main.php?test_name=mri_parameter_form&candID={$subject.candid}&sessionID={$subject.sessionID}&commentID={$subject.ParameterFormCommentID}">MRI Parameter Form</a></li>
        <li><a href="main.php?test_name=radiology_review&candID={$subject.candid}&sessionID={$subject.sessionID}&commentID={$subject.RadiologyReviewCommentID}">Radiology Review</a></li>
        {foreach from=$subject.tarchiveids item=tarchive}
        <li><a href="main.php?test_name=dicom_archive&subtest=viewDetails&tarchiveID={$tarchive.TarchiveID}&backURL={$backURL|escape:"url"}">DICOM Archive(s) {$tarchive.TarchiveID}</a></li>{/foreach}
        <li><a target="mantis" href="{$mantis}">Report a Bug (Mantis)</a></li>
    </ul>

    <h3>Visit Controls</h3>
    <ul>
        <li><a href="#" onClick="javascript:open_popup('feedback_mri_popup.php?sessionID={$subject.sessionID}')">Visit Label Feedback</a></li>
    </ul>

    <h3>Visit QC</h3>
    {if $subject.has_permission}<form action='' method='post'>{/if}
    <div class='div-controlpanel-bottom'>
    <dl>
        <dt>QC Status</dt>
       	<dt class='dt-qc-status'>{if $subject.has_permission}{html_options options=$subject.status_options selected=$subject.mriqcstatus name=visit_status tabindex=1 class="form-control input-sm" style="width:100px"}{else}{$subject.mriqcstatus}{/if}</dt>
       	<dt>QC Pending</dt>
       	<dt>{if $subject.has_permission}{html_options options=$subject.pending_options selected=$subject.mriqcpending name=visit_pending tabindex=2 class="form-control input-sm" style="width:100px"}{else}{if $subject.mriqcpending=='Y'}<img src='images/check_blue.gif' class='img-pending' />{else}&ndbp;{/if}{/if}</dt>
    </dl>
    {if $subject.has_permission}<input class="button" type="submit" accesskey="s" value="Save" name="save_changes">{/if}
</div>
</td>
<td class='td-cpanel-fake'><table class='table-cpanel-fake'></table>
<!-- /Control Panel -->
