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
            {if $useEDC|default}
            <th>EDC</th>
            {/if}
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{$subject.mriqcstatus|escape}</td>
            <td>{$subject.pscid|escape}_{$subject.candid|escape}_{$subject.visitLabel|escape}</td>
            <td>{$subject.pscid|escape}</td>
            <td>{$subject.candid|escape}</td>
            <td>{$subject.visitLabel|escape}</td>
            <td>{$subject.site|escape}</td>
            <td>{if $subject.mriqcpending=="Y"}<img src="{$baseurl}/images/check_blue.gif" width="12" height="12">{else}&nbsp;{/if}</td>
            <td>{$subject.dob|escape}</td>
            <td>{$subject.sex|escape}</td>
            <td>{$outputType|escape}</td>
            <td>{$subject.scanner|escape}</td>
            <td>{$subject.SubprojectTitle|escape}</td>
            {if $useEDC|default}
            <td>{$subject.edc|escape}</td>
            {/if}
        </tr>
    </tbody>
</table>
