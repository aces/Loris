<div id="data_entry">
<h2 class="statsH2">Data Entry Statistics for {$behavioural_center_name} {$behavioural_project_name}</h2>
        <!--form action="#data_entry">
            {html_options options=$Sites name="site2" selected=$behavioural_center}
            <input type="hidden" name="test_name" value="statistics" />
            <input type="submit" />
            {html_options options=$Projects name="project2" selected=$behavioural_project}
            <input type="hidden" name="de_project" value="statistics" />
            <input type="submit" />
            </form-->
        <script type="text/javascript" src="js/modules/form_stats_behavioural.js"></script>
        {html_options id="site" options=$Sites name="site2" selected=$behavioural_center}
        {html_options id="project" options=$Projects name="project2" selected=$behavioural_project}
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

