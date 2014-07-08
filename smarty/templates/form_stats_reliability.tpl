<script type="text/javascript" src="js/modules/form_stats_reliability.js"></script>
<div id="reliability">
    <h2 class="statsH2">Reliability Statistics{if $CurrentSite} for {$CurrentSite.Name}{/if}</h2>
        <div class="col-sm-2">
            {html_options id="ReliabilitySite" options=$Sites name="ReliabilitySite" selected=$CurrentSite.ID class="form-control"}   
        </div>
        <div class="col-sm-2">
            {html_options id="ReliabilityProject" options=$Projects name="ReliabilityProject" selected=$CurrentProject.ID class="form-control"}
        </div>   
            <button onClick="updateReliabilityTab()" class="btn btn-primary btn-small">Submit Query</button>

    <br><br>
    <div class="table-responsive col-sm-6">
        <table class="table table-primary table-bordered">
            <thead>
                <tr class="info">
                    <th>Reliablity Module</th>
                    <th>Total Flagged</th>
                    <th>Total Complete</th>
                    <th>Total Reliable</th>
                    <th>Percent Complete</th>
                    <th>Percent Reliable</th>
                </tr>
            </thead>
            <tbody>
                {section name=item loop=$reliability_completion}
                    <tr>
                        <td>{$reliability_completion[item].name}</td>
                        <td>{$reliability_completion[item].total}</td>
                        <td>{$reliability_completion[item].complete}</td>
                        <td>{$reliability_completion[item].reliable}</td>
                        <td>{$reliability_completion[item].percent_complete}%</td>
                        <td>{$reliability_completion[item].percent_reliable}%</td>
                    </tr>
                {/section}
            </tbody>
        </table>
    </div> 
    <div class="hidden-xs">
        <table class="table table-primary table-bordered">
            <thead>
                <tr class="info">
                    <th>Reliablity Module</th>
                    <th>Total Flagged</th>
                    <th>Total Complete</th>
                    <th>Total Reliable</th>
                    <th>Percent Complete</th>
                    <th>Percent Reliable</th>
                </tr>
            </thead>
            <tbody>
                {section name=item loop=$reliability_completion}
                    <tr>
                        <td>{$reliability_completion[item].name}</td>
                        <td>{$reliability_completion[item].total}</td>
                        <td>{$reliability_completion[item].complete}</td>
                        <td>{$reliability_completion[item].reliable}</td>
                        <td>{$reliability_completion[item].percent_complete}%</td>
                        <td>{$reliability_completion[item].percent_reliable}%</td>
                    </tr>
                {/section}
            </tbody>
        </table>
    </div> 
</div>

