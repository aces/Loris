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
                   <div class="col-xs-6 col-md-4 imaging_browser_pic">
                      <a href="#noID" onClick="window.open('main.php?test_name=brainbrowser&minc_id={$files[file].FileID}', 'BrainBrowser Volume Viewer', 'location = 0,width = auto, height = auto')">
                      <img class='img-checkpic' src="{$files[file].CheckPic}">
                      </a>
                   </div><!--closing imaging_browser_pic div -->
                   <div class="col-xs-2 col-md-2 mri-right-panel">
                      {if $files[file].QCStatus != ""}
                      <div class="row mri-right-panel-row image{$files[file].QCStatus}">{$files[file].QCStatus}
                      </div>
                      <div class="line-separator"></div>
                      {/if}
                      <div class="row mri-right-panel-row">Add panel  <input class='mripanel' data-file-id='{$files[file].FileID}' type='checkbox' onClick="javascript:toggle_j
iv_panel('{$files[file].JivFilename}', '{$files[file].JivAddress}');">
                      </div>
                      <div class="line-separator"></div>
                      <div class="row mri-right-panel-row">{if $files[file].FileID}<a href="#noID" onClick='window.open("feedback_mri_popup.php?fileID={$files[file].FileID}", "feedback_mri","width=500,height=800,toolbar=no,location=no,status=yes,scrollbars=yes,resizable=yes")'>Link to comments</a><br>{else}&nbsp;{/if}
                      </div>
                      <div class="line-separator"></div>
                      <div class="row mri-right-panel-row">{if $files[file].FileID}
                            <a href="mri/jiv/get_file.php?file={$files[file].FullFilename}">Download MINC</a>{/if}
                      </div>
                      <div class="line-separator"></div>
                   </div><!--closing mri-right-panel div -->
                  </div><!--closing row div -->
                   <div class="mri-dropdown-info">
                       <div class="row">
                           <div class="col-sm-3 label">Selected</div>
                           <div class="col-sm-3 label">QC Status</div>
                           <div class="col-sm-3 label">Caveat</div>
                       </div><!--closing row div-->
                       <div class="row">
                            <div class="col-sm-3">{if $has_qc_permission}
                                 {html_options options=$selected_options selected=$files[file].Selected tabindex="3" name="selectedvol[`$files[file].FileID`]" class="form-control input-sm"}
                                 {else}
                                 {if $files[file].Selected != ""}{$files[file].Selected}
                                 {else}&nbsp;{/if}
                                 {/if}
                            </div>
                            <div class="col-sm-3">{if $has_qc_permission} 
                                 {if $files[file].New}<font color='red'>NEW</font>{/if}
                                 {html_options options=$status_options selected=$files[file].QCStatus tabindex="4" name="status[`$files[file].FileID`]" class="form-control input-sm"}
                                 {else}
                                 {if $files[file].QCStatus != ""}{$files[file].QCStatus}
                                 {else}&nbsp;{/if}
                                 {/if}
                            </div>
                            <div class="col-sm-3">{if $has_qc_permission}
                                 {if $files[file].Caveat}
                                 <a href="main.php?test_name=mri_protocol_check_violations&SeriesUID={$files[file].SeriesUID}&filter=true">Caveat List</a>
                                 {/if}
                                 {html_options options=$caveat_options selected=$files[file].Caveat tabindex="5" name="caveat[`$files[file].FileID`]" class="form-control input-sm"}
                                 {else}
                                 {if $files[file].Caveat}<a href="main.php?test_name=mri_protocol_check_violations&SeriesUID={$files[file].SeriesUID}&filter=true">Caveats</a>
                                 {else}No caveats{/if}
                                 {/if}
                            </div>
                         </div><!--closing row div-->
                   </div><!--closing class mri-dropdown-info div -->
                   <div class="mri-righttable" id="mri-righttable-{$files[file].FileID}">
                      <table class="table-mri-right-and-center">
                      <tr>
                      <th>Voxel size</th>
                      <td colspan="5">
                        {if $files[file].Xstep != "" and $files[file].Ystep != ""}X: {$files[file].Xstep} mm Y: {$files[file].Ystep} mm Z: {$files[file].Zstep} mm
                        {elseif $files[file].Xstep != ""}{$files[file].Xstep}{else}&nbsp;{/if}
                      </td> 
                      </tr>
                      <tr>
                      {if $files[file].OutputType != ""}<th>Output Type</th><td>{$files[file].OutputType}</td>{/if}
                      {if $files[file].AcquisitionDate>0}<th>Acq Date</th><td>{$files[file].AcquisitionDate|date_format}</td>{/if}
                      </tr>
                      <tr>
                      {if $files[file].AcquisitionProtocol != "NA"}<th>Protocol</th><td>{$files[file].AcquisitionProtocol}</td>{/if}
                      {if $files[file].CoordinateSpace != ""}<th>Space</th><td>{$files[file].CoordinateSpace}</td>{/if}
                      </tr>
                      {if $files[file].Pipeline != ""}<th>Pipeline</th><td>{$files[file].Pipeline}</td>{/if}
                      {if $files[file].Algorithm != ""}<tr><th>Algorithm</th><td>{$files[file].Algorithm}</td></tr>{/if}
                     <tr>
                       <th>Inserted</th>
                       <td>{if $files[file].FileInsertDate>0}{$files[file].FileInsertDate|date_format}{elseif $smarty.section.file.index==0}Insert date{else}&nbsp;{/if}
                       </td>
                       {if $files[file].SeriesDescription != ""}<th>SerDesc</th><td>{$files[file].SeriesDescription}</td>{/if}
                     </tr>
                     <tr>
                      {if $files[file].SeriesDescription != ""}<th>SerDesc</th><td>{$files[file].SeriesDescription}</td>{/if}
                      {if $files[file].SeriesNumber != ""}<th>Ser Num</th><td>{$files[file].SeriesNumber}</td>{/if}
                     </tr>
                     <tr>
                      {if $files[file].EchoTime != "" && $files[file].EchoTime != "0.00"}<th>Echo Time</th><td>{$files[file].EchoTime} ms</td>{/if}
                      {if $files[file].RepetitionTime != "" && $files[file].RepetitionTime != "0.00"}<th>Rep Time</th><td>{$files[file].RepetitionTime} ms</td>{/if}
                     </tr>
                     <tr>
                      {if $files[file].SliceThickness != ""&& $files[file].SliceThickness != "0.00"}<th>Slice Thick</th><td>{$files[file].SliceThickness} mm</td>{/if}
                      {if $files[file].Time != "" && $files[file].Time != "0.00"}<th>Nb of vol.</th><td>{$files[file].Time} volumes</td>{/if}
                     </tr>
                     <tr>
                      {if $files[file].Comment != ""}<th>Comment</th><td>{$files[file].Comment}</td>{/if}
                      {if $files[file].SlicewiseRejected != ""}<th>Slicewise correlations (Nb)</th><td>{$files[file].SlicewiseRejected}</td>{/if}
                     </tr>
                     <tr>
                      {if $files[file].InterlaceRejected != ""}<th>Interlace correlations (Nb)</th><td>{$files[file].InterlaceRejected}</td>{/if}
                      {if $files[file].IntergradientRejected != ""}<th>Gradient-wise correlations (Nb)</th><td>{$files[file].IntergradientRejected}</td>{/if}
                     <tr>
                      {if $files[file].TotalRejected != ""}<th width="100px">Nb of rejected directions</th><td>{$files[file].TotalRejected}{else}&nbsp;</td>{/if}
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
