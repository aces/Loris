<div id="mri">
<h2 class="statsH2">General Statistics with QC Status for {$mri_center_name} {$mri_project_name}</h2>
    <script type="text/javascript" src="{$baseurl}/statistics/js/table_statistics.js"></script>
    <script type="text/javascript" src="{$baseurl}/statistics/js/form_stats_MRI.js"></script>
    <div class="col-sm-2">
        {html_options id="MRIsite" options=$Sites name="MRIsite" selected=$mri_center class="form-control"}
    </div>
    <div class="col-sm-2">
        {html_options id="MRIProject" options=$Projects name="MRIProject" selected=$CurrentProject.ID class="form-control"}
    </div>
    <button onClick="updateMRITab()" class="btn btn-primary btn-small">Submit Query</button>
    <br><br>

<div class="row">
<div class="col-sm-6">
    <table class="table table-primary table-bordered">
        <thead>
            <tr class="info">
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
</div>
</div>

<div class="row">
<h2 class="statsH2 col-sm-12">Imaging Integrity Statistics for {$mri_center_name} {$mri_project_name}</h2>
</div>
<div class="table-responsive">
    <table class="table table-primary table-bordered">
        <thead>
          <tr class="info">
                <th>No Parameter Form Completed</th>
                <th>Nothing in Imaging Browser for Form</th>
                {* <th>No tarchive Entry for Form</th> *}
                <th>Breakdown of Problems</th>
          </tr>
        </thead>
        <tbody>
          {foreach item=center from=$Centers}
          <tr>
                <td>{$mri_errors[$center.NumericID].no_parameter}</td>
                <td>{$mri_errors[$center.NumericID].no_browser}</td>
                {* <td>{$mri_errors[$center.NumericID].no_tarchive}</td> *}
                <td><a href="{$baseurl}/statistics/?submenu=statistics_mri_site&CenterID={$mri_center}&ProjectID={$mri_project}">Click Here for breakdown per participant</a></td>
          </tr>
          {/foreach}
        </tbody>
    </table>
</div>

{$MRI_Done_Table}
</div>

