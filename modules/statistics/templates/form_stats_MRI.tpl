<div id="mri">
    <script type="text/javascript" src="{$baseurl}/statistics/js/form_stats_MRI.js"></script>
    <h2 class="statsH2">General Statistics with QC Status</h2>
    <div class="col-sm-2">
        {html_options id="MRIsite" options=$Sites name="MRIsite" selected=$CurrentSite.ID class="form-control"}
    </div>
    {if $useProjects == "true"}
        <div class="col-sm-2">
            {html_options id="MRIProject" options=$Projects name="MRIProject" selected=$CurrentProject.ID class="form-control"}
        </div>
    {/if}
    <br><br>
    <div id="scancheckbox">
        <input type="checkbox" id="selectall"/> Select All
        {html_checkboxes id="MRIScans" options=$scan_types name="MRIScans" selected=$Scans_sel_box class="timesheet-daily-checkbox"}
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
        <table id="scandata" class="table table-primary table-bordered dynamictable">
            <thead>
            <tr class="info">
                <th id="scantype">Scan Type</th>
                <th colspan="2">QC Status</th>
                {foreach from=$Subprojects item=name key=proj}
                    <th>{$name}</th>
                {/foreach}
                <th class="data">Total</th>
            </tr>
            </thead>
            <tbody>
            {foreach item=scan key=scanid from=$Scans_selected}
                <tr>
                    <td rowspan="4" style="vertical-align:middle" >{$scan}</td>
                    <td colspan="2"><b>Scans Inserted</b></td>
                    {foreach from=$Subprojects item=name key=proj}
                        {if $scan_data_results[$scanid].insert_count[$proj] > 0}
                            <td><b>{$scan_data_results[$scanid].insert_count[$proj]}</b></td>
                        {else}
                            <td><b>0</b></td>
                        {/if}
                    {/foreach}
                    <td class="total">{$scan_data_results[$scanid].insert_count.total}</td>

                </tr>
                <tr class="pass">
                    <td rowspan="3" style="vertical-align:middle; background-color: #FFFFFF">QC status</td>
                    <td>Passed</td>
                    {foreach from=$Subprojects item=name key=proj}
                        {if $scan_data_results[$scanid].qc_pass_count[$proj] > 0}
                            <td>{$scan_data_results[$scanid].qc_pass_count[$proj]}</td>
                        {else}
                            <td>0</td>
                        {/if}
                    {/foreach}
                    <td class="total">{$scan_data_results[$scanid].qc_pass_count.total}</td>
                </tr>
                <tr class="fail">
                    <td>Failed</td>
                    {foreach from=$Subprojects item=name key=proj}
                        {if $scan_data_results[$scanid].qc_fail_count[$proj] > 0}
                            <td>{$scan_data_results[$scanid].qc_fail_count[$proj]}</td>
                        {else}
                            <td>0</td>
                        {/if}
                    {/foreach}
                    <td class="total">{$scan_data_results[$scanid].qc_fail_count.total}</td>
                </tr>
                <tr class="noqc">
                    <td>Not QCed</td>
                    {foreach from=$Subprojects item=name key=proj}
                        {if $scan_data_results[$scanid].no_qc_count[$proj] > 0}
                            <td>{$scan_data_results[$scanid].no_qc_count[$proj]}</td>
                        {else}
                            <td>0</td>
                        {/if}
                    {/foreach}
                    <td class="total">{$scan_data_results[$scanid].no_qc_count.total}</td>
                </tr>
            {/foreach}
            </tbody>
        </table>
    </div>
    {if $mri_table_exists}
        {$MRI_Done_Table}
    {else}
        <br><br>
        <h2>Oops</h2>
        <p> It seems like the "mri_parameter_form" table is missing in the database currently in use. <br>
            This table is necessary in order to compute the Breakdown table of the MRI statistics page.</p>
    {/if}
</div>

