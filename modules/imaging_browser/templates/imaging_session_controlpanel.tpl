<h3>{t text="Navigation" domain="imaging_browser"}</h3>
    <ul>
        {if $subject.backURL|default}
            <li><a href="{$subject.backURL|default}">
                    <span class="text-default">
                        <span class="glyphicon glyphicon-backward"></span>&nbsp;{t text="Back to list" domain="imaging_browser"}
                    </span>
                </a>
             </li>
        {/if}
        {if $subject.prevTimepoint.URL|default != ''}
            <li>
                <a href="{$subject.prevTimepoint.URL}">
                   <span class="text-default">
                       <span class="glyphicon glyphicon-step-backward"></span>&nbsp;{t text="Previous" domain="loris"}
                   </span>
                 </a>
            </li>
        {/if}
       	    {if $subject.nextTimepoint.URL != ''}
                <a href="{$subject.nextTimepoint.URL}">
                  <span class="text-default">
                      &nbsp;&nbsp;{t text="Next" domain="loris"}&nbsp;<span class="glyphicon glyphicon-step-forward"></span>
                  </span>
                </a>
           </li>
        {/if}
    </ul>
    {if $prevTimepoint.URL|default !="" && $nextTimepoint.URL!=""}<br><br>{/if}
    <h3>{t text="Volume Viewer" domain="imaging_browser"}</h3>
       <input id="bbonly" type="button" class="btn btn-volume-viewer" accesskey="d" value="{t text='3D Only' domain='imaging_browser'}">
       <input id="bboverlay" type="button" class="btn btn-volume-viewer" accesskey="c" value="{t text='3D + Overlay' domain='imaging_browser'}">

{if $subject.links|@count || $subject.tarchiveIDLoc|@count || $mantis|default}
    <h3>{t text="Links" domain="imaging_browser"}</h3>
    <ul>
        {foreach from=$subject.links item=link}
            <li><a href="{$baseurl|default}/instruments/{$link.BEName}/?commentID={$link.CommentID}&sessionID={$subject.sessionID}&candID={$subject.candid}">{$link.FEName}</a></li>
        {/foreach}
        {foreach from=$subject.tarchiveIDLoc key=tarchive item=tarchiveLoc}
            <li><a href="{$baseurl|default}/dicom_archive/viewDetails/?tarchiveID={$tarchive}&backURL={$backURL|default|escape:"url"}">DICOM Archive {$tarchive}</a></li>
            <li><a href="/mri/jiv/get_file.php?file={$tarchiveLoc['ArchiveLocation']}&patientName={$tarchiveLoc['PatientName']}" class="btn btn-primary btn-small">
                    <span class="glyphicon glyphicon-cloud-download"></span><span class="hidden-xs"> Download DICOM {$tarchive}</span>
                </a>
            </li>
        {/foreach}
        {if $mantis|default}
            <li><a target="mantis" href="{$issue_tracker_url}">{t text="Report a Bug (Mantis)" domain="imaging_browser"}</a></li>
        {/if}
    </ul>
{/if}

    <h3>{t text="Visit Level QC" domain="imaging_browser"}</h3>
    <div class="visit-level-feedback">
          <a class="btn btn-default" href="#"
               onClick="javascript:open_popup('{$baseurl|default}/imaging_browser/feedback_mri_popup/sessionID={$subject.sessionID}')">
                 <span class="text-default">
                     <span class="glyphicon glyphicon-pencil feedback-text"></span>
                     <span class="hidden-xs feedback-text"> {t text="Visit Level Feedback" domain="imaging_browser"}</span>
                 </span>
        </a>
     </div>
    <br>
    <div class='div-controlpanel-bottom'>
        <div class="form-group">
            <label>{t text="QC Status" domain="imaging_browser"}</label>
            {if $subject.has_permission}{html_options options=$subject.status_options selected=$subject.mriqcstatus name=visit_status tabindex=1 class="form-control input-sm" style="width:100px"}{else}{$subject.mriqcstatus}{/if}
   <br>
       	    <label>{t text="QC Pending" domain="imaging_browser"}</label>
       	    {if $subject.has_permission}{html_options options=$subject.pending_options selected=$subject.mriqcpending name=visit_pending tabindex=2 class="form-control input-sm" style="width:100px"}{else}{if $subject.mriqcpending=='Y'}Yes{else}No{/if}{/if}
   <br>
       	    <label>{t text="Visit Level Caveat" domain="imaging_browser"}</label>
       	    {if $subject.has_permission}{html_options options=$subject.caveat_options selected=$subject.mricaveat name=visit_caveat tabindex=3 class="form-control input-sm" style="width:100px"}{else}{if $subject.mricaveat=='true'}True{else}False{/if}{/if}
   <br>
            {if $subject.has_permission}<input class="btn btn-default" type="submit" accesskey="s" value="{t text='Save' domain='loris'}" name="save_changes">{/if}
        </div>
   </div>

<!-- /Control Panel -->
