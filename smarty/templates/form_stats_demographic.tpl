    <div id="demographics">
        <h2 class="statsH2">General statistics{if $CurrentSite} for {$CurrentSite.Name}{/if}</h2>
        <form action="#demographics">
            {html_options options=$Sites name="site" selected=$CurrentSite.ID}
            <input type="hidden" name="test_name" value="statistics" />
            <input type="submit" />
        </form>
        <table class="data generalStats">
        <thead>
            <tr>
                <th></th>
                <th>Undefined Yet</th>
                {foreach from=$Subprojects item=name key=proj}
                    <th>{$name}</th>
                {/foreach}
                <th class="data">Total</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Registered candidates</td>
                <td>{$registered[NULL].total}</td>
                {foreach from=$Subprojects item=proj key=keyid}
                <td>{$registered[$keyid].total}</td>
                {/foreach}
                <td class="total">{$registered.total}{if $registered.total-$Total_candidates neq 0} ({$registered.total-$Total_candidates} require DCC review){/if}</td>
            </tr>
            <tr>
                <td colspan="2">Registered candidates currently in or passed screening</td>
                {foreach from=$Subprojects item=proj key=keyid}
                <td>{$registered[$keyid].visit}</td>
                {/foreach}
                <td class="total">{$registered.visittotal}</td>
            </tr>
            <tr>
                <td colspan="2">Registered candidates who have come in for a visit</td>
                {foreach from=$Subprojects item=proj key=keyid}
                <td>{$edi[$keyid].complete}</td>
                {/foreach}
                <td class="total">{$edi.complete}</td>
            </tr>
            <tr>
                <td colspan="2">Registered candidates with T1 acquired</td>
                {foreach from=$Subprojects item=proj key=keyid}
                <td>{$scanned[$keyid].complete}</td>
                {/foreach}
                <td class="total">{$scanned.complete}</td>
            </tr>

        </tbody>
        </table>

        {$RecruitsTable}
</div>

