<table class="fancytableleft">
    <tbody>
        <tr>
            <th>QC Status</th><td>{$subject.mriqcstatus}</td>
            <th>PSCID</th><td>{$subject.pscid}</td>
            <th>Site</th><td>{$subject.site}</td>
        </tr>
        <tr>
            <th>QC Pending</th>
            <td>{if $subject.mriqcpending=="Y"}<img src="images/check_blue.gif" width="12" height="12">{else}&nbsp;{/if}
            </td>
            <th>DCCID</th><td>{$subject.candid}</td>
            <th>Visit Label</th><td>{$subject.visitLabel}</td>
        </tr>
        <tr>
            <th>DOB</th><td>{$subject.dob}</td>
            <th>Gender</th><td>{$subject.gender}</td>
            <th>Output Type</th><td>{$outputType}</td>
        </tr>
        <tr>
            <th>Scanner</th><td>{$subject.scanner}</td>
            <th>Subproject</th><td>{$subject.SubprojectTitle}</td>
            <th>EDC</th><td>{$subject.edc}</td>
        </tr>
    </tbody>
</table>
