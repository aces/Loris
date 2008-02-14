<br />
<form method="post" name="edit_user" id="edit_user">
<table class="std">
    <!-- table title -->
    <tr><th colspan="17">Add Tracking Log Event</th></tr>

    {foreach from=$form.errors item=error}
    <tr>
        <td nowrap="nowrap" colspan="2" class="error">{$error}</td>
    </tr>
    {/foreach}

	<tr>
<td colspan = 14>
	<table border="0">
<tr>
{* OBJECTIVE IS NIHPD SPECIFIC - BUT WE ARE TOO LAZY TO CHANGE THIS TODAY *}
 		<td nowrap="nowrap" align="left">Objective:</td>
      <td nowrap="nowrap">{$form.Subproject_ID.html}</td>
		<td nowrap="nowrap" align="right">DCCID:</td>
		<td nowrap="nowrap">{$form.CandID.html}</td>
		<td nowrap="nowrap" align="right">PSCID:</td>
		<td nowrap="nowrap">{$form.PSCID.html}</td>
		<td nowrap="nowrap" align="right">Visit label:</td>
		<td nowrap="nowrap">{$form.Visit_label.html}</td>
		<td nowrap="nowrap" align="right">Date of Scan:</td>
		<td nowrap="nowrap">{$form.aMRI_date.html}</td>
</tr>
</table>
</td>

	</tr>

	<tr>
<td colspan = 14>
	<table border="0" width="100%">
<tr>
		<td align="right" nowrap="nowrap" align="left">aMRI Done:</td>
      <td nowrap="nowrap">{$form.aMRI_done.html}</td>
		<td align="right" nowrap="nowrap" align="left">Relaxomtery Done:</td>
      <td nowrap="nowrap">{$form.Relaxometry_done.html}</td>
		<td align="right" nowrap="nowrap">DTI Done:</td>
      <td nowrap="nowrap">{$form.DTI_done.html}</td>
		<td align="right" nowrap="nowrap">2nd DC Done:</td>
      <td nowrap="nowrap">{$form.Second_DC_done.html}</td>
		<td align="right" nowrap="nowrap" align="right">MRS Done:</td>
		<td nowrap="nowrap">{$form.MRS_done.html}</td>
		<td align="right" nowrap="nowrap" align="right">MRSI Done:</td>
		<td nowrap="nowrap">{$form.MRSI_done.html}</td>
		<td align="right" nowrap="nowrap" align="right">eDTI Done:</td>
		<td nowrap="nowrap">{$form.eDTI_done.html}</td>
</tr>
</table>
</td>

	</tr>	

	<tr>
<td colspan = 14>
	<table border="0">
<tr>

		<td nowrap="nowrap" align="left">Comments</td>
		<td colspan="17">{$form.Comments.html}</td>
	</tr>
</table>
</td>
</tr>

{if $user.permissions.tracking_logs_edit_all == true}
	<tr>

<td colspan = 14>
	<table border="0" align="left">
<tr>
		<td nowrap="nowrap" align="left"><b>Lock Record</b></td>
		<td colspan="17">{$form.Lock_record.html}</td>

</tr>
</table border="0" align="right">
</td>

	</tr>
{/if}

{foreach from=$form.pass item=item key=key}
	<tr>
		<td nowrap="nowrap" align="right">{$form.pass[$key].label}</td>
		<td nowrap="nowrap">{$form.pass[$key].html}
		Comment {$form.comment[$key].html}</td>
	</tr>
{/foreach}

	<tr>
   <td bgcolor="#99FFFF" font width="30%"><a href="main.php?test_name=tracking_logs"><b>Back to main tracking log page</b></a></td>
	<td nowrap="nowrap" colspan="14" align ="right">
   	 	
	{if not $success}
			
        <input class="button" name="fire_away" value="Save" type="submit" />
        <input class="button" value="Reset" type="reset" />
    	{/if}
      </td>
	</tr>
</table>
{$form.hidden}
</form>


  