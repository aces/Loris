<div id="demographics">
    <h2 class="statsH2">General Demographic Statistics{if $CurrentSite} for {$CurrentSite.Name}{/if}
        {if $CurrentProject} for {$CurrentProject.Name} {/if}</h2>

    <div class="col-sm-2">
        {html_options id="DemographicSite" options=$Sites name="DemographicSite" selected=$CurrentSite.ID class="form-control"}
    </div>
    {if $useProjects == "true"}
        <div class="col-sm-3">
            {html_options id="DemographicProject" options=$Projects name="DemographicProject" selected=$CurrentProject.ID class="form-control"}
        </div>
    {/if}
    <script type="text/javascript" src="{$baseurl}/statistics/js/form_stats_demographic.js"></script>
    <button  onClick="updateDemographicTab()" class="btn btn-primary btn-small">Submit Query</button>
    <br><br>
    <table id="generalDemographics" class="data generalStats table table-primary table-bordered dynamictable">
        <thead>
        <tr>
            <th colspan="2" id="demog">Demographics</th>
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
            {if {$registered[$keyid]}>0}
                <td><b>{$registered[NULL]}</b></td>
            {else}
                <td><b>0</b></td>
            {/if}
            {foreach from=$Subprojects item=proj key=keyid}
                {if {$registered[$keyid]}>0}
                    <td><b>{$registered[$keyid]}</b></td>
                {else}
                    <td><b>0</b></td>
                {/if}
            {/foreach}
            <td class="total">{$registered.total}</td>
        </tr>
        <tr >
            <td rowspan="2" align="left" style="vertical-align:middle;background-color: #FFFFFF;">Participant Status</td>
            <td align="left" class="status_active">Active</td>
            {if {$registered[$NULL]}>0}
                {if {$ps_active[$NULL]}>0}
                    <td class="status_active">{$ps_active[$NULL]}<font size="1"><b>/{$registered[$NULL]}</b></font></td>
                {else}
                    <td class="status_active">0<font size="1"><b>/{$registered[$NULL]}</b></font></td>
                {/if}
            {else}
                <td class="status_active">0<font size="1"><b>/0</b></font></td>
            {/if}
            {foreach from=$Subprojects item=proj key=keyid}
                {if {$registered[$keyid]}>0}
                    {if {$ps_active[$keyid]}>0}
                        <td class="status_active">{$ps_active[$keyid]}<font size="1"><b>/{$registered[$keyid]}</b></font></td>
                    {else}
                        <td class="status_active">0<font size="1"><b>/{$registered[$keyid]}</b></font></td>
                    {/if}
                {else}
                <td class="status_active">0<font size="1"><b>/0</b></font></td>
                {/if}
            {/foreach}
            {if {$registered.total}>0}
                {if {$ps_active.total}>0}
                    <td class="total">{$ps_active.total}<font size="1"><b>/{$registered.total}</b></font></td>
                {else}
                    <td class="total">0<font size="1"><b>/{$registered.total}</b></font></td>
                {/if}
            {else}
                <td class="total">0<font size="1"><b>/0</b></font></td>
            {/if}
        </tr>
        <tr class="status_inactive">
            <td align="left" class="status_inactive">Inactive</td>
            {if {$registered[$NULL]}>0}
                {if {$ps_inactive[$NULL]}>0}
                    <td class="status_inactive">{$ps_inactive[$NULL]}<font size="1"><b>/{$registered[$NULL]}</b></font></td>
                {else}
                    <td class="status_inactive">0<font size="1"><b>/{$registered[$NULL]}</b></font></td>
                {/if}
            {else}
                <td class="status_inactive">0<font size="1"><b>/0</b></font></td>
            {/if}
            {foreach from=$Subprojects item=proj key=keyid}
                {if {$registered[$keyid]}>0}
                    {if {$ps_inactive[$keyid]}>0}
                        <td class="status_inactive">{$ps_inactive[$keyid]}<font size="1"><b>/{$registered[$keyid]}</b></font></td>
                    {else}
                        <td class="status_inactive">0<font size="1"><b>/{$registered[$keyid]}</b></font></td>
                    {/if}
                {else}
                    <td class="status_inactive">0<font size="1"><b>/0</b></font></td>
                {/if}
            {/foreach}
            {if {$registered.total}>0}
                {if {$ps_inactive.total}>0}
                    <td class="total">{$ps_inactive.total}<font size="1"><b>/{$registered.total}</b></font></td>
                {else}
                    <td class="total">0<font size="1"><b>/{$registered.total}</b></font></td>
                {/if}
            {else}
                <td class="total">0<font size="1"><b>/0</b></font></td>
            {/if}


        </tr>
        <tr>
            <td rowspan="2" align="left" style="vertical-align:middle">Sex</td>
            <td align="left" >Male</td>
            {if {$ps_active[$NULL]}>0}
                {if {$gender_male[$NULL]}>0}
                    <td>{$gender_male[$NULL]}<font size="1"><b>/{$ps_active[$NULL]}</b></font></td>
                {else}
                    <td>0<font size="1"><b>/{$ps_active[$NULL]}</b></font></td>
                {/if}
            {else}
                <td>0<font size="1"><b>/0</b></font></td>
            {/if}
            {foreach from=$Subprojects item=proj key=keyid}
                {if {$ps_active[$keyid]}>0}
                    {if {$gender_male[$keyid]}>0}
                        <td>{$gender_male[$keyid]}<font size="1"><b>/{$ps_active[$keyid]}</b></font></td>
                    {else}
                        <td>0<font size="1"><b>/{$ps_active[$keyid]}</b></font></td>
                    {/if}
                {else}
                    <td>0<font size="1"><b>/0</b></font></td>
                {/if}
            {/foreach}
            {if {$ps_active.total}>0}
                {if {$gender_male.total}>0}
                    <td class="total">{$gender_male.total}<font size="1"><b>/{$ps_active.total}</b></font></td>
                {else}
                    <td class="total">0<font size="1"><b>/{$ps_active.total}</b></font></td>
                {/if}
            {else}
                <td class="total">0<font size="1"><b>/0</b></font></td>
            {/if}

        </tr>
        <tr>
            <td align="left">Female</td>
            {if {$ps_active[$NULL]}>0}
                {if {$gender_female[$NULL]}>0}
                    <td >{$gender_female[$NULL]}<font size="1"><b>/{$ps_active[$NULL]}</b></font></td>
                {else}
                    <td >0<font size="1"><b>/{$ps_active[$NULL]}</b></font></td>
                {/if}
            {else}
                <td >0<font size="1"><b>/0</b></font></td>
            {/if}
            {foreach from=$Subprojects item=proj key=keyid}
                {if {$ps_active[$keyid]}>0}
                    {if {$gender_female[$keyid]}>0}
                        <td >{$gender_female[$keyid]}<font size="1"><b>/{$ps_active[$keyid]}</b></font></td>
                    {else}
                        <td>0<font size="1"><b>/{$ps_active[$keyid]}</b></font></td>
                    {/if}
                {else}
                    <td>0<font size="1"><b>/0</b></font></td>
                {/if}

            {/foreach}
            {if {$ps_active.total}>0}
                {if {$gender_female.total}>0}
                    <td class="total">{$gender_female.total}<font size="1"><b>/{$ps_active.total}</b></font></td>
                {else}
                    <td class="total">0<font size="1"><b>/{$ps_active.total}</b></font></td>
                {/if}
            {else}
                <td class="total">0<font size="1"><b>/0</b></font></td>
            {/if}

        </tr>
        <tr>
            <td colspan="2" align="left" style="vertical-align:middle">Age Average (months)</td>
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
