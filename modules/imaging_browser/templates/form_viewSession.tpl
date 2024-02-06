<!-- Main table -->
{if $show3DViewer|default}
{*<td nowrap="nowrap">the first opening td already opened in main.tpl *}<input type="button" name="button" value="3D Viewer" class="button" id = "dccid" name = "dccid" style = "background-color: #816e91" onclick="window.open('BrainBrowser/display.html?sessionID={$subject.sessionID}')" /></td>

</br>
{/if}

<div id="view-session"></div>
<script>
    ReactDOM.createRoot(
        document.getElementById("view-session")
    ).render(
        RSession({
            fileIDs: {$fileIDs|json_encode}
        })
    )
</script>
