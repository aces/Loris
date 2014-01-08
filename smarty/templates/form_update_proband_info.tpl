{if $success}

<p>Proband Information was updated successful<br /></p>
<br />
{/if}
<form method="post" name="update_proband_info" id="update_proband_info" enctype="multipart/form-data">
{if not $success}
<table class="std">
<!-- table title -->
<tr><th colspan="2">Update Proband Information</th></tr>

{foreach from=$form.errors item=error}
<tr>
<td nowrap="nowrap" colspan="2" class="error">{$error}</td>
</tr>
{/foreach}
<tr>
<td nowrap="nowrap" id="pscid">PSCID: {$pscid}</td>
<td nowrap="nowrap" >DCCID: {$candID}</td>
</tr>
 <tr>
        <td nowrap="nowrap">{$form.ProbandGUID.label}</td>
        <td nowrap="nowrap">{$form.ProbandGUID.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.ProbandGender.label}</td>
        <td nowrap="nowrap">{$form.ProbandGender.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">{$form.ProbandDoB.label}</td>
        <td nowrap="nowrap">{$form.ProbandDoB.html}</td>
    </tr>
    <tr>
       <td nowrap="nowrap">{$form.ProbandDoB2.label}</td>
       <td nowrap="nowrap">{$form.ProbandDoB2.html}</td>
    </tr>
    
  </br>

<tr>
    <td nowrap="nowrap">&nbsp;</td>
    <td nowrap="nowrap" colspan="2">
    <input class="button" name="fire_away" value="Save" type="submit" />
{/if}
<input class="button" onclick="location.href='main.php?test_name=candidate_parameters&candID={$candID}&identifier={$candID}'" value="Return to profile" type="button" />

</td>
</tr>

</table>

