<table class="table table-hover table-bordered dynamictable" id='table-header-left'>
     <thead>
        <tr class="info">
            <th>QC Status</th>
            <th>Patient Name</th>
            <th>PSCID</th>
            <th>DCCID</th>
            <th>Visit Label</th>
            <th>Site</th>
            <th>QC Pending</th>
            <th>DOB</th>
            <th>Sex</th>
            <th>Output Type</th>
            <th>Scanner</th>
            <th>Subproject</th>
            {if $useEDC}
            <th>EDC</th>
            {/if}
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{$subject.mriqcstatus}</td>
            <td>{$subject.pscid}_{$subject.candid}_{$subject.visitLabel}</td>
            <td>{$subject.pscid}</td>
            <td>{$subject.candid}</td>
            <td>{$subject.visitLabel}</td>
            <td>{$subject.site}</td>
            <td>{if $subject.mriqcpending=="Y"}<img src="{$baseurl}/images/check_blue.gif" width="12" height="12">{else}&nbsp;{/if}</td>
            <td>{$subject.dob}</td>
            <td>{$subject.sex}</td>
            <td>{$outputType}</td>
            <td>{$subject.scanner}</td>
            <td>{$subject.SubprojectTitle}</td>
            {if $useEDC}
            <td>{$subject.edc}</td>
            {/if}
        </tr>
    </tbody>
</table>
