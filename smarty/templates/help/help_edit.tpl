<form action="context_help_popup.php" name="edit" method="post">
    <h1>You are now editing.</h1>

    <h2>First time? Read the <a href="context_help_popup.php?helpID={$guide.helpID}" target="instructions">instructions</a>.</h2>

    <input type="hidden" name="helpID" value="{$help_file.helpID}" />
    <input type="hidden" name="parentID" value="{$help_file.parentID}" />

    <p>
        Topic: <br />
        <input type="text" name="topic" size="45" maxlength="100" value="{$help_file.topic}" />
    </p>

    <p>Content: <br />
        <textarea name="content" rows="20" cols="75">{$help_file.content}</textarea>
    </p>

    <hr />

    <table border="0" cellpadding="5" cellspacing="0" width="100%" class="std">
        <tr>
            <td>
            Related links: 
            {section name=links loop=$related_links}
            <a href="context_help_popup.php?helpID={$related_links[links].helpID}">{$related_links[links].topic}</a>{if not $smarty.section.links.last}, {/if}
            {sectionelse}
            None
            {/section}
            <input type="button" name="addlinks" value="Add Links" onclick="doEdit(this.form, 'Add Links')" class="button" />
            {if $related_links}
            <input type="button" name="removelinks" value="Remove Links" onclick="doEdit(this.form, 'Remove Links')" class="button" />
            {/if}
            </td>
        </tr>
        <tr>
            <td>
            Subtopics: 
            {section name=child loop=$subtopics}
            <a href="context_help_popup.php?helpID={$subtopics[child].helpID}">{$subtopics[child].topic}</a>{if not $smarty.section.child.last}, {/if}
            {sectionelse}
            None
            {/section}
            </td>
        </tr>
        <tr>
            <td>
            Parent:
            {if $help_file.parentID and $help_file.parentID != -1}
            <a href="context_help_popup.php?helpID={$parent.helpID}">{$parent.topic}</a>
            {else}
            None
            {/if}
            <input type="button" name="changeparent" value="Change Parent" onclick="doEdit(this.form, 'Change Parent')" class="button" />
            </td>
        </tr>
    </table>

    <hr />

    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td valign="top">
            Created: {$help_file.created|date_format:"%A, %B %e, %Y"|default:"Never"}<br />
            Last Update: {$help_file.updated|date_format:"%A, %B %e, %Y"|default:"Never"}<br />
            </td>
            <td valign="top" align="right">
                <input type="submit" name="mode" value="Cancel" class="button" />
                <input type="submit" name="mode" value="Save" class="button" />
                <input type="submit" name="mode" value="Finish" class="button" />
            </td>
        </tr>
    </table>
</form>
