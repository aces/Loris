<div id="data_entry">
<h2 class="statsH2">Data Entry Statistics for {$behavioural_center_name} {$behavioural_project_name}</h2>
    <script type="text/javascript" src="js/modules/form_stats_behavioural.js"></script>
    {html_options id="BehaviouralSite" options=$Sites name="BehaviouralSite" selected=$behavioural_center}
    {html_options id="BehaviouralProject" options=$Projects name="BehaviouralProject" selected=$behavioural_project}
        <button onClick="updateBehavioural()">Submit Query</button>

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
<b><a href='main.php?test_name=statistics_site&CenterID={$behavioural_center}&ProjectID={$behavioural_project}'>Click here for breakdown per participant for {$behavioural_center_name} {$behavioural_project_name}</a></b>

<h2 class="statsH2">Double Data Entry Statistics for {$behavioural_center_name} {$behavioural_project_name}</h2>
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
<b><a href='main.php?test_name=statistics_dd_site&CenterID={$behavioural_center}&ProjectID={$behavioural_project}'>Click here for breakdown per participant for {$behavioural_center_name} {$behavioural_project_name}</a></b>

<br />
        {$InstrumentsTable}
</div>

