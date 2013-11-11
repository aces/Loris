<div id="mri">
<h2 class="statsH2">General Statistics with QC Status for {$mri_center_name} {$mri_project_name}</h2>
    <script type="text/javascript" src="js/modules/table_statistics.js"></script>
    <script type="text/javascript" src="js/modules/form_stats_MRI.js"></script>
    {html_options id="MRIsite" options=$Sites name="MRIsite" selected=$mri_center}
    {html_options id="MRIProject" options=$Projects name="MRIProject" selected=$CurrentProject.ID}
    <button onClick="updateMRITab()">Submit Query</button>

<table class="data generalStats">
    <thead>
        <tr>
            <th></th>
            {foreach from=$mri_all_scans_inserted item=v key=k}
                {foreach from=$v item=count key=scan}
                    {if $scan neq 'Name'}
                        <th>{$scan}</th>
                    {/if}
                {/foreach}
            {/foreach}
         </tr>
    </thead>
    <tbody>
        <tr>
            <td>'Complete' in MRI parameter form</td>
            {foreach from=$mri_all_scans_done item=v key=k}
                {foreach from=$v item=count key=scan}
                    {if $scan neq 'Name'}
                        {if $scan eq 'Total'}
                        <td class="total">{$count}</td>
                        {else}
                        <td>{$count}</td>
                    {/if}
                    {/if}
                {/foreach}
            {/foreach}
         </tr>
         <tr>
            <td>Scans inserted</td>
            {foreach from=$mri_all_scans_inserted item=v key=k}
                {foreach from=$v item=count key=scan}
                    {if $scan neq 'Name'}
                        {if $scan eq 'Total'}
                        <td class="total">{$count}</td>
                        {else}
                        <td>{$count}</td>
                    {/if}
                    {/if}
                {/foreach}
            {/foreach}
         </tr>
         <tr>
            <td>Scans passed QC</td>
            {foreach from=$count_pass item=v key=k}
                {foreach from=$v item=count key=scan}
                    {if $scan neq 'Name'}
                        {if $scan eq 'Total'}
                        <td class="total">{$count}</td>
                        {else}
                        <td>{$count}</td>
                    {/if}
                    {/if}
                {/foreach}
            {/foreach}
         </tr>

     {foreach from=$feedback_mri_comments item=count key=comment}
         <tr>
            <td>{$comment}</td>
            {foreach from=$count item=number key=scan}
                     <td>{$number}</td>
            {/foreach}
         </tr>
        {/foreach}
    </tbody>
</table>

<h2 class="statsH2">MRI Integrity Statistics for {$mri_center_name} {$mri_project_name}</h2>
<table class="data generalStats">
    <thead>
      <tr>
            <th>No Parameter Form Completed</th>
            <th>Nothing in MRI Browser for Form</th>
            <th>No tarchive Entry for Form</th>
            <th>Breakdown of Problems</th>
      </tr>
    </thead>
    <tbody>
      {foreach item=center from=$Centers}
      <tr>
            <td>{$mri_errors[$center.NumericID].no_parameter}</td>
            <td>{$mri_errors[$center.NumericID].no_browser}</td>
            <td>{$mri_errors[$center.NumericID].no_tarchive}</td>
            <td><a href="?test_name=statistics_mri_site&CenterID={$mri_center}&ProjectID={$mri_project}">Click Here for breakdown per participant</a></td>
      </tr>
      {/foreach}
    </tbody>
</table>

{$MRI_Done_Table}
</div>

