{literal}   
<script language="javascript" type="text/javascript">
    function showStats(clicked){
        var id = clicked.id;
        $('.' + id).show();
        $('#' + id).attr('colspan', '3');
        $('#' + id).attr('onClick', 'hideStats(this)');
        $('#' + id).addClass('stats-active');
    }
    function hideStats(clicked){
        var id = clicked.id;
        $('.' + id).hide();
        $('#' + id).attr('colspan', '1');
        $('#' + id).attr('onClick', 'showStats(this)');
        $('#' + id).removeClass('stats-active');
    }
</script>
{/literal}

<div id="data_entry">
<h2 class="statsH2">Data Entry Statistics  {if $CurrentProject} for {$CurrentProject.Name} {/if}</h2>
<script type="text/javascript" src="js/modules/form_stats_behavioural.js"></script>
{html_options id="BehaviouralProject" options=$Projects name="BehaviouralProject" selected=$CurrentProject.ID}
<button class="btn btn-primary btn-sm" onClick="updateBehaviouralTab()">Submit Query</button>
<br><br>

<!-- <div class="table-responsive">
    <table class="table table-primary table-bordered">
        <thead>
            <tr class="info">
                <th rowspan="2">Visit</th>
                {foreach from=$Centers item=center key=centername}
                    <th colspan="3" id='{$center.LongName}'>
                        {$center.LongName}
                    </th>
                {/foreach}
                <th colspan="3" id='total'>Total</th>
                <th rowspan="2">Per instrument stats</th>
            </tr>
            <tr class="info">
                {foreach from=$Centers item=center}
                 <th class='{$center.LongName}'>Completed</th>
                 <th class='{$center.LongName}'>Created</th>
                 <th>% Completion</th>
                {/foreach}
                 {* Total isn't in the visits array, so we need to manually add its header *}
                 <th class='total'>Completed</th>
                 <th class='total'>Created</th>
                 <th>% Completion</th>
              </tr>
        </thead>
        <tbody>
            {foreach from=$Visits item=visit}
                <tr>
                    <td>{$visit|upper}</td>
                    {foreach from=$Centers item=center key=centername}
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
        </tbody>
    </table>
</div> -->


<div class="table-responsive">
    <table class="table table-primary table-bordered">
        <thead>
            <tr class="info">
                <th rowspan="2">Site</th>
                {foreach from=$Visits item=visit}
                    <th id="{$visit}" onclick="showStats(this)">{$visit|upper}</th>
                {/foreach}
                <th class="stats-active" colspan="3" id="total" onclick="hideStats(this)">Total</th>
                <th rowspan="2">Per instrument stats</th>
            </tr>
             <tr class="info">
                {foreach from=$Visits item=visit}
                 <th class="{$visit}" style="display:none">Completed</th>
                 <th class="{$visit}" style="display:none">Created</th>
                 <th>% Completion</th>
                {/foreach}
                 {* Total isn't in the visits array, so we need to manually add its header *}
                 <th class="total">Completed</th>
                 <th class="total">Created</th>
                 <th>% Completion</th>
              </tr>
        </thead>
        <tbody>
             {foreach from=$Centers item=center key=centername}
                 <tr>
                    <td>{$center.LongName}</td>
                    {foreach from=$Visits item=visit}
                        <td class="{$visit}" style="display:none">{$behaviour[$center.ID][$visit].complete|default:"0"}</td>
                        <td class="{$visit}" style="display:none">{$behaviour[$center.ID][$visit].total|default:"0"}</td>
                        <td>{$behaviour[$center.ID][$visit].percent|default:"0"}%</td>
                    {/foreach}
                    <td class="total">{$behaviour[$center.ID].all.complete|default:"0"}</td>
                    <td class="total">{$behaviour[$center.ID].all.total|default:"0"}</td>
                    <td>{$behaviour[$center.ID].all.percent|default:"0"}%</td>
                    <td> <a href='main.php?test_name=statistics_site&CenterID={$center.NumericID}&ProjectID={$CurrentProject.ID}'>Please Click Here</a></td>
                 </tr>
             {/foreach}
        </tbody>
    </table>
</div>
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

