<br />
{assign var="action" value="identifier=$identifier"}
<FORM method="post" name="mri_safety_review" id="mri_safety_review" action="main.php?test_name=mri_safety&subtest=mri_safety_review&{$action}&candID={$candID}">
<TABLE class="std">
    <!-- table title -->
    <tr><th colspan="2">MRI Safety Form [{$CandID}/{$PSCID} : {$Visit_label}] - Review</th></tr>

    {foreach from=$form.errors item=error}
    <!-- form errors -->
    <tr>
        <td nowrap="nowrap" colspan="2" class="error">{$error}</td>
    </tr>
    {/foreach}
    
    <tr>
        <td nowrap="nowrap">MR Scan Date</td>
        <td nowrap="nowrap">{$form.Acquisition_date.html}</td>
    </tr>
    
    <tr>
        <td nowrap="nowrap">On-site Radiologist's Review Date</td>
        <td nowrap="nowrap">{$form.Date_review.html}</td>
    </tr>
    
    <tr>
        <td nowrap="nowrap">Any Adverse Events?</td>
        <td nowrap="nowrap">{$form.Check_adverse.html}</td>
    </tr>
    
    <tr>
        <td nowrap="nowrap">Any Incidental Findings?</td>
        <td nowrap="nowrap">{$form.Check_incidental.html}</td>
    </tr>

    <tr>
        <td valign="top" nowrap="nowrap">DCC Comments</td>
        <td>{$form.Comment.html}</td>
    </tr>
    
    <tr>
        <td nowrap="nowrap">Medical Review Outcome</td>
        <td nowrap="nowrap">{$form.Findings_confirmed.html}</td>
    </tr>
    
    <tr>
        <td valign="top" nowrap="nowrap">Reviewers' Comments</td>
        <td>{$form.Findings_comment.html}</td>
    </tr>

    <tr>
        <td nowrap="nowrap">&nbsp;</td>
        <td nowrap="nowrap" colspan="2">
    {if not $success}
        <input class="button" name="fire_away" value="Save" type="submit" />
    {/if}
    {if $candID ne ""}
        {assign var="backURL" value="/main.php?test_name=mri_safety&candID=$candID"}
    {else}
        {assign var="backURL" value="/main.php?test_name=mri_safety"}
    {/if}
        <input class="button" onclick="location.href='{$backURL}'" value="Back" type="button" />
        </td>
    </tr>
</TABLE>
{$form.hidden}
</FORM>