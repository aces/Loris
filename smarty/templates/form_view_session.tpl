{$headerTable}

<table class="fancytable">
{section name=file loop=$files}
<tr>
    <td>
        QCControlStuff
    </td>
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
    <td>
        ImageData
    </td>
</tr>
{/section}
</table>
