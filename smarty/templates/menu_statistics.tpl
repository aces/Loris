
{literal}
<!-- jQuery CSV parser plugin, which handles escaping/quotes -->
<script type="text/javascript" src="js/jquery/jquery.csv.js"></script>
<!-- highcharts graphing library -->
<script type="text/javascript" src="js/jquery/Highcharts/js/highcharts.src.js"></script>
<script type="text/javascript" src="js/jquery/LorisGraph.js"></script>

<script language="javascript" type="text/javascript">

  $(document).ready(function() {
    $(".tabs").tabs();

  });

</script>
{/literal}

<div class="tabs">
    <h1>Available Statistics</h1>
    <ul>
        <li><a href="#general">General Description</a></li>
        <li><a href="#demographics">Demographic Statistics</a></li>
        <li><a href="#data_entry">Behavioural Statistics</a></li>
        <li><a href="#mri">MRI Statistics</a></li>
    </ul>

    <div id="general">
        <h2 class="statsH2"></br>Welcome to the statistics page.</h2>
        <p class="statsParagraph"> This will display all of the statistics related to data acquisition, data processing and data entry as it relates to both the behavioural and imaging parts of this project. This is a work in progress, and as such more statistics will appear with time. Please feel free to contact us with feedback and suggestions.</p>
        <p>The demographics tab currently includes statistics about the number of candidates registered in each cohort and provides statistics by site and gender. In the drop-down menu, you are also able to view per instrument the number of complete and incomplete instruments per site, timepoint, and cohort.</p>
        <p>The behavioural tab currently includes statistics on the number of candidates who have completed each instrument per site and timepoint. The number of instruments for which data entry hasn't commenced is also displayed. This is a great tool for completing data entry. The same statistics are also available for double data entry.
        <p>The MRI statistics tab currently displays the number of scans per site. For T1 scans based on the MRI parameter form entries, there is a breakdown of scans per site, cohort and timepoint. There is also a table depicting common issues that need to be dealt with regarding incomplete MRI parameter forms, scans not transferred properly, or missing scan archives.</p>
    </div>

    <div id="demographics">
        <h2 class="statsH2">General statistics{if $CurrentSite} for {$CurrentSite.Name}{/if}</h2>
        <form action="#demographics">
            {html_options options=$Sites name="site" selected=$CurrentSite.ID}
            <input type="hidden" name="test_name" value="statistics" />
            <input type="submit" />
        </form>
        <table class="data generalStats">
        <thead>
                <th></th>
                <th>Status</th>
                <th>Registered candidates with visit</th>
                <th>Registered candidates with MRI session</th>
        </thead>
        <tbody>
                <tr>
                {foreach from=$Subprojects item=name key=keyid}
                        <th rowspan="6">{$name}</th>
                </tr>
                <tr>
                <td>In Progress</td>
                <td>{$registered[$keyid].progress}</td>
                <td>{$scanned[$keyid].progress}</td>
                </tr>
                <tr>
                <td>Pass</td>
                <td>{$registered[$keyid].pass}</td>
                <td>{$scanned[$keyid].pass}</td>
                </tr>
                <tr>
                <td>Fail</td>
                <td>{$registered[$keyid].fail}</td>
                <td>{$scanned[$keyid].fail}</td>
                </tr>
                <tr>
                <td>Withdraw</td>
                <td>{$registered[$keyid].withdraw}</td>
                <td>{$scanned[$keyid].withdraw}</td>
                </tr>
                <tr>
                <td class="total">Total</td>
                <td class="total">{$registered[$keyid].visit_total}</td>
                <td class="total">{$scanned[$keyid].total}</td>
                </tr>
                {/foreach}
                <th class="data">Total</th>
                <td class="total">{$registered_candidates} registered candidates</td>
                <td class="total">{$registered.total_visit}</td>
                <td class="total">{$scanned.total}</td>
            <tr>
            <tr>
            </tr>
        </tbody>
        </table>
</br>

        {$RecruitsTable}
</div>
<div id="data_entry">
<h2 class="statsH2">Data Entry Statistics:</h2>
        <form action="#data_entry">
            {html_options options=$Sites name="site2" selected=$behavioural_center}
            <input type="hidden" name="test_name" value="statistics" />
            <input type="submit" />
            </form>
<table class="data">
	<tr>
        <th></th>
        <th>Forms Created</th>
        <th>Forms Completed</th>
        <th>% Completion</th>
	</tr>
    {foreach from=$Visits item=visit}
        <tr>
		    <td>{$visit}</td>
		    <td>{$behaviour[$visit].total|default:"0"}</td>
		    <td>{$behaviour[$visit].complete|default:"0"}</td>
		    <td>{$behaviour[$visit].percent|default:"0"}%</td>
    	</tr>
    {/foreach}
    <tr>
	    <td class = "total">Total</td>
	    <td class="total">{$behaviour.all.total|default:"0"}</td>
	    <td class="total">{$behaviour.all.complete|default:"0"}</td>
	    <td class="total">{$behaviour.all.percent|default:"0"}%</td>
	</tr>
</tr>    
</table>
<a href='main.php?test_name=statistics_site&CenterID={$behavioural_center}'>Breakdown per visit, form and participant for selected site</a>

<h2 class="statsH2">Double Data Entry Statistics:</h2>
<table class="data">
    <tr>
        <th></th>
        <th>Forms Created</th>
        <th>Forms Completed</th>
        <th>% Completion</th>
    </tr>
    {foreach from=$Visits item=visit}
        <tr>
            <td>{$visit}</td>
            <td>{$dde[$visit].total|default:"0"}</td>
            <td>{$dde[$visit].complete|default:"0"}</td>
            <td>{$dde[$visit].percent|default:"0"}%</td>
        </tr>
     {/foreach}
        <tr>
            <td class = "total">Total</td>
            <td class="total">{$dde.all.total|default:"0"}</td>
            <td class="total">{$dde.all.complete|default:"0"}</td>
            <td class="total">{$dde.all.percent|default:"0"}%</td>
        </tr>
</tr>
</table>
<a href='main.php?test_name=statistics_dd_site&CenterID={$behavioural_center}'>Breakdown per visit, form and participant for selected site</a>

<br />
        {$InstrumentsTable}
</div>


<div id="mri">
<h2 class="statsH2">General Statistics with QC Status (All Visits):</h2>
<table class="data generalStats">
	<thead>
        <tr>
            <th>Site</th>
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
            <td rowspan ="8">{$mri_all_scans_done[item].Name}</td>
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
            <td>{$center.ShortName}</td>
            <td>{$mri_errors[$center.NumericID].no_parameter}</td>
            <td>{$mri_errors[$center.NumericID].no_browser}</td>
            <td>{$mri_errors[$center.NumericID].no_tarchive}</td>
            <td><a href="?test_name=statistics_mri_site&CenterID={$center.NumericID}">Please Click Here</a></td>
      </tr>
      {/foreach}
    </tbody>
</table>

{$MRI_Done_Table}


</div>
