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
      <div id="image-panels"></div>
      <script>
          ReactDOM.createRoot(
            document.getElementById("image-panels")
          ).render(
            RImagePanels({
              fileIds: {$fileIds|json_encode}
            })
          )
      </script>
   </div> <!-- closing panel-body div-->
{else}
    <h3 class="panel-title">No data available</h3>
   </div> <!-- closing panel-heading div-->
{/if}
</div>
