<br />
<form method="post" name="edit_user" id="edit_user">
<table class="std">
    <!-- table title -->
    <tr><th colspan="6">Edit Certification Event</th></tr>

    {foreach from=$form.errors item=error}
    <tr>
        <td nowrap="nowrap" colspan="2" class="error">{$error}</td>
    </tr>
    {/foreach}

	<tr>
        <td>&nbsp;</td>
	</tr>
	<tr>
		<td nowrap="nowrap" align="right">Examiner</td>
		<td nowrap="nowrap">{$form.examinerID.html}</td>
	</tr>

	<tr>
<!--		<td nowrap="nowrap" align="right">Date of testing</td>
		<td nowrap="nowrap">{$form.date_cert.html}</td>
	</tr>

<tr>
		<td nowrap="nowrap" align="right">DCCID</td>
		<td nowrap="nowrap">{$form.cert_candID.html}</td>
	</tr>

	<tr>
		<td nowrap="nowrap" align="right">Visit label</td>
		<td nowrap="nowrap">{$form.cert_visit_label.html}</td>
	</tr>
-->
{foreach from=$form.pass item=item key=key}
	<tr>
		<td nowrap="nowrap" align="right">{$form.pass[$key].label}</td>
		<td nowrap="nowrap">{$form.pass[$key].html}
		<td nowrap="nowrap" align="right">{$form.date_cert[$key].label}</td>
		<td nowrap="nowrap">{$form.date_cert[$key].html}
		Comment {$form.comment[$key].html}</td>
	</tr>
{/foreach}

	<tr>
        <td>&nbsp;</td>
	</tr>
	<tr>
        <td nowrap="nowrap">&nbsp;</td>
		<td nowrap="nowrap" colspan="2">
    {if not $success}
        <input class="button" name="fire_away" value="Save" type="submit" />
        <input class="button" value="Reset" type="reset" />
    {/if}
        </td>
	</tr>
</table>
{$form.hidden}
</form>
<table class="std">
<p>&nbsp;</p>
<h1>Change Log</h1>
<tr>
<th>Time</th>
<th>User</th>
<th>Measure</th>
<th>Visit</th>
<th>Old Value</th>
<th>Old Date</th>
<th>New Value</th>
<th>New Date</th>
</tr>
{$form.certification_history.html}
</table>
