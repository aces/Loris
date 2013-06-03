    <div id="demographics">
        <h2 class="statsH2">General statistics{if $CurrentSite} for {$CurrentSite.Name}{/if}</h2>
        <script type="text/javascript" src="js/modules/form_stats_demographic.js"></script>
        {html_options id="DemographicSite" options=$Sites name="DemographicSite" selected=$CurrentSite.ID}
        {html_options id="DemographicProject" options=$Projects name="DemographicProject" selected=$CurrentProject.ID}
        <button onclick="updateDemographicSite()">Submit Query</button>

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
            </tr>
        </tbody>
        </table>
</br>

        {$RecruitsTable}

</div>

