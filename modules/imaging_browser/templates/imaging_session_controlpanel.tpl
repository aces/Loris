<!-- Control Panel -->
    {if $subject.backURL!=""}<h3>Navigation</h3>{/if}
    <ul>
       {if $subject.backURL != ""}
            <li><a href="{$subject.backURL}">
                    <span class="text-default">
                        <span class="glyphicon glyphicon-backward"></span>&nbsp;Back to list
                    </span>
                </a>
             </li>
        {/if}
        <li>
            {if $subject.prevTimepoint.URL != ''}
                <a href="{$subject.prevTimepoint.URL}">
                   <span class="text-default">
                       <span class="glyphicon glyphicon-step-backward"></span>&nbsp;Previous
                   </span>
                 </a>
            {/if}
       	    {if $subject.nextTimepoint.URL != ''}
                <a href="{$subject.nextTimepoint.URL}">
                  <span class="text-default">
                      &nbsp;&nbsp;Next&nbsp;<span class="glyphicon glyphicon-step-forward"></span>
                  </span>
                </a>
            {/if}
       </li>
    </ul>
    {if $prevTimepoint.URL!="" && $nextTimepoint.URL!=""}<br><br>{/if}
    <h3>Volume Viewer</h3>
       <input id="bbonly" type="button" class="btn btn-volume-viewer" accesskey="d" value="3D Only">
       <input id="bboverlay" type="button" class="btn btn-volume-viewer" accesskey="c" value="3D + Overlay">

    <h3>Links</h3>
    <ul>
        <li><a href="main.php?test_name=mri_parameter_form&candID={$subject.candid}&sessionID={$subject.sessionID}&commentID={$subject.ParameterFormCommentID}">MRI Parameter Form</a></li>
        <li><a href="main.php?test_name=radiology_review&candID={$subject.candid}&sessionID={$subject.sessionID}&commentID={$subject.RadiologyReviewCommentID}">Radiology Review</a></li>
        {foreach from=$subject.tarchiveids item=tarchive}
        <li><a href="main.php?test_name=dicom_archive&subtest=viewDetails&tarchiveID={$tarchive.TarchiveID}&backURL={$backURL|escape:"url"}">DICOM Archive {$tarchive.TarchiveID}</a></li>{/foreach}
        {if $mantis}
            <li><a target="mantis" href="{$mantis}">Report a Bug (Mantis)</a></li>
        {/if}
    </ul>

    <h3>Visit Level QC</h3>
    <div class="visit-level-feedback">
          <a class="btn btn-default" href="#"
               onClick="javascript:open_popup('feedback_mri_popup.php?sessionID={$subject.sessionID}')">
                 <span class="text-default">
                     <span class="glyphicon glyphicon-pencil feedback-text"></span>
                     <span class="hidden-xs feedback-text"> Visit Level Feedback</span>
                 </span>
        </a>
     </div>

    {if $subject.has_permission}<form action='' method='post'>{/if}
    <div class='div-controlpanel-bottom'>
        <div class="form-group">
            <label>QC Status</label>
            {if $subject.has_permission}{html_options options=$subject.status_options selected=$subject.mriqcstatus name=visit_status tabindex=1 class="form-control input-sm" style="width:100px"}{else}{$subject.mriqcstatus}{/if}
         </div>
       	<label>QC Pending</label>
       	{if $subject.has_permission}{html_options options=$subject.pending_options selected=$subject.mriqcpending name=visit_pending tabindex=2 class="form-control input-sm" style="width:100px"}{else}{if $subject.mriqcpending=='Y'}Yes{else}No{/if}{/if}
   <br>
    {if $subject.has_permission}<input class="btn btn-default" type="submit" accesskey="s" value="Save" name="save_changes">{/if}
   </div>
</td>
<td class='td-cpanel-fake'><table class='table-cpanel-fake'></table>
<!-- /Control Panel -->
