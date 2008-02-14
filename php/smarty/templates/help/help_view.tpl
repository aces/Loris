	    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td>
                        <h1>{$help_file.topic|default:"No documentation"}</h1>
                    </td>
                </tr>
            </table>

            <p>{$help_file.content|nl2br|default:"Sorry, we could not find any documentation."}</p>

{if $help_file.helpID}
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
{if $editor == true}
                        <a href="context_help_popup.php?helpID={$help_file.helpID}&mode=Edit"><img src="images/pencil.gif" width="12" height="12" border="0" alt="" />&nbsp;Edit this documentation</a><br />
                        <a href="context_help_popup.php?parentID={$help_file.helpID}&mode=Create"><img src="images/new.gif" width="12" height="12" border="0" alt="" />&nbsp;Add documentation under this topic</a><br />
{if $hash != "" and $help_file.helpID == $instruments.helpID}
                        <a href="context_help_popup.php?{$query}&mode=Create"><img src="images/new.gif" width="12" height="12" border="0" alt="" />&nbsp;Create documentation for {$topic}</a><br />
{/if}
{/if}
		    </td>
                </tr>
	    </table>
{/if}
