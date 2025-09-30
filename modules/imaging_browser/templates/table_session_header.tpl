<table class="table table-hover table-bordered dynamictable" id='table-header-left'>
     <thead>
        <tr class="info">
            <th>{t text="QC Status" domain="imaging_browser"}</th>
            <th>{t text="Patient Name" domain="imaging_browser"}</th>
            <th>{t text="PSCID" domain="loris"}</th>
            <th>{t text="DCCID" domain="loris"}</th>
            <th>{t text="Visit Label" domain="loris"}</th>
            <th>{t text="Site" domain="loris"}</th>
            <th>{t text="QC Pending" domain="imaging_browser"}</th>
            <th>{t text="DOB" domain="loris"}</th>
            <th>{t text="Sex" domain="loris"}</th>
            <th>{t text="Output Type" domain="imaging_browser"}</th>
            <th>{t text="Scanner" domain="imaging_browser"}</th>
            <th>{t text="Cohort" domain="loris"}</th>
            {if $useEDC|default}
            <th>{t text="EDC" domain="imaging_browser"}</th>
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
            <td>{$subject.CohortTitle|escape}</td>
            {if $useEDC|default}
            <td>{$subject.edc|escape}</td>
            {/if}
        </tr>
    </tbody>
</table>
