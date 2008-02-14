<form action="context_help_popup.php" method="post" onsubmit="getFormData(this)">
<input type="hidden" name="helpID" value="{$help_file.helpID}" />
<input type="hidden" name="submit" value="true" />
<input type="hidden" name="topic" value="" />
<input type="hidden" name="content" value="" />
<table border="0" cellpadding="3" cellspacing="2" width="100%">
    <tr>
        <td class="tabox">{$note}</td>
    </tr>
    <tr>
        <td class="tabox">
            <select name="relatedID[]" multiple="multiple" size="5">
{section name=links loop=$links}
                <option value="{$links[links].helpID}">{$links[links].topic}</option>
{/section}
            </select>
        </td>
    </tr>
    <tr>
        <td class="tabox">
            <input type="button" name="mode" value="Cancel" class="button" onclick="window.close()" />
            <input type="submit" name="mode" value="{$pagetitle}" class="button" />
        </td>
    </tr>
</table>
</form>
