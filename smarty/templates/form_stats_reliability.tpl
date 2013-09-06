<script type="text/javascript" src="js/modules/form_stats_reliability.js"></script>
<div id="reliability">
<h2 class="statsH2">Reliability Statistics{if $CurrentSite} for {$CurrentSite.Name}{/if}</h2>
        {html_options id="ReliabilitySite" options=$Sites name="ReliabilitySite" selected=$CurrentSite.ID}   
        
        <button onClick="updateReliabilityTab()">Submit Query</button>

<table class="data">
<tr>
    <th>Reliablity Module</th>
    <th>Total Flagged</th>
    <th>Total Complete</th>
    <th>Total Reliable</th>
    <th>Percent Complete</th>
    <th>Percent Reliable</th>
</tr>
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
</table>
</div>

