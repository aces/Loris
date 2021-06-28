<!-- Main table -->
{if $show3DViewer|default}
{*<td nowrap="nowrap">the first opening td already opened in main.tpl *}<input type="button" name="button" value="3D Viewer" class="button" id = "dccid" name = "dccid" style = "background-color: #816e91" onclick="window.open('BrainBrowser/display.html?sessionID={$subject.sessionID}')" /></td>

</br>
{/if}
<div>
{$headerTable}
</div>

<div class="panel panel-default">
    <div class="panel-heading" id="panel-main-heading">
{if $files|@count}
        <h3 class="panel-title">{$files|@count} file(s) displayed.</h3>
        <span class="pull-right clickable mri-arrow glyphicon glyphicon-chevron-up"></span>
    </div> <!-- closing panel-heading div-->
    <div class="panel-body">
      {section name=file loop=$files}
          <div id="image-{$files[file].FileID}"></div>
          <script>
          ReactDOM.render(
                  RImagePanel({
                      'BaseURL' : "{$baseurl}",

                      'FileID'   : "{$files[file].FileID}",
                      'Filename' : "{$files[file].Filename}",
                      'QCStatus' : "{$files[file].QCStatus}",
                      'Checkpic' : "{$files[file].CheckPic}",

                      'HasQCPerm': {if $has_qc_permission}true{else}false{/if},
                      'FileNew'  : {if $files[file].New}true{else}false{/if},
                      "Selected" : "{if $files[file].Selected}{$files[file].Selected}{/if}",

                      "Caveat" : "{$files[file].Caveat}",
                      "CaveatViolationsResolvedID" : "{$files[file].CaveatViolationsResolvedID}",
                      "SNR" : "{if $files[file].SNR}{$files[file].SNR}{/if}",
                      'HeaderInfo' : {
                          'XStep' : "{$files[file].Xstep}",
                          'YStep' : "{$files[file].Ystep}",
                          'ZStep' : "{$files[file].Zstep}",
                          'OutputType' : "{$files[file].OutputType}",
                          'AcquisitionDate' : "{$files[file].AcquisitionDate|date_format}",
                          'CoordinateSpace' : "{$files[file].CoordinateSpace}",
                          "InsertedDate" : "{$files[file].FileInsertDate|date_format}",
                          "AcquisitionProtocol" : "{$files[file].AcquisitionProtocol}",
                          "SeriesDescription" : "{$files[file].SeriesDescription}",
                          "SeriesNumber" : "{$files[file].SeriesNumber}",
                          "SeriesUID" : "{$files[file].SeriesUID}",
                          "EchoTime" : "{$files[file].EchoTime}",
                          "RepetitionTime" : "{$files[file].RepetitionTime}",
                          "SliceThickness" : "{$files[file].SliceThickness}",
                          "NumVolumes" : "{$files[file].Time}",
                          "Pipeline" : "{$files[file].Pipeline}",
                          "Algorithm" : "{$files[file].Algorithm}",
                          "TotalRejected" : "{$files[file].TotalRejected}",
                          "InterlaceRejected" : "{$files[file].InterlaceRejected}",
                          "IntergradientRejected"  : "{$files[file].IntergradientRejected}",
                          "SlicewiseRejected" : "{$files[file].SlicewiseRejected}"
                      },

                      'Fullname' : "{$files[file].FullFilename}",
                      "XMLProtocol" : "{$files[file].XMLprotocol}",
                      "XMLReport" : "{$files[file].XMLreport}",
                      "NrrdFile" : "{$files[file].NrrdFile}",
                      "OtherTimepoints" : "{$files[file].OtherTimepoints}",
                      "SeriesUID": "{$files[file].SeriesUID}"
                  }),
                  document.getElementById("image-{$files[file].FileID}" )
                  );
          </script>
       {/section}
   </div> <!-- closing panel-body div-->
{else}
    <h3 class="panel-title">No data available</h3>
   </div> <!-- closing panel-heading div-->
{/if}
</div>
