{if $success}

<p>Consent Information was updated successful<br /></p>
<br />
{/if}
<form method="post" name="update_consent_info" id="update_consent_info" enctype="multipart/form-data">
{if not $success}
<table class="std">
<!-- table title -->
<tr><th colspan="2">Update Consent Information</th></tr>

{foreach from=$form.errors item=error}
<tr>
<td nowrap="nowrap" colspan="2" class="error">{$error}</td>
</tr>
{/foreach}
<tr>
<td nowrap="nowrap" id="pscid">PSCID: {$pscid}</td>
<td nowrap="nowrap" >DCCID: {$candID}</td>
</tr>

{if $consent}
{section name=question loop=$consent}
{* 
    $consent[question] contains a list of element
        names in the form that are related to that question.
        We need to iterate through them to add them to the
        HTML. 
        *}
{foreach from=$consent[question] item=row}
<tr>
<td>{$form.$row.label}</td>
<td>{$form.$row.html}

{if $form.$row.error}
<span class="error">{$form.$row.error}</span>
{/if}
</td>
</tr>
{/foreach}

<tr>
<td colspan="4">&nbsp;</td>
</tr>
{/section}
{/if}


<tr>
    <td nowrap="nowrap">&nbsp;</td>
    <td nowrap="nowrap" colspan="2">
    <input class="button" name="fire_away" value="Save" type="submit" />
{/if}
<input class="button" onclick="location.href='main.php?test_name=candidate_parameters&candID={$candID}&identifier={$candID}'" value="Return to Candidate Info" type="button" />

</td>
</tr>

</table>

