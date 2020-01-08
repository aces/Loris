<div id="scan-line-chart-panel">
    <h5 class="chart-title">Scan sessions per site</h5>
    {if $total_scans neq 0}
        <div id="scanChart"></div>
    {else}
        <p>There have been no scans yet.</p>
    {/if}
</div>
<div id="recruitment-line-chart-panel" class="hidden">
    <h5 class="chart-title">Recruitment per site</h5>
    {if $recruitment['overall']['total_recruitment'] neq 0}
        <div id="recruitmentChart"></div>
    {else}
        <p>There have been no candidates registered yet.</p>
    {/if}
</div>
<small><i>Note that the Recruitment and Study Progression charts include data from ineligible, excluded, and consent withdrawn candidates.</i></small>
