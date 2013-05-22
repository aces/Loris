<div id="mri">

<h2 class = "statsH2">MRI Statistics:</h2>

<h2 class="statsH2">General MRI Statistics</h2>
<table class="data generalStats">
    <thead>
         <tr>
            <th>Site</th>
            <th>Scans on the Workstations</th>
            <th>Scans Claimed</th>
            <th>v06, v12 and v24 Scans All Claimed</th>
            <th>Parameter Forms Completed</th>
         </tr>
    </thead>
    <tbody>
         {section name=item loop=$mri_data}
         <tr>
            <td>{$mri_data[item].name}</td>
            <td>{$mri_data[item].work_station_count}</td>
            <td>{$mri_data[item].claimed_count}</td>
            <td>{$mri_data[item].forms_count}</td>

         </tr>
         {/section}
    </tbody>
</table>

<h2 class="statsH2">Candidates That Have Completed Scans at All Three Timepoints (V06, V12, and V24):</h2>
<table class="data generalStats">
    <thead>
        <tr>
            <th>Site</th>
            <th>T1 Complete</th>
            <th>T2 Complete</th>
            <th>DTI Complete</th>
            <th>T1, T2, and DTI all Complete</th>
        </tr>
    </thead>
    <tbody>
        {section name=item loop=$mri_all_scans_done}
        <tr>
            <td>{$mri_all_scans_done[item].Name}</td>
            <td>{$mri_all_scans_done[item].T1}</td>
            <td>{$mri_all_scans_done[item].T2}</td>
            <td>{$mri_all_scans_done[item].DTI}</td>
            <td>{$mri_all_scans_done[item].All}</td>

        </tr>
        {/section}
    </tbody>
</table>

{$MRI_Done_Table}

<h2 class="statsH2">MRI Integrity Statistics:</h2>
<table class="data generalStats">
    <thead>
      <tr>
            <th>Site</th>
            <th>No Parameter Form Completed</th>
            <th>Nothing in MRI Browser for Form</th>
            <th>No tarchive Entry for Form</th>
            <th>Breakdown of Problems</th>
      </tr>
    </thead>
    <tbody>
      {foreach item=center from=$Centers}
      <tr>
            <td>{$center.LongName}</td>
            <td>{$mri_errors[$center.NumericID].no_parameter}</td>
            <td>{$mri_errors[$center.NumericID].no_browser}</td>
            <td>{$mri_errors[$center.NumericID].no_tarchive}</td>
            <td><a href="?test_name=statistics_mri_site&CenterID={$center.NumericID}">Please Click Here</a></td>
      </tr>
      {/foreach}
    </tbody>
</table>
</div>

