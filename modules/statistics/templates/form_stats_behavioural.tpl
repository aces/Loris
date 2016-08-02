<div id="data_entry">
    <h2 class="statsH2">Data Entry Statistics  {if $CurrentProject} for {$CurrentProject.Name} {/if}</h2>
    <script type="text/javascript" src="{$baseurl}/statistics/js/form_stats_behavioural.js"></script>
    {if $useProjects == "true"}
        <div class="col-sm-2">
            {html_options id="BehaviouralProject" options=$Projects name="BehaviouralProject" selected=$CurrentProject.ID class="form-control"}
        </div>
        <button class="btn btn-primary btn-sm" onClick="updateBehaviouralTab()">Submit Query</button>
        <br><br>
    {/if}

    <table class="data table table-primary table-bordered dynamictable">
        <thead>
        <tr class="info">
            <th class="   spacer"> </th>
            {foreach from=$Centers item=center key=centername}
                <th id='{$center.LongName}' class="centers tip" colspan="2" onclick="hideStats(this)" data-toggle="tooltip" data-placement="bottom" data-container="body" title="Click to minimize">
                    {$center.LongName}
                </th>
            {/foreach}
        </tr>
        <tr class="info">
            <th class="  ">Visit</th>
            {foreach from=$Centers item=center}
                <th class='{$center.LongName}'>Completed (%)</th>
                <th class='{$center.LongName}'>Created</th>
            {/foreach}
        </tr>
        </thead>
        <tbody>
        {foreach from=$Visits item=visit}
            <tr>
                <td class=" ">{$visit|upper}</td>
                {foreach from=$Centers item=center key=centername}
                    <td class='{$center.LongName} complete'>{$behaviour[$center.ID][$visit].complete|default:"0"} ({$behaviour[$center.ID][$visit].percent|default:"0"}%)</td>
                    <td class='{$center.LongName}'>{$behaviour[$center.ID][$visit].total|default:"0"}</td>
                {/foreach}
            </tr>
        {/foreach}
        <tr>
            <td class="total">Total</td>
            {foreach from=$Centers item=center key=centername}
                <td class='{$center.LongName} visit_complete total'>{$behaviour[$center.ID].all.complete|default:"0"} ({$behaviour[$center.ID].all.percent|default:"0"}%)</td>
                <td class='{$center.LongName} total '>{$behaviour[$center.ID].all.total|default:"0"}</td>
            {/foreach}
        </tr>
        <tr>
            <td class="   pis">Per Instrument Stats</td>
            {foreach from=$Centers item=center key=centername}
                <td id='{$center.LongName}PIS' class="pis" colspan="2">
                    <a href='{$baseurl}/statistics/?submenu=statistics_site&CenterID={$center.NumericID}{if $useProjects == "true"}&ProjectID={$CurrentProject.ID}{/if}' target="_blank">Please Click Here</a>
                </td>
            {/foreach}
        </tr>
        </tbody>
    </table>



    <b><a href='{$baseurl}/statistics/?submenu=statistics_site&CenterID={$CurrentSite.ID}{if $useProjects == "true"}&ProjectID={$CurrentProject.ID}{/if}' target="_blank">Click here for breakdown per participant {if $CurrentSite} for {$CurrentSite.Name} {/if} {if $CurrentProject} for {$CurrentProject.Name} {/if}</a></b>
    <br><br>
    <h2 class="statsH2">Double Data Entry Statistics:</h2>

    <table class="data table table-primary table-bordered dynamictable">
        <thead>
        <tr class="info">
            <td class="spacer"> </td>
            {foreach from=$Centers item=center key=centername}
                <th id='{$center.LongName}DD' class="centers tip" colspan="2" onclick="hideStats(this)">
                    {$center.LongName}
                </th>
            {/foreach}
            <!--  <th colspan="3" id='total'>Total</th>
             <th rowspan="2"></th> -->
        </tr>
        <tr class="info">
            <th class="  DD">Visit</th>
            {foreach from=$Centers item=center}
                <th class='{$center.LongName}DD'>Completed</th>
                <th class='{$center.LongName}DD'>Created</th>
            {/foreach}
        </tr>
        </thead>
        <tbody>
        {foreach from=$Visits item=visit}
        <tr>
            <td class="  DD">{$visit|upper}</td>
            {foreach from=$Centers item=center key=centername}
                <td class='{$center.LongName}DD complete'>{$dde[$center.ID][$visit].complete|default:"0"} ({$dde[$center.ID][$visit].percent|default:"0"}%)</td>
                <td class='{$center.LongName}DD'>{$dde[$center.ID][$visit].total|default:"0"}</td>
            {/foreach}

            {/foreach}
        <tr>
            <td class="total">Total</td>
            {foreach from=$Centers item=center key=centername}
                <td class='{$center.LongName}DD visit_complete total'>{$dde[$center.ID].all.complete|default:"0"} ({$dde[$center.ID].all.percent|default:"0"}%)</td>
                <td class='{$center.LongName}DD total'>{$dde[$center.ID].all.total|default:"0"}</td>
            {/foreach}
        </tr>
        <tr>
            <td class=" pis">Per Instrument Stats</td>
            {foreach from=$Centers item=center key=centername}
                <td id='{$center.LongName}DDPIS' class="pis" colspan="2">
                    <a href='{$baseurl}/statistics/?submenu=statistics_dd_site&CenterID={$center.NumericID}{if $useProjects == "true"}&ProjectID={$CurrentProject.ID}{/if}' target="_blank">Please Click Here</a>
                </td>
            {/foreach}
        </tr>
        </tbody>
    </table>
    <div>
        <b><a href='{$baseurl}/statistics/?submenu=statistics_dd_site&CenterID={$CurrentSite.ID}{if $useProjects == "true"}&ProjectID={$CurrentProject.ID}{/if}' target="_blank">Click here for breakdown per participant{if $CurrentSite} for {$CurrentSite.Name} {/if} {if $CurrentProject} for {$CurrentProject.Name} {/if}</a></b>
    </div>
</div>

