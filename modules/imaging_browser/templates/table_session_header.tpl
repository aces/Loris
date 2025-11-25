<table class="table table-hover table-bordered dynamictable" id='table-header-left'>
     <thead>
        <tr class="info">
            <th>{dgettext("imaging_browser","QC Status")}</th>
            <th>{dgettext("imaging_browser","Patient Name")}</th>
            <th>{dgettext("loris","PSCID")}</th>
            <th>{dgettext("loris","DCCID")}</th>
            <th>{dgettext("loris","Visit Label")}</th>
            <th>{dgettext("loris","Site")}</th>
            <th>{dgettext("imaging_browser","QC Pending")}</th>
            <th>{dgettext("loris","DOB")}</th>
            <th>{dgettext("loris","Sex")}</th>
            <th>{dgettext("imaging_browser","Output Type")}</th>
            <th>{dgettext("imaging_browser","Scanner")}</th>
            <th>{dgettext("loris","Cohort")}</th>
            {if $useEDC|default}
            <th>{dgettext("imaging_browser","EDC")}</th>
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
