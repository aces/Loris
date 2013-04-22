
{literal}
<!-- jQuery CSV parser plugin, which handles escaping/quotes -->
<script type="text/javascript" src="js/jquery/jquery.csv.js"></script>
<!-- highcharts graphing library -->
<script type="text/javascript" src="js/jquery/Highcharts/js/highcharts.src.js"></script>
<script type="text/javascript" src="js/jquery/LorisGraph.js"></script>

<script language="javascript" type="text/javascript">
var graph;
function changeFieldOptions(axis) {
    dropdown = document.getElementById("field" + axis);
    instrument = document.getElementById("instrument" + axis);
    dropdown.options.length = 0;
    $.get("GetScoreLabels.php?instrument=" + instrument.value, function(data) {
        options = data.split("\n");
        dropdown.options.length = 0;
        for(i = 0; i < options.length; i++) {
            if(options[i] != '') {
                dropdown.options[i] = new Option(options[i], options[i]);
            }
        }
        jQuery('#field' + axis).change();
    });
}

function updateGraph() {
    // Trigger the jQuery.change() closure created in CreateScatterplot by faking an administration change
    // (even if it's a different field that changed, it doesn't matter.
    jQuery("#Administration").change();
}
function CreateScatterplot() {
    var GetCSVUrl = function() {
        return 'GetCSV.php?InstrumentY=' + jQuery("#instrumenty").val() +
            '&InstrumentX=' + jQuery("#instrumentx").val() +
            '&FieldY=' + jQuery("#fieldy").val() + 
            '&FieldX=' + jQuery("#fieldx").val() + 
            '&Administration=' + jQuery('#Administration').val() +
            '&Visit_label=' + jQuery('#Visit_label').val() +
            '&site=' + jQuery('#GraphSite').val();
    };
    graph = new ACES_Scatterplot();
    graph.CSVUrl = GetCSVUrl();
    graph.CSVExtraFields = ['candID', 'sessionID', 'commentID']
    graph.RenderChart();
    FormatLink = function(url, val, extras) {
        full_url = 'main.php?test_name=' + url;
        if(extras) {
            for(exval in extras) {
                if(exval != 'x' && exval != 'y' && exval != 'name') {
                    full_url += '&' + exval + '=' + extras[exval];
                }
            }
        }
        base = '<a href="' + full_url + '">' + val + '</a><br />';
        return base;
    }
    graph.XFormat = function(val, pt) { return FormatLink(jQuery("#instrumenty").val(), jQuery("#fieldx").val() + ':' + val, pt.config); };
    graph.YFormat = function(val, pt) { return FormatLink(jQuery("#instrumenty").val(), jQuery("#fieldy").val() + ':' + val, pt.config); };
    jQuery("#fieldx").change(function() {
        graph.CSVUrl = GetCSVUrl();
        graph.UpdateXField($(this).val());
        graph.RenderChart();
    });
    jQuery("#fieldy").change(function() {
        graph.CSVUrl = GetCSVUrl();
        graph.UpdateYField($(this).val());
        graph.RenderChart();
    });
    jQuery("#Administration").change(function() {
        graph.CSVUrl = GetCSVUrl();
        graph.RenderChart();
    });
    jQuery("#GraphSite").change(function() {
        graph.CSVUrl = GetCSVUrl();
        graph.RenderChart();
    });
    jQuery("#Visit_label").change(function() {
        graph.CSVUrl = GetCSVUrl();
        graph.RenderChart();
    });
}

  $(document).ready(function() {
    $(".tabs").tabs();
    changeFieldOptions('y');
    changeFieldOptions('x');

    CreateScatterplot();
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
        <li><a href="#scatter">Scatterplots</a></li>
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
<table class="data">
	<tr>
	<th rowspan="2"></th>
    	{foreach from=$Centers item=center key=centername}
            <th colspan="3">{$center.LongName}</th>

	</tr>
	<tr>
             <th>Forms Created</th>
            <th>Forms Completed</th>
             <th>% Completion</th>
	</tr>
	{/foreach}
        {foreach from=$Visits item=visit}
           <tr>
		<td>{$visit}</td>
		<td>{$behaviour[$center.ID][$visit].total|default:"0"}</td>
		<td>{$behaviour[$center.ID][$visit].complete|default:"0"}</td>
		<td>{$behaviour[$center.ID][$visit].percent|default:"0"}%</td>
           <!-- <th colspan="3">{$visit|upper}</th>-->
    	</tr>
         {/foreach}
    	</tr>
        <tr>
	<td class = "total">Total</td>
	<td class="total">{$behaviour[$center.ID].all.total|default:"0"}</td>
	<td class="total">{$behaviour[$center.ID].all.complete|default:"0"}</td>
	<td class="total">{$behaviour[$center.ID].all.percent|default:"0"}%</td>
	</tr>
        <tr>
	<td colspan="4"><a href='main.php?test_name=statistics_site&CenterID={$center.NumericID}'>Breakdown of statistics per visit, form, participant</a></td>
	</tr>
</tr>    
</table>

  <!--      {$DataEntryTable}

        <form action="#dataEntry">
            {html_options options=$Sites name="site" selected=$CurrentSite.ID}
            <input type="hidden" name="site_name" value="statistics" />
            <input type="submit" />
        </form>-->

<h2 class="statsH2">Double Data Entry Statistics:</h2>
<table class="data">
       <tr>
        <th rowspan="2"></th>
        {foreach from=$Centers item=center key=centername}
            <th colspan="3">{$center.LongName}</th>

        </tr>
        <tr>
             <th>Forms Created</th>
            <th>Forms Completed</th>
             <th>% Completion</th>
        </tr>
        {/foreach}
        {foreach from=$Visits item=visit}
           <tr>
                <td>{$visit}</td>
                <td>{$dde[$center.ID][$visit].total|default:"0"}</td>
                <td>{$dde[$center.ID][$visit].complete|default:"0"}</td>
                <td>{$dde[$center.ID][$visit].percent|default:"0"}%</td>
        </tr>
         {/foreach}
        </tr>
        <tr>
        <td class = "total">Total</td>
        <td class="total">{$dde[$center.ID].all.total|default:"0"}</td>
        <td class="total">{$dde[$center.ID].all.complete|default:"0"}</td>
        <td class="total">{$dde[$center.ID].all.percent|default:"0"}%</td>
        </tr>
        <tr>
        <td colspan="4"><a href='main.php?test_name=statistics_dd_site&CenterID={$center.NumericID}'>Breakdown of statistics per visit, form, participant</a></td>
        </tr>
</tr>
      </table>
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
            <th>T1</th>
            <th>FLAIR</th>
            <th>64 DTI</th>
            <th>DTI Fieldmap</th>
            <th>BOLD Fieldmap</th>
            <th>Resting BOLD</th>
            <th>GRE T2*</th>
            <th>ASL</th>
            <th>Total</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan ="8">{$mri_all_scans_done[item].Name}</td>
            <td>'Complete' in MRI parameter form</td>
            {foreach from=$mri_all_scans_done item=v key=k}
                {foreach from=$v item=count key=scan}
                    {if $scan neq 'Name'}
                        {if $scan eq 'All'}
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
                        {if $scan eq 'All'}
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
                        {if $scan eq 'All'}
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
<div id="scatter">
<form>
<fieldset>
    <legend>Candidate Filters</legend>
    <div>
        Site: {html_options options=$Sites name="site" selected=$CurrentSite.ID id="GraphSite"}
        Administration: 
            <select name="Administration" id="Administration">
                <option value="">Any</option>
                <option value="All">All</option>
                <option value="Partial">Partial</option>
                <option value="None">None</option>
            </select>
        Visit Label: 
            <select name="Visit_label" id="Visit_label">
                <option value="">All</option>
                {foreach from=$Visits item=name key=val}
                <option value="{$name}">{$name}</option>
                {/foreach}
            </select>
    </div>
</fieldset>
<fieldset>
    <legend>Y Axis</legend>
    <div>
        Instrument: 
            <select name="InstrumentY" onChange="changeFieldOptions('y')" id="instrumenty">
            {foreach from=$all_instruments item=name key=val}
                <option value="{$name}">{$name}</option>
            {/foreach}
            </select>
        Field: 
            <select name="FieldY" id="fieldy"></select>
    </div>
</fieldset>
<fieldset>
    <legend>X Axis</legend>
    <div>
        Instrument: 
            <select name="InstrumentX" onChange="changeFieldOptions('x')" id="instrumentx">
            {foreach from=$all_instruments item=name key=val}
                <option value="{$name}">{$name}</option>
            {/foreach}
            </select>
        Field: <select name="FieldX" id="fieldx"></select>
    </div>
</fieldset>
<fieldset>
    <legend>Scatterplot</legend>
    <input type="button" value="Update chart" onClick="graph.RenderChart();" />
    <div id="scatterplot" style="width: 800px; height: 600px; margin: 0 auto"></div>

</fieldset>
</form>
</div>
