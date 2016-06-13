<div id="demographics">
    <h2 class="statsH2">General Demographic Statistics{if $CurrentSite} for {$CurrentSite.Name}{/if}
        {if $CurrentProject} for {$CurrentProject.Name} {/if}</h2>

    <div class="col-sm-2">
        {html_options id="DemographicSite" options=$Sites name="DemographicSite" selected=$CurrentSite.ID class="form-control"}
    </div>
    <div class="col-sm-3">
        {html_options id="DemographicProject" options=$Projects name="DemographicProject" selected=$CurrentProject.ID class="form-control"}
    </div>

    <script type="text/javascript" src="{$baseurl}/statistics/js/form_stats_demographic.js"></script>
    <button  onClick="updateDemographicTab()" class="btn btn-primary btn-small">Submit Query</button>
    <br><br>
    <table class="data generalStats table table-primary table-bordered">
        <thead>
        <tr>
            <th colspan="2">Demographics</th>
            <th>Undefined</th>
            {foreach from=$Subprojects item=name key=proj}
                <th>{$name}</th>
            {/foreach}
            <th class="data">Total</th>
        </tr>
        </thead>
        <tbody align="right">
        <tr>
            <td colspan="2" align="left">Registered candidates</td>
            <td><b>{$registered[NULL]}</b></td>
            {foreach from=$Subprojects item=proj key=keyid}
                <td><b>{$registered[$keyid]}</b></td>
            {/foreach}
            <td class="total">{$registered.total}</td>
        </tr>
        <tr>
            <td rowspan="2" align="left" style="vertical-align:middle">Participant Status</td>
            <td align="left">Active</td>
            {if {$ps_active[$NULL]}>0}
                <td>{$ps_active[$NULL]}<font size="1"><b>/{$registered[$NULL]}</b></font></td>
            {else}
                <td>0<font size="1"><b>/{$registered[$NULL]}</b></font></td>
            {/if}
            {foreach from=$Subprojects item=proj key=keyid}
                {if {$ps_active[$keyid]}>0}
                    <td>{$ps_active[$keyid]}<font size="1"><b>/{$registered[$keyid]}</b></font></td>
                {else}
                    <td>0<font size="1"><b>/{$registered[$keyid]}</b></font></td>
                {/if}
            {/foreach}
            <td class="total">{$ps_active.total}<font size="1"><b>/{$registered.total}</b></font></td>
        </tr>
        <tr>
            <td align="left">Inactive</td>
            {if {$ps_inactive[$NULL]}>0}
                <td>{$ps_inactive[$NULL]}<font size="1"><b>/{$registered[$NULL]}</b></font></td>
            {else}
                <td>0<font size="1"><b>/{$registered[$NULL]}</b></font></td>
            {/if}
            {foreach from=$Subprojects item=proj key=keyid}
                {if {$ps_inactive[$keyid]}>0}
                    <td>{$ps_inactive[$keyid]}<font size="1"><b>/{$registered[$keyid]}</b></font></td>
                {else}
                    <td>0<font size="1"><b>/{$registered[$keyid]}</b></font></td>
                {/if}
            {/foreach}
            <td class="total">{$ps_inactive.total}<font size="1"><b>/{$registered.total}</b></font></td>
        </tr>
        <tr>
            <td rowspan="2" align="left" style="vertical-align:middle">Gender</td>
            <td align="left">Male</td>
            {if {$gender_male[$NULL]}>0}
                <td>{$gender_male[$NULL]}<font size="1"><b>/{$ps_active[$NULL]}</b></font></td>
            {else}
                <td>0<font size="1"><b>/{$ps_active[$NULL]}</b></font></td>
            {/if}
            {foreach from=$Subprojects item=proj key=keyid}
                {if {$gender_male[$keyid]}>0}
                    <td>{$gender_male[$keyid]}<font size="1"><b>/{$ps_active[$keyid]}</b></font></td>
                {else}
                    <td>0<font size="1"><b>/{$ps_active[$keyid]}</b></font></td>
                {/if}
            {/foreach}
            <td class="total">{$gender_male.total}<font size="1"><b>/{$ps_active.total}</b></font></td>
        </tr>
        <tr>
            <td align="left">Female</td>
            {if {$gender_female[$NULL]}>0}
                <td>{$gender_female[$NULL]}<font size="1"><b>/{$ps_active[$NULL]}</b></font></td>
            {else}
                <td>0<font size="1"><b>/{$ps_active[$NULL]}</b></font></td>
            {/if}
            {foreach from=$Subprojects item=proj key=keyid}
                {if {$gender_female[$keyid]}>0}
                    <td>{$gender_female[$keyid]}<font size="1"><b>/{$ps_active[$keyid]}</b></font></td>
                {else}
                    <td>0<font size="1"><b>/{$ps_active[$keyid]}</b></font></td>
                {/if}
            {/foreach}
            <td class="total">{$gender_female.total}<font size="1"><b>/{$ps_active.total}</b></font></td>
        </tr>
        <tr>
            <td colspan="2" align="left" style="vertical-align:middle">Age Range</td>
            {if {$age_avg[$NULL]}>0}
                <td>{$age_avg[$NULL]}</td>
            {else}
                <td>0</td>
            {/if}
            {foreach from=$Subprojects item=proj key=keyid}
                {if {$age_avg[$keyid]}>0}
                    <td>{$age_avg[$keyid]}</td>
                {else}
                    <td>0</td>
                {/if}
            {/foreach}
            <td class="total">N/A</td>
        </tr>
        </tbody>
    </table>

    {$RecruitsTable}
</div>
