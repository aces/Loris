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
                    <td>JIV Viewer</td>
                    <td>BrainBrowser Volume Viewer</td>
                    <td>Download</th>
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
