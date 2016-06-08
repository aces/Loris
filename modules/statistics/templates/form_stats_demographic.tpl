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
            <th><h1>Leigh</h1></th>
            <th>Undefined</th>
            {foreach from=$Subprojects item=name key=proj}
                <th>{$name}</th>
            {/foreach}
            <th class="data">Total</th>
        </tr>
        </thead>
        <tbody align="right">
        <tr>
            <td>Registered candidates</td>
            <td><b>{$registered[NULL].total}</b></td>
            {foreach from=$Subprojects item=proj key=keyid}
                <td><b>{$registered[$keyid].total}</b></td>
            {/foreach}
            {*
                <td class="total">{$registered.total}{if $registered.total-$Total_candidates neq 0} ({$Total_candidates -$registered.total} require DCC review){/if}</td>*}

            <td class="total">{$registered.total}</td>
        </tr>
        <tr>
            <td>Registered candidates currently in or passed screening</td>
            <td>N/A</td>
            {foreach from=$Subprojects item=proj key=keyid}
                {if {$registered[$keyid].visit}>0}
                    <td>{$registered[$keyid].visit}<font size="1"><b>/{$registered[$keyid].total}</b></font></td>
                {else}
                    <td>0<font size="1"><b>/{$registered[$keyid].total}</b></font></td>
                {/if}
            {/foreach}
            <td class="total">{$registered.visittotal}</td>
        </tr>
        <tr>
            <td>Registered candidates who have come in for a visit</td>
            <td>N/A</td>
            {foreach from=$Subprojects item=proj key=keyid}
                {if {$edi[$keyid].complete}>0}
                    <td>{$edi[$keyid].complete}<font size="1"><b>/{$registered[$keyid].total}</b></font></td>
                {else}
                    <td>0<font size="1"><b>/{$registered[$keyid].total}</b></font></td>
                {/if}
            {/foreach}
            <td class="total">{$edi.complete}</td>
        </tr>
        {if $mri_table_exists}
            <tr>
                <td>Registered candidates with T1 acquired</td>
                <td>N/A</td>
                {foreach from=$Subprojects item=proj key=keyid}
                    {if {$scanned[$keyid].complete}>0}
                        <td>{$scanned[$keyid].complete}<font size="1"><b>/{$registered[$keyid].total}</b></font></td>
                    {else}
                        <td>0<font size="1"><b>/{$registered[$keyid].total}</b></font></td>
                    {/if}
                {/foreach}
                <td class="total">{$scanned.complete}</td>
            </tr>
        {/if}


        </tbody>
    </table>

    {$RecruitsTable}
</div>
