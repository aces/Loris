{literal}
    <script language="javascript" type="text/javascript" src="../../js/jquery/jquery-1.11.0.min.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/jquery/jquery-ui-1.10.4.custom.min.js"></script>
    <script language="javascript" type="text/javascript" src="../flexigrid-1.1/js/flexigrid.pack.js"></script>
{/literal}
<div clcass-"flexigrid">
<table class="flexme1" style="display: table;" cellpadding="0" cellspacing="0" border="0">
    <tbody>
    <!--<tr><td>Data1</td></tr>-->
    </tbody>
</table>
</div>
<h2>{$SiteName} MRI Integrity Statistics</h2>
<table class="fancytable" width="100%">
    <tr>
        <th width="10%">Issue type</th>
        <th colspan="{$NumVisitLabels}" width="80%">Incomplete Entries</th>
    </tr>
    <tr>
        <th>&nbsp;</th>
        {foreach from=$AllVisits item=visit}
            <th width="20%">{$visit}</th>
        {/foreach}
    </tr>
    {section name=item loop=$data}
        <tr bgcolor="#FFFFFF">
            <td>{$data[item].name}</td>
            {foreach from=$AllVisits item=visit name=VisitLoop}
                <td>{foreach from=$data[item].incompletes[$visit] item=Candidate name=CandLoop}
                    {if $Candidate.test_url == "PF_Missing"}
                    <a href="{$baseurl}/imaging_browser/viewSession/?sessionID={$Candidate.SessionID}">
                        <br>
                        {else}
                        <a href="{$baseurl}/mri_parameter_form/?candID={$Candidate.CandID}&sessionID={$Candidate.SessionID}&commentID={$Candidate.CommentID}">
                            <br>
                            {/if}
                            {$Candidate.PSCID}</a>
                        {/foreach}
                </td>
            {/foreach}
        </tr>
    {/section}
</table>
