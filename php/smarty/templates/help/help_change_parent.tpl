<form action="context_help_popup.php" method="post" onsubmit="getFormData(this)">
<input type="hidden" name="helpID" value="{$help_file.helpID}" />
<input type="hidden" name="submit" value="true" />
<input type="hidden" name="topic" value="" />
<input type="hidden" name="content" value="" />
<table border="0" cellpadding="3" cellspacing="2" width="100%">
    <tr>
        <td class="tabox">
            Please select the topic under which to put this topic. The selected topic will be this topic's <em>parent</em>.
            You cannot choose a subtopic, or <em>child</em>, of this topic to be its parent. All topics must have a parent.
            If a topic is not listed below, it is a child of this topic, or is already its parent. You may select only one parent.
            It is not recommended to give a topic no parent, since this topic will be <em>orphaned</em>.
        </td>
    </tr>
    <tr>
        <td class="tabox">
            <select name="parentID">
{if $help_file.parentID != -1}
                <option value="-1">None</option>
{/if}
{section name=parents loop=$parents}
                <option value="{$parents[parents].helpID}">{$parents[parents].topic}</option>
{/section}
            </select>
{if $help_file.parentID != -1}
            <br /><input type="checkbox" name="add" value="1" /> Add the topic's previous parent as a related link?
{/if}
        </td>
    </tr>
    <tr>
        <td class="tabox">
            <input type="button" name="mode" value="Cancel" class="button" onclick="window.close()" />
            <input type="submit" name="mode" value="Change Parent" class="button" />
        </td>
    </tr>
</table>
</form>
