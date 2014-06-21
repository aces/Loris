<div id="data_entry">
<h2 class="statsH2">Data Entry Statistics  {if $CurrentProject} for {$CurrentProject.Name} {/if}</h2>
    <script type="text/javascript" src="js/modules/form_stats_behavioural.js"></script>
    {html_options id="BehaviouralProject" options=$Projects name="BehaviouralProject" selected=$CurrentProject.ID}
        <button onClick="updateBehaviouralTab()">Submit Query</button>

<table class="data">
<tr>
<th rowspan="2">Site</th>
{foreach from=$Visits item=visit}
<th colspan="3">{$visit|upper}</th>
{/foreach}
<th colspan="3">Total</th>
<th rowspan="2">Per instrument stats</th>
    </tr>
         <tr>
            {foreach from=$Visits item=visit}
             <th>Completed</th>
             <th>Created</th>
             <th>% Completion</th>
            {/foreach}
             {* Total isn't in the visits array, so we need to manually add its header *}
             <th>Completed</th>
             <th>Created</th>
             <th>% Completion</th>
          </tr>
         {foreach from=$Centers item=center key=centername}
         <tr>
            <td>{$center.LongName}</td>
            {foreach from=$Visits item=visit}
                <td>{$behaviour[$center.ID][$visit].complete|default:"0"}</td>
                <td>{$behaviour[$center.ID][$visit].total|default:"0"}</td>
                <td>{$behaviour[$center.ID][$visit].percent|default:"0"}%</td>
            {/foreach}
            <td class="total">{$behaviour[$center.ID].all.complete|default:"0"}</td>
            <td class="total">{$behaviour[$center.ID].all.total|default:"0"}</td>
            <td class="total">{$behaviour[$center.ID].all.percent|default:"0"}%</td>
            <td> <a href='main.php?test_name=statistics_site&CenterID={$center.NumericID}&ProjectID={$CurrentProject.ID}'>Please Click Here</a></td>
         </tr>
         {/foreach}

</table>
<b><a href='main.php?test_name=statistics_site&CenterID={$CurrentSite.ID}&ProjectID={$CurrentProject.ID}'>Click here for breakdown per participant {if $CurrentSite} for {$CurrentSite.Name} {/if} {if $CurrentProject} {$CurrentProject.Name} {/if}</a></b>

<h2 class="statsH2">Double Data Entry Statistics:</h2>
<table class="data">
    <tr>
        <th rowspan="2">Site</th>
        {foreach from=$Visits item=visit}
        <th colspan="3">{$visit|upper}</th>
        {/foreach}
        <th colspan="3">Total</th>
        <th rowspan="2">Per instrument stats</th>
    </tr>
<tr>
{foreach from=$Visits item=visit}
             <th>Completed</th>
             <th>Created</th>
             <th>% Completion</th>
            {/foreach}
             {* Total isn't in the visits array, so we need to manually add its header *}
             <th>Completed</th>
             <th>Created</th>
             <th>% Completion</th>
          </tr>
         {foreach from=$Centers item=center key=centername}
         <tr>
            <td>{$center.LongName}</td>
            {foreach from=$Visits item=visit}
                <td>{$dde[$center.ID][$visit].complete|default:"0"}</td>
                <td>{$dde[$center.ID][$visit].total|default:"0"}</td>
                <td>{$dde[$center.ID][$visit].percent|default:"0"}%</td>
            {/foreach}
                <td class="total">{$dde[$center.ID].all.complete|default:"0"}</td>
                <td class="total">{$dde[$center.ID].all.total|default:"0"}</td>
                <td class="total">{$dde[$center.ID].all.percent|default:"0"}%</td>
            <td> <a href='main.php?test_name=statistics_dd_site&CenterID={$center.NumericID}&ProjectID={$CurrentProject.ID}'>Please Click Here</a></td>
         </tr>
         {/foreach}
      </table>
<br />
</div>

<b><a href='main.php?test_name=statistics_dd_site&CenterID={$CurrentSite.ID}&ProjectID={$CurrentProject.ID}'>Click here for breakdown per participant for {if $CurrentSite} for {$CurrentSite.Name} {/if} {if $CurrentProject} {$CurrentProject.Name} {/if}</a></b>

<br />
        {$InstrumentsTable}
</div>

