<div id="mri">
    {if $mri_table_exists}

        <h2 class="statsH2">General Statistics with QC Status</h2>
        <div class="col-sm-2">
            {html_options id="MRIsite" options=$Sites name="MRIsite" selected=$mri_center class="form-control"}
        </div>
        <div class="col-sm-2">
            {html_options id="MRIProject" options=$Projects name="MRIProject" selected=$CurrentProject.ID class="form-control"}
        </div>
        <br><br>
        <div id="scancheckbox">
            <input type="checkbox" id="selectall" onclick="updateCheckboxes()"/> Select All
            {html_checkboxes id="MRIScans" options=$scan_types name="MRIScans" selected=$Scans_selected class="timesheet-daily-checkbox"}
            {*<input type="checkbox" name="all" value="bla" checked><b>All Scan Types</b>
            {foreach item=scan key=scanid from=$scan_types}
                <input type="checkbox" name="{$scan}" value="{$scanid}" class="timesheet-daily-checkbox">{$scan}
            {/foreach}
            *}
        </div>
        <br><br>
        <button onClick="updateMRITab()" class="btn btn-primary btn-small">Submit Query</button>
        <br><br>
        <div class="table-responsive">
            <table class="table table-primary table-bordered">
                <thead>
                <tr class="info">
                    <th>Scan Type</th>
                    <th colspan="2">????????</th>
                    {foreach from=$Subprojects item=name key=proj}
                        <th>{$name}</th>
                    {/foreach}
                    <th class="data">Total</th>
                </tr>
                </thead>
                <tbody>
                {foreach item=scan key=scanid from=$Scans_selected}
                    {*<tr>
                        <td>Scans Completed</td>
                        {foreach from=$Subprojects item=name key=proj}
                            {if $scan_data_results[$scanid].scan_all[$proj] > 0}
                                {if $scan_data_results[$scanid].scan_complete[$proj] > 0}
                                    <td>{$scan_data_results[$scanid].scan_complete[$proj]}<font size="1"><b>/{$scan_data_results[$scanid].scan_all[$proj]}</b></font></td>
                                {else}
                                    <td>0<font size="1"><b>/{$scan_data_results[$scanid].scan_all[$proj]}</b></font></td>
                                {/if}
                            {else}
                                <td>0<font size="1"><b>/0</b></font></td>
                            {/if}
                        {/foreach}
                        <td>{$scan_data_results[$scanid].scan_complete.total}<font size="1"><b>/{$scan_data_results[$scanid].scan_all.total}</b></font></td>
                    </tr>*}
                    <tr>
                        <td rowspan="4" style="vertical-align:middle">{$scan}</td>
                        <td colspan="2">Scans Inserted</td>

                    </tr>
                    <tr>
                        <td rowspan="3" style="vertical-align:middle">QC status</td>
                        <td>Passed</td>
                    </tr>
                    <tr>
                        <td>Failed</td>
                    </tr>
                    <tr>
                        <td>Not QCed</td>
                    </tr>
                {/foreach}
                </tbody>
            </table>
        </div>

        {*
            <div class="row">
                <div class="col-sm-6">
                    <table class="table table-primary table-bordered">

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
        *}
        {*
            <div class="row">
                <h2 class="statsH2 col-sm-12">Imaging Integrity Statistics for {$mri_center_name} {$mri_project_name}</h2>
            </div>
            <div class="table-responsive">
                <table class="table table-primary table-bordered">
                    <thead>
                    <tr class="info">
                        <th>No Parameter Form Completed</th>
                        <th>Nothing in Imaging Browser for Form</th>
        *}                {* <th>No tarchive Entry for Form</th> *}
        {*                <th>Breakdown of Problems</th>
                    </tr>
                    </thead>
                    <tbody>
                    {foreach item=center from=$Centers}
                        <tr>
                            <td>{$mri_errors[$center.NumericID].no_parameter}</td>
                            <td>{$mri_errors[$center.NumericID].no_browser}</td>
        *}                    {* <td>{$mri_errors[$center.NumericID].no_tarchive}</td> *}
        {*                    <td><a href="{$baseurl}/statistics/?submenu=statistics_mri_site&CenterID={$mri_center}&ProjectID={$mri_project}">Click Here for breakdown per participant</a></td>
                        </tr>
                    {/foreach}
                    </tbody>
                </table>
            </div>
        *}
        {$MRI_Done_Table}
    {else}
        <h2>Oops</h2>
        <p> It seems like the "mri_parameter_form" table is missing in the database currently in use. This table is necessary in order to compute the MRI statistics on this page.</p>
    {/if}
</div>

