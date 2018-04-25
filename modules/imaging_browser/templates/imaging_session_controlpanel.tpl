    <h3>Navigation</h3>
    <ul>
        {if $subject.backURL}
            <li><a href="{$subject.backURL}">
                    <span class="text-default">
                        <span class="glyphicon glyphicon-backward"></span>&nbsp;Back to list
                    </span>
                </a>
             </li>
        {/if}
        {if $subject.prevTimepoint.URL != ''}
            <li>
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
           </li>
        {/if}
    </ul>
    {if $prevTimepoint.URL!="" && $nextTimepoint.URL!=""}<br><br>{/if}
    <h3>Volume Viewer</h3>
       <input id="bbonly" type="button" class="btn btn-volume-viewer" accesskey="d" value="3D Only">
       <input id="bboverlay" type="button" class="btn btn-volume-viewer" accesskey="c" value="3D + Overlay">

    <h3>Links</h3>
    <ul>
        {if $mri_param_form_table_exists}
            <li><a href="{$baseurl}/{$subject.candid}/{$subject.sessionID}/mri_parameter_form/?commentID={$subject.ParameterFormCommentID}">MRI Parameter Form</a></li>
        {/if}
        {if $rad_review_table_exists}
            <li><a href="{$baseurl}/{$subject.candid}/{$subject.sessionID}/radiology_review/?commentID={$subject.RadiologyReviewCommentID}">Radiology Review</a></li>
        {/if}
        {foreach from=$subject.tarchiveids item=tarchive}
        <li><a href="{$baseurl}/dicom_archive/viewDetails/?tarchiveID={$tarchive.TarchiveID}&backURL={$backURL|escape:"url"}">DICOM Archive {$tarchive.TarchiveID}</a></li>{/foreach}
        {if $issue_tracker_url}
            <li><a target="issue_tracker_url" href="{$issue_tracker_url}">Report a Bug</a></li>
        {/if}
    </ul>

    <h3>Visit Level QC</h3>
    <div class="visit-level-feedback">
          <a class="btn btn-default" href="#"
               onClick="javascript:open_popup('{$baseurl}/feedback_mri_popup.php?sessionID={$subject.sessionID}')">
                 <span class="text-default">
                     <span class="glyphicon glyphicon-pencil feedback-text"></span>
                     <span class="hidden-xs feedback-text"> Visit Level Feedback</span>
                 </span>
        </a>
     </div>

   <br>

    <div class='div-controlpanel-bottom'>
        <div class="form-group">
            <label>QC Status</label>
            {if $subject.has_permission}{html_options options=$subject.status_options selected=$subject.mriqcstatus name=visit_status tabindex=1 class="form-control input-sm" style="width:100px"}{else}{$subject.mriqcstatus}{/if}
   <br>
       	    <label>QC Pending</label>
       	    {if $subject.has_permission}{html_options options=$subject.pending_options selected=$subject.mriqcpending name=visit_pending tabindex=2 class="form-control input-sm" style="width:100px"}{else}{if $subject.mriqcpending=='Y'}Yes{else}No{/if}{/if}
   <br>
       	    <label>Visit Level Caveat</label>
       	    {if $subject.has_permission}{html_options options=$subject.caveat_options selected=$subject.mricaveat name=visit_caveat tabindex=3 class="form-control input-sm" style="width:100px"}{else}{if $subject.mricaveat=='true'}True{else}False{/if}{/if}
   <br>
            {if $subject.has_permission}<input class="btn btn-default" type="submit" accesskey="s" value="Save" name="save_changes">{/if}
        </div>
   </div>
</td>
<td class='td-cpanel-fake'><table class='table-cpanel-fake'></table>
<!-- /Control Panel -->
