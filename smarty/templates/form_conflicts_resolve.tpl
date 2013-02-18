
<form>
<table border="0" valign="top" class="std">
<tr>
    <th colspan="4">Selection Filter</th>
</tr>
<tr>
    <td>{$form.Instrument.label}</td>
    <td>{$form.Instrument.html}</td>
    <td>{$form.site.label}</td>
    <td>{$form.site.html}</td>
</tr>
<tr>
    <td>{$form.CandID.label}</td>
    <td>{$form.CandID.html}</td>
    <td>{$form.PSCID.label}</td>
    <td>{$form.PSCID.html}</td>
</tr>
<tr>
    <td></td>
    <td colspan="3" align="right">
        <input type="submit" name="filter" value="Show Data" class="button"/>
        <input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=conflicts_resolve'">
    </td>
</tr>
</table>
<input type="hidden" name="test_name" value="conflicts_resolve" />

</form>

<br>
<form method="post" name="conflicts_resolve" id="conflicts_resolve">
<table class="fancytable" border="0">

    {if $form.total}
        <tr class="nohover">
            <td colspan="5" align="right" style="border: none;" class="nohover">{$form.total.label}</td>
        </tr>
    {/if}

    {foreach from=$form.errors item=error}
    <tr>
        <td nowrap="nowrap" colspan="5" class="error">{$error}</td>
    </tr>
    {/foreach}
	
	<tr>
        <th>Instrument</th>
        <th>DCCID</th>
        <th>PSCID</th>
        <th>Visit Label</th>
        <th>Question</th>
        <th>Correct Answer</th>
    </tr>
	

    {foreach from=$elements_list_names item=element}
	<tr>
        <td>{$elements_array[$element].instrument}</td>
        <td>{$elements_array[$element].dccid}</td>
        <td>{$elements_array[$element].pscid}</td>
        <td>{$elements_array[$element].visit_label}</td>
        <td>{$elements_array[$element].field}</td>
		<td nowrap="nowrap" align="right">{$form.$element.html}</td>
	</tr>
    {foreachelse}
        <tr>
            <td colspan="6"><b>{$form.status.label}</b></td>
        </tr>
	{/foreach}


        <tr>
        <td nowrap="nowrap" colspan="5">&nbsp;</td>
                <td nowrap="nowrap">
        <input class="button" name="fire_away" value="Save" type="submit" />
        <input class="button" value="Reset" type="reset" />
        </td>
        </tr>


</table>
{$form.hidden}
</form>

