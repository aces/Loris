<div id="data_entry">
    <h2 class="statsH2">Data Entry Statistics  {if $CurrentProject} for {$CurrentProject.Name} {/if}</h2>
    <script type="text/javascript" src="{$baseurl}/statistics/js/form_stats_behavioural.js"></script>
        <div class="col-sm-2">
            {html_options id="BehaviouralProject" options=$Projects name="BehaviouralProject" selected=$CurrentProject.ID class="form-control"}
        </div>
        <button class="btn btn-primary btn-sm" onClick="updateBehaviouralTab()">Submit Query</button>
        <br><br>

    <table class="data table table-primary table-bordered dynamictable">
        <thead>
        <tr class="info">
            <th class="   spacer"> </th>
            {foreach from=$Centers item=center key=centername}
                <th id='{$center.ID}' class="centers tip" colspan="2" onclick="hideStats(this)" data-toggle="tooltip" data-placement="bottom" data-container="body" title="Click to minimize">
                    {$center.LongName}
                </th>
            {/foreach}
        </tr>
        <tr class="info">
            <th class="  ">Visit</th>
            {foreach from=$Centers item=center}
                <th class='{$center.ID}'>Completed (%)</th>
                <th class='{$center.ID}'>Created</th>
            {/foreach}
        </tr>
        </thead>
        <tbody>
        {foreach from=$Visits item=visit}
            <tr>
                <td class=" ">{$visit|upper}</td>
                {foreach from=$Centers item=center key=centername}
                    <td class='{$center.ID} complete'>{$behaviour[$center.ID][$visit].complete|default:"0"} ({$behaviour[$center.ID][$visit].percent|default:"0"}%)</td>
                    <td class='{$center.ID}'>{$behaviour[$center.ID][$visit].total|default:"0"}</td>
                {/foreach}
            </tr>
        {/foreach}
        <tr>
            <td class="total">Total</td>
            {foreach from=$Centers item=center key=centername}
                <td class='{$center.ID} visit_complete total'>{$behaviour[$center.ID].all.complete|default:"0"} ({$behaviour[$center.ID].all.percent|default:"0"}%)</td>
                <td class='{$center.ID} total '>{$behaviour[$center.ID].all.total|default:"0"}</td>
            {/foreach}
        </tr>
        <tr>
            <td class="   pis">Per Instrument Stats</td>
            {foreach from=$Centers item=center key=centername}
                <td id='{$center.ID}PIS' class="pis" colspan="2">
                    <a href='{$baseurl}/statistics/statistics_site/?CenterID={$center.NumericID}&ProjectID={$CurrentProject.ID}' target="_blank">View Details</a>
                </td>
            {/foreach}
        </tr>
        </tbody>
    </table>



    <b><a href='{$baseurl}/statistics/statistics_site/?CenterID={$CurrentSite.ID}&ProjectID={$CurrentProject.ID}' target="_blank">Click here for breakdown per participant {if $CurrentSite} for {$CurrentSite.Name} {/if} {if $CurrentProject} for {$CurrentProject.Name} {/if}</a></b>
    <br><br>
    <h2 class="statsH2">Double Data Entry Statistics:</h2>

    <table class="data table table-primary table-bordered dynamictable">
        <thead>
        <tr class="info">
            <td class="spacer"> </td>
            {foreach from=$Centers item=center key=centername}
                <th id='{$center.ID}DD' class="centers tip" colspan="2" onclick="hideStats(this)">
                  {$center.LongName}
                </th>
            {/foreach}
            <!--  <th colspan="3" id='total'>Total</th>
             <th rowspan="2"></th> -->
        </tr>
        <tr class="info">
            <th class="  DD">Visit</th>
            {foreach from=$Centers item=center}
                <th class='{$center.ID}DD'>Completed</th>
                <th class='{$center.ID}DD'>Created</th>
            {/foreach}
        </tr>
        </thead>
        <tbody>
        {foreach from=$Visits item=visit}
        <tr>
            <td class="  DD">{$visit|upper}</td>
            {foreach from=$Centers item=center key=centername}
                <td class='{$center.ID}DD complete'>{$dde[$center.ID][$visit].complete|default:"0"} ({$dde[$center.ID][$visit].percent|default:"0"}%)</td>
                <td class='{$center.ID}DD'>{$dde[$center.ID][$visit].total|default:"0"}</td>
            {/foreach}

            {/foreach}
        <tr>
            <td class="total">Total</td>
            {foreach from=$Centers item=center key=centername}
                <td class='{$center.ID}DD visit_complete total'>{$dde[$center.ID].all.complete|default:"0"} ({$dde[$center.ID].all.percent|default:"0"}%)</td>
                <td class='{$center.ID}DD total'>{$dde[$center.ID].all.total|default:"0"}</td>
            {/foreach}
        </tr>
        <tr>
            <td class=" pis">Per Instrument Stats</td>
            {foreach from=$Centers item=center key=centername}
                <td id='{$center.ID}DDPIS' class="pis" colspan="2">
                    <a href='{$baseurl}/statistics/statistics_dd_site/?CenterID={$center.NumericID}&ProjectID={$CurrentProject.ID}' target="_blank">View Details</a>
                </td>
            {/foreach}
        </tr>
        </tbody>
    </table>
    <div>
        <b><a href='{$baseurl}/statistics/statistics_dd_site/?CenterID={$CurrentSite.ID}&ProjectID={$CurrentProject.ID}' target="_blank">Click here for breakdown per participant{if $CurrentSite} for {$CurrentSite.Name} {/if} {if $CurrentProject} for {$CurrentProject.Name} {/if}</a></b>
    </div>
</div>

