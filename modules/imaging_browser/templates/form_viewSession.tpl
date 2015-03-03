<!-- Main table -->
<script src="GetJS.php?Module=imaging_browser&file=imagingbrowser.js"></script>
{* Olga: show3DViewer not tested *}
{if $show3DViewer}
{*<td nowrap="nowrap">the first opening td already opened in main.tpl *}<input type="button" name="button" value="3D Viewer" class="button" id = "dccid" name = "dccid" style = "background-color: #816e91" onclick="window.open('BrainBrowser/display.html?sessionID={$subject.sessionID}')" /></td>

</br>
{/if}
</tr>

<div class="row">
{$headerTable}
</div>

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">{if $files|@count}{$files|@count} file(s) displayed.</h3>
    </div> <!-- closing panel-heading div-->
   <div class="panel-body">
      {section name=file loop=$files}
       <div class="col-xs-12 col-md-6 ib_frame">
            <div class="panel panel-default">
                <div class="panel-heading clickable"  id="filename-{$files[file].FileID}" onclick="toggle_additionalInfo('{$files[file].FileID}')">
                     <h3 class="panel-title">{if $files[file].Filename != ""}{$files[file].Filename}{else}&nbsp;{/if}</h3>
                     <span class="pull-right arrow glyphicon glyphicon-chevron-up"></span>
                </div> <!--closing panel-heading clickable -->
                <div class="panel-body">
                  <div class="row">
                   <div class="col-xs-9 imaging_browser_pic">
                      <a href="#noID" onClick="window.open('main.php?test_name=brainbrowser&minc_id={$files[file].FileID}', 'BrainBrowser Volume Viewer', 'location = 0,width = auto, height = auto')">
                      <img class='img-checkpic img-responsive' src="{$files[file].CheckPic}">
                      </a>
                   </div><!--closing imaging_browser_pic div -->
                   <div class="col-xs-3 mri-right-panel">
                      {if $files[file].QCStatus != ""}
                      <div class="row mri-right-panel-row image{$files[file].QCStatus}">{$files[file].QCStatus}
                      </div>
                      {/if}
                      <div class="row mri-right-panel-row">
                          <div class="btn-group" data-toggle="buttons">
                                    <label class="btn btn-default">
                                        <input class='mripanel col-xs-3'
                                               type="checkbox"
                                               data-file-id='{$files[file].FileID}'
                                               type='checkbox'
                                               onClick="javascript:toggle_jiv_panel('{$files[file].JivFilename}', '{$files[file].JivAddress}');">
                                        <span class="glyphicon glyphicon-plus"></span><span class="hidden-xs"> Add panel</span>
                                    </label>
                                </div>
                      </div>
                      <div class="row mri-right-panel-row">
                          {if $files[file].FileID}<a class="btn btn-default" href="#noID" onClick='window.open("feedback_mri_popup.php?fileID={$files[file].FileID}",
                              "feedback_mri","width=500,height=800,toolbar=no,location=no,status=yes,scrollbars=yes,resizable=yes")'> <span class="text-default"><span class="glyphicon glyphicon-pencil"></span><span class="hidden-xs">QC Comments</span></span></a>
                            <br>
                          {else}&nbsp;
                          {/if}
                      </div>
                      <div class="row mri-right-panel-row">
                          {if $files[file].FileID}<a class="btn btn-default" onclick="toggle_additionalInfo('{$files[file].FileID}')">Header Info</a>
                          {/if}
                      </div>
                      <div class="row mri-right-panel-row">
                           {if $files[file].FileID}
                                {if $files[file].FileType eq "mnc"}
                                    <a class="btn btn-default" href="mri/jiv/get_file.php?file={$files[file].FullFilename}">
                                        <span class="glyphicon glyphicon-cloud-download"></span><span class="hidden-xs"> Download MINC</span>
                                    </a>
                                {elseif $files[file].FileType eq "nii"}
                                    <a class="btn btn-default" href="mri/jiv/get_file.php?file={$files[file].FullFilename}">
                                        <span class="glyphicon glyphicon-cloud-download"></span><span class="hidden-xs"> Download NIFTI</span>
                                    </a>
                                {elseif $files[file].FileType eq "asc"}
                                    <a class="btn btn-default" href="mri/jiv/get_file.php?file={$files[file].FullFilename}">
                                        <span class="glyphicon glyphicon-cloud-download"></span><span class="hidden-xs"> Download ASC</span>
                                    </a>
                                {elseif $files[file].AcquisitionProtocol eq "MEG"}
                                    <a class="btn btn-default" href="mri/jiv/get_file.php?file={$files[file].FullFilename}">
                                        <span class="glyphicon glyphicon-cloud-download"></span><span class="hidden-xs"> Download DS</span>
                                    </a>
                                {elseif $files[file].AcquisitionProtocol eq "freesurferDir"}
                                    <a class="btn btn-default" href="mri/jiv/get_file.php?file={$files[file].FullFilename}">
                                        <span class="glyphicon glyphicon-cloud-download"></span><span class="hidden-xs"> Download FS</span>
                                    </a>
                                {else}
                                    &nbsp;  
                                {/if}
                            {/if}
                      </div>
                   </div><!--closing mri-right-panel div -->
                  </div><!--closing row div -->
                   <div class="mri-dropdown-info">
                       <br>
                       <div class="row">
                            <div class="form-group col-sm-3">
                                 <label>Selected</label>
                                 {if $has_qc_permission}
                                 {html_options options=$selected_options selected=$files[file].Selected tabindex="3"
                                  name="selectedvol[`$files[file].FileID`]" class="form-control input-sm" title=" " data-live-search="true" data-width="150px"}
                                 {else}
                                 {if $files[file].Selected != ""}{$files[file].Selected}
                                 {else}&nbsp;{/if}
                                 {/if}
                            </div>
                            <div class="form-group col-sm-3">
                                 <label>QC Status
                                 {if $has_qc_permission} 
                                 {if $files[file].New}<span class="text-info">( <span class="glyphicon glyphicon-star"></span> New )</span>{/if}
                                 </label>
                                 {html_options options=$status_options selected=$files[file].QCStatus tabindex="4"
                                  name="status[`$files[file].FileID`]" class="form-control input-sm"}
                                 {else}
                                 {if $files[file].QCStatus != ""}{$files[file].QCStatus}
                                 {else}&nbsp;{/if}
                                 {/if}
                            </div>
                            <div class="form-group col-sm-3">
                                 <label>Caveat</label>
                                 {if $has_qc_permission}
                                 {if $files[file].Caveat}
                                 <a href="main.php?test_name=mri_protocol_check_violations&SeriesUID={$files[file].SeriesUID}&filter=true">Caveat List</a>
                                 {/if}
                                 {html_options options=$caveat_options selected=$files[file].Caveat tabindex="5"
                                  name="caveat[`$files[file].FileID`]" class="form-control input-sm"}
                                 {else}
                                 {if $files[file].Caveat}
                                  <a href="main.php?test_name=mri_protocol_check_violations&SeriesUID={$files[file].SeriesUID}&filter=true">Caveats</a>
                                 {else}No caveats{/if}
                                 {/if}
                            </div>
                         </div><!--closing row div-->
                   </div><!--closing class mri-dropdown-info div -->
                   <div class="mri-righttable" id="mri-righttable-{$files[file].FileID}">
                      <table class="table table-hover table-bordered col-xs-12">
                      <tr>
                      <th class="info">Voxel size</th>
                      <td colspan="3">
                        {if $files[file].Xstep != "" and $files[file].Ystep != ""}X: {$files[file].Xstep} mm Y: {$files[file].Ystep} mm Z: {$files[file].Zstep} mm
                        {elseif $files[file].Xstep != ""}{$files[file].Xstep}{else}&nbsp;{/if}
                      </td>
                        {if $files[file].OutputType != ""}<th class="info">Output Type</th><td>{$files[file].OutputType}</td>{/if}
                      </tr>
                      <tr>
                      {if $files[file].AcquisitionDate>0}<th class="col-xs-2 info">Acq Date</th><td class="col-xs-2">{$files[file].AcquisitionDate|date_format}</td>{/if}
                      {if $files[file].AcquisitionProtocol != "NA"}<th class="col-xs-2 info">Protocol</th><td class="col-xs-2">{$files[file].AcquisitionProtocol}</td>{/if}
                      {if $files[file].CoordinateSpace != ""}<th class="col-xs-2 info">Space</th><td class="col-xs-2">{$files[file].CoordinateSpace}</td>{/if}
                      </tr>
                      <tr>
                        <th class="col-xs-2 info">Inserted</th>
                        <td class="col-xs-2">
                          {if $files[file].FileInsertDate>0}
                              {$files[file].FileInsertDate|date_format}
                          {elseif $smarty.section.file.index==0}Insert date
                          {else}&nbsp;
                          {/if}
                       </td>
                        {if $files[file].SeriesDescription != ""}<th class="col-xs-2 info">SerDesc</th><td class="col-xs-2">{$files[file].SeriesDescription}</td>{/if}
                        {if $files[file].SeriesNumber != ""}<th class="col-xs-2 info">Ser Num</th><td class="col-xs-2">{$files[file].SeriesNumber}</td>{/if}
                     <tr>
                        {if $files[file].Pipeline != ""}<th class="col-xs-2 info">Pipeline</th><td class="col-xs-2">{$files[file].Pipeline}</td>{/if}
                        {if $files[file].Algorithm != ""}<th class="col-xs-2 info">Algorithm</th><td class="col-xs-2">{$files[file].Algorithm}</td>{/if}
                        {if $files[file].Comment != ""}<th class="col-xs-2 info">Comment</th><td class="col-xs-2">{$files[file].Comment}</td>{/if}
                     </tr>
                     <tr>
                      {if $files[file].EchoTime != "" && $files[file].EchoTime != "0.00"}
                         <th class="col-xs-2 info">Echo Time</th><td class="col-xs-2">{$files[file].EchoTime} ms</td>
                      {/if}
                      {if $files[file].RepetitionTime != "" && $files[file].RepetitionTime != "0.00"}
                         <th class="col-xs-2 info">Rep Time</th><td class="col-xs-2">{$files[file].RepetitionTime} ms</td>
                      {/if}
                      {if $files[file].SliceThickness != ""&& $files[file].SliceThickness != "0.00"}
                         <th class="col-xs-2 info">Slice Thick</th><td class="col-xs-2">{$files[file].SliceThickness} mm</td>
                     {/if}
                     </tr>
                     <tr>
                      {if $files[file].Time != "" && $files[file].Time != "0.00"}
                         <th class="col-xs-2 info">Nb of vol.</th><td class="col-xs-2">{$files[file].Time} volumes</td>
                      {/if}
                      {if $files[file].SlicewiseRejected != ""}
                          <th class="col-xs-2 info">Slicewise correlations (Nb)</th><td class="col-xs-2">{$files[file].SlicewiseRejected}</td>
                      {/if}
                     </tr>
                     <tr>
                      {if $files[file].InterlaceRejected != ""}<th class="col-xs-2 info">Interlace correlations (Nb)</th><td>{$files[file].InterlaceRejected}</td>{/if}
                      {if $files[file].IntergradientRejected != ""}<th class="col-xs-2 info">Gradient-wise correlations (Nb)</th><td>{$files[file].IntergradientRejected}</td>{/if}
                      {if $files[file].TotalRejected != ""}<th class="col-xs-2 info">Nb of rejected directions</th><td>{$files[file].TotalRejected}{else}&nbsp;</td>{/if}
                     </tr>
                    </table>
                   </div><!--closing mri-additional-info -->
                </div> <!--closing panel-body -->
           </div> <!--panel panel-default -->
       </div> <!--closing ib_frame div-->
       {/section}
   </div> <!-- closing panel-body div-->
</div>
{else}
    <h3>No data selected</h3>
{/if}
{if $has_permission}</form>{/if} 
