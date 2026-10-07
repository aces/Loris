<div id="mri">
    <script type="text/javascript" src="{$baseurl|default}/statistics/js/form_stats_MRI.js"></script>
    <h2 class="statsH2">{dgettext('statistics', 'General Statistics with QC Status')}</h2>
    <div class="col-sm-2">
        {html_options id="MRIsite" options=$Sites name="MRIsite" selected=$CurrentSite.ID|default class="form-control"}
    </div>
        <div class="col-sm-2">
            {html_options id="MRIProject" options=$Projects name="MRIProject" selected=$CurrentProject.ID|default class="form-control"}
        </div>
    <br><br>
    <div id="scancheckbox">
        <input type="checkbox" id="selectall" style="margin-bottom: 8px;"/> {dgettext('statistics', 'Select All')}
        {html_checkboxes id="MRIScans" options=$scan_types name="MRIScans" selected=$Scans_sel_box class="timesheet-daily-checkbox" style="margin: 4px 0 4px;"}
        {*<input type="checkbox" name="all" value="bla" checked><b>{dgettext('statistics', 'All Scan Types')}</b>
        {foreach item=scan key=scanid from=$scan_types}
            <input type="checkbox" name="{$scan}" value="{$scanid}" class="timesheet-daily-checkbox">{$scan}
        {/foreach}
        *}
    </div>
    <br><br>
    <button onClick="updateMRITab()" class="btn btn-primary btn-small">{dgettext('statistics', 'Submit Query')}</button>
    <br><br>
        <table id="scandata" class="table table-primary table-bordered dynamictable">
            <thead>
            <tr class="info">
                <th id="scantype">{dgettext('loris', 'Scan Type')}</th>
                <th colspan="2">{dgettext('loris', 'QC Status')}</th>
                {foreach from=$Cohorts item=name key=proj}
                    <th>{$name}</th>
                {/foreach}
                <th class="data">{dgettext('loris', 'Total')}</th>
            </tr>
            </thead>
            <tbody>
            {foreach item=scan key=scanid from=$Scans_selected}
                <tr>
                    <td rowspan="4" style="vertical-align:middle" >{$scan}</td>
                    <td colspan="2"><b>{dgettext('statistics', 'Scans Inserted')}</b></td>
                    {foreach from=$Cohorts item=name key=proj}
                        {if $scan_data_results[$scanid].insert_count[$proj] > 0}
                            <td><b>{$scan_data_results[$scanid].insert_count[$proj]}</b></td>
                        {else}
                            <td><b>0</b></td>
                        {/if}
                    {/foreach}
                    <td class="total">{$scan_data_results[$scanid].insert_count.total}</td>

                </tr>
                <tr class="pass">
                    <td rowspan="3" style="vertical-align:middle; background-color: #FFFFFF">{dgettext('statistics', 'QC status')}</td>
                    <td>{dgettext('statistics', 'Passed')}</td>
                    {foreach from=$Cohorts item=name key=proj}
                        {if $scan_data_results[$scanid].qc_pass_count[$proj] > 0}
                            <td>{$scan_data_results[$scanid].qc_pass_count[$proj]}</td>
                        {else}
                            <td>0</td>
                        {/if}
                    {/foreach}
                    <td class="total">{$scan_data_results[$scanid].qc_pass_count.total}</td>
                </tr>
                <tr class="fail">
                    <td>{dgettext('statistics', 'Failed')}</td>
                    {foreach from=$Cohorts item=name key=proj}
                        {if $scan_data_results[$scanid].qc_fail_count[$proj] > 0}
                            <td>{$scan_data_results[$scanid].qc_fail_count[$proj]}</td>
                        {else}
                            <td>0</td>
                        {/if}
                    {/foreach}
                    <td class="total">{$scan_data_results[$scanid].qc_fail_count.total}</td>
                </tr>
                <tr class="noqc">
                    <td>{dgettext('statistics', 'Not QCed')}</td>
                    {foreach from=$Cohorts item=name key=proj}
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
    {if $mri_table_exists}
      {$MRI_Done_Table}
    {else}
        <br><br>
        <h2>{dgettext('statistics', 'Oops')}</h2>
        <p> {dgettext('statistics', 'It seems like the "mri_parameter_form" table is missing in the database currently in use.')}<br>
            {dgettext('statistics', 'This table is necessary in order to compute the Breakdown table of the MRI statistics page.')}
        </p>
    {/if}
</div>

