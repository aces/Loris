{$headerTable}

{* LEFT SUBTABLE *}
<table class="fancytable">
{section name=file loop=$files}
{cycle values="#eeeeee,#d0d0d0" assign="rowBgColor"}
<tr bgcolor="{$rowBgColor}">
    <td>
        <table class='std'>
    	<tr>
	    <td>Add panel<input class='mripanel' type='checkbox' name='add_panel' value='1'\
            {*if $add_panel?}checked{/if*}></td>
    	</tr>
    	<tr>
	    <th>{$form.Scan_Types.label}</th>
    	</tr>
    	<tr>
	    <td>{$form.Scan_Types.html}</td>
        </tr>
        <tr>
            <th>{$form.QC_Status.label}</th>
        </tr>
        <tr>
	    <td>{if $files[file].New}<font color='red'>NEW</font>{/if}
	    {$form.QC_Status.html}</td>
        </tr>
{* LINK TO COMMENTS *}
        <tr>
            <td>{if $files[file].FileID}<a href="#{$smarty.section.file.index}" 
 onClick='javascript:open_popup("feedback_mri_popup.php?fileID={$files[file].FileID}")'>Link to comments</a><br>{else}&nbsp;{/if}
            </td>
        </tr>
    </table>  
    </td>
{* MIDDLE TABLE *}
    <td>
        <table border="0">
            <thead>
                <tr>
                    <th>Filename</th>
                    <td>{$files[file].Filename}</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="4">
                        <img src="/mri/jiv/get_file.php?file=pic/{$files[file].CheckPic}" border="0">
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th>Voxel size</th>
                    <td colspan="3">X:
                        Y:
                        Z:
                    </td>
                </tr>
            </tfoot>
            <tfoot>
                <tr>
                    <td>
                        <a href="#{$smarty.section.file.index}" onClick='javascript:show_jiv(new Array("{$files[file].JivFilename}"), new Array("{$files[file].JivAddress}"), false)' accesskey="{$smarty.section.file.index}">JIV Viewer</a>
                        </a>
                    </td>
                    <td>
                        <a href="#{$smarty.section.file.index}" 
                            onclick="window.open('minc.html?minc_id={$files[file].FileID}', 'BrainBrowser Volume Viewer', 'location=0,width=auto,height=auto')">
                            BrainBrowser Volume Viewer
                        </a>
                    </td>
                    <td>
                        <a href="mri/jiv/get_file.php?file={$files[file].FullFilename}">
                            Download
                        </a>
                    </th>
                </tr>
            </tfoot>

        </table>
    </td>
{* RIGHT SUBTABLE*}
    <td>
        ImageData
    </td>
</tr>
{/section}
</table>
