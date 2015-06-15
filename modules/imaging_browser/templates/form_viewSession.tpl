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
    <div class="panel-heading" id="panel-main-heading">
        <h3 class="panel-title">{if $files|@count}{$files|@count} file(s) displayed.</h3>
        <span class="pull-right clickable mri-arrow glyphicon glyphicon-chevron-up"></span>
    </div> <!-- closing panel-heading div-->
   <div class="panel-body">
      {section name=file loop=$files}
       <div class="col-xs-12 col-md-6 ib_frame">
            <div class="panel panel-default" id="subpanel-{$files[file].FileID}">
                <div class="panel-heading" id="mri-panel-{$files[file].FileID}">
                    <input type="checkbox"
                           data-file-id='{$files[file].FileID}'
                           type='checkbox'
                           class='mripanel'
                           onClick="javascript:toggle_jiv_panel('{$files[file].JivFilename}', '{$files[file].JivAddress}');">
                            <!--span class="glyphicon glyphicon-plus"-->
                     <h3 class="panel-title"> {if $files[file].Filename != ""}{$files[file].Filename}{else}&nbsp;{/if}</h3>
                     {if $files[file].QCStatus == "Pass"}
                          <span class="label label-success">{$files[file].QCStatus}</span>
                          {elseif $files[file].QCStatus == "Fail"}<span class="label label-danger">{$files[file].QCStatus}</span>
                     {/if}
                     <span class="pull-right clickable glyphicon arrow glyphicon-chevron-up" onclick="toggle_mriPanel('{$files[file].FileID}')"></span>
                      <div class="pull-right">
                          <div class="btn-group views">
                              <button type="button" class="btn btn-default btn-xs dropdown-toggle"
                                      data-toggle="dropdown" data-fileid="{$files[file].FileID}" onclick="toggle_additionalInfo('{$files[file].FileID}')">
                                 Header Info
                              <span class="caret"></span>
                              </button>
                          </div><!--closing btn-group views div -->
                      </div><!--cloding pull-righ div -->
                </div> <!--closing panel-heading clickable -->
                <div class="panel-body panel-mri-body" id="panel-body-{$files[file].FileID}">
                  <div class="row">
                   <div class="col-xs-9 imaging_browser_pic">
                      <a href="#noID" onClick="window.open('main.php?test_name=brainbrowser&minc_id={$files[file].FileID}', 'BrainBrowser Volume Viewer', 'location = 0,width = auto, height = auto, scrollbars=yes')">
                      <img class='img-checkpic img-responsive' src="{$files[file].CheckPic}">
                      </a>
                   </div><!--closing imaging_browser_pic div -->
                   <div class="col-xs-3 mri-right-panel">
                      <div class="form-group">
                         <div class="row">
                          <label>QC Status
                              {if $has_qc_permission}
                              {if $files[file].New}<span class="text-info">( <span class="glyphicon glyphicon-star"></span> New )</span>{/if}
                           </label>
                                  {html_options options=$status_options selected=$files[file].QCStatus tabindex="4"
                                                name="status[`$files[file].FileID`]" class="form-control input-sm"}
                                  {else}
                                  {if $files[file].QCStatus != ""}
                                  <div class="static-info">
                                  {$files[file].QCStatus}
                                  </div>
                                  {else}&nbsp;{/if}
                                  {/if}
                           </div>
                           <div class="row">
                               <label class="text-left">Selected</label>
                                 {if $has_qc_permission}
                                 {html_options options=$selected_options selected=$files[file].Selected tabindex="3"
                                  name="selectedvol[`$files[file].FileID`]" class="form-control input-sm" title=" " data-live-search="true" data-width="150px"}
                                 {else}
                                 {if $files[file].Selected != ""}
                                 <div class="static-info">
                                 {$files[file].Selected}
                                 </div>
                                 {else}&nbsp;{/if}
                                 {/if}
                           </div>
                           <div class="row">
                               <label>Caveat</label>
                                 {if $has_qc_permission}
                                 {if $files[file].Caveat}
                                 <a href="main.php?test_name=mri_violations&submenu=mri_protocol_check_violations&SeriesUID={$files[file].SeriesUID}&filter=true">Caveat List</a>
                                 {/if}
                                 {html_options options=$caveat_options selected=$files[file].Caveat tabindex="5"
                                  name="caveat[`$files[file].FileID`]" class="form-control input-sm"}
                                 {else}
                                 <div class="static-info">
                                 {if $files[file].Caveat}
                                  <a href="main.php?test_name=mri_protocol_check_violations&SeriesUID={$files[file].SeriesUID}&filter=true">Caveat List</a>
                                 {else}No caveats{/if}
                                 </div>
                                 {/if}
                          </div>
                      </div>
                   </div><!--closing mri-right-panel div -->
                   <div class="row mri-second-row-panel col-xs-12">
                           {if $files[file].FileID}
                                <a class="btn btn-default"
                                   href="#noID" onClick='window.open("feedback_mri_popup.php?fileID={$files[file].FileID}",
                                         "feedback_mri","width=500,height=800,toolbar=no,location=no,status=yes,scrollbars=yes,resizable=yes")'>
                                   <span class="text-default">
                                        <span class="glyphicon glyphicon-pencil"></span>
                                        <span class="hidden-xs">QC Comments</span>
                                   </span>
                                </a>
                           <a class="btn btn-default" href="mri/jiv/get_file.php?file={$files[file].FullFilename}">
                               <span class="glyphicon glyphicon-download-alt"></span><span class="hidden-xs"> Download MINC</span>
                           </a>
                           {else}&nbsp;
                           {/if}
                           {if $files[file].XMLprotocol != ""}
                               <a class="btn btn-default" href="mri/jiv/get_file.php?file={$files[file].XMLprotocol}">
                               <span class="glyphicon glyphicon-download-alt"></span><span class="hidden-xs"> Download XML Protocol</span>
                               </a>
                           {/if} 
                        </div> <!--closing mri-second-row-panel div -->
                         <div class="row mri-third-row-panel col-xs-12">
                           {if $files[file].XMLprotocol != ""}
                               <a class="btn btn-default" href="mri/jiv/get_file.php?file={$files[file].XMLreport}">
                               <span class="glyphicon glyphicon-download-alt"></span><span class="hidden-xs"> Download XML Report</span>
                               </a>
                           {/if}
                           {if $files[file].NrrdFile != ""}
                               <a class="btn btn-default" href="mri/jiv/get_file.php?file={$files[file].NrrdFile}">
                               <span class="glyphicon glyphicon-download-alt"></span><span class="hidden-xs"> Download NRRD</span>
                               </a>
                           {/if}
                       </div> <!--closing mri-third-row-panel div -->
                   </div><!--closing row div -->
                   <div class="mri-righttable col-xs-12" id="mri-righttable-{$files[file].FileID}">
                      <table class="table table-hover table-bordered header-info col-xs-12 dynamictable">
                      <tr>
                      <th class="info col-xs-2">Voxel size</th>
                      <td class="col-xs-6" colspan="3">
                        {if $files[file].Xstep != "" and $files[file].Ystep != ""}X: {$files[file].Xstep} mm Y: {$files[file].Ystep} mm Z: {$files[file].Zstep} mm
                        {elseif $files[file].Xstep != ""}{$files[file].Xstep}{else}&nbsp;{/if}
                      </td>
                        <th class="col-xs-2 info">Output Type</th><td class="col-xs-2">{$files[file].OutputType}</td>
                      </tr>
                      <tr>
                      <th class="col-xs-2 info">Acquisition Date</th><td class="col-xs-2">{$files[file].AcquisitionDate|date_format}</td>
                      <th class="col-xs-2 info">Space</th><td class="col-xs-2">{$files[file].CoordinateSpace}</td>
                      <th class="col-xs-2 info">Inserted Date</th>
                        <td class="col-xs-2">
                          {if $files[file].FileInsertDate>0}
                              {$files[file].FileInsertDate|date_format}
                          {elseif $smarty.section.file.index==0}Insert date
                          {else}&nbsp;
                          {/if}
                       </td>
                      </tr>
                      <tr>
                        <th class="col-xs-2 info">Protocol</th><td class="col-xs-2">{$files[file].AcquisitionProtocol}</td>
                        <th class="col-xs-2 info">Series Description</th><td class="col-xs-2">{$files[file].SeriesDescription}</td>
                        <th class="col-xs-2 info">Series Number</th><td class="col-xs-2">{$files[file].SeriesNumber}</td>
                     <tr>
                      {if $files[file].EchoTime != "" && $files[file].EchoTime != "0.00"}
                         <th class="col-xs-2 info">Echo Time</th><td class="col-xs-2">{$files[file].EchoTime} ms</td>
                      {/if}
                      {if $files[file].RepetitionTime != "" && $files[file].RepetitionTime != "0.00"}
                         <th class="col-xs-2 info">Rep Time</th><td class="col-xs-2">{$files[file].RepetitionTime} ms</td>
                      {/if}
                      <th class="col-xs-2 info">Slice Thick</th><td class="col-xs-2">{$files[file].SliceThickness} mm</td>
                     </tr>
                     <tr>
                        <th class="col-xs-2 info">Number of volumes</th><td class="col-xs-2">{$files[file].Time} volumes</td>
                        <th class="col-xs-2 info">Pipeline</th><td class="col-xs-2">{$files[file].Pipeline}</td>
                        <th class="col-xs-2 info">Algorithm</th><td class="col-xs-2">{$files[file].Algorithm}</td>
                     </tr>
                     <tr>
                      <th class="col-xs-2 info">Number of rejected directions</th><td>{$files[file].TotalRejected}</td>
                      <th class="col-xs-2 info">Number of Interlace correlations</th><td>{$files[file].InterlaceRejected}</td>
                      <th class="col-xs-2 info">Number of Gradient-wise correlations</th><td>{$files[file].IntergradientRejected}</td>
                     </tr>
                     <tr>
                         <th class="col-xs-2 info">Number of Slicewise correlations</th><td class="col-xs-2">{$files[file].SlicewiseRejected}</td>
                       <td colspan="2"></td>
                       <td colspan="2"></td>
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
</div>
{/if}
{if $has_permission}</form>{/if} 
