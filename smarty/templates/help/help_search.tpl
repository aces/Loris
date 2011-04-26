            <h1>Found in Title</h1>
            
            <br />

            <table border="0" cellpadding="5" cellspacing="0" width="100%" class="tbl">
                <tr>
		    <th>Topic</th>
		    <th>Last Updated</th>
                </tr>
{section name=topic loop=$topics}
                <tr>
		    <td><a href="context_help_popup.php?helpID={$topics[topic].helpID}">{$topics[topic].topic}</a></td>
                    <td><span class="date">{$topics[topic].updated}</span></td>
                </tr>
{sectionelse}
                <tr>
		    <td colspan="2">No topics found</td>
                </tr>
{/section}
	    </table>
            
            <hr />

            <h1>Found in Content</h1>
            
            <br />

            <table border="0" cellpadding="5" cellspacing="0" width="100%" class="tbl">
                <tr>
		    <th>Topic</th>
		    <th>Last Updated</th>
                </tr>
{section name=content loop=$contents}
                <tr>
		    <td><a href="context_help_popup.php?helpID={$contents[content].helpID}">{$contents[content].topic}</a></td>
                    <td><span class="date">{$contents[content].updated}</span></td>
                </tr>
                <tr>
                    <td colspan="2"><span class="snippet">{$contents[content].snippet|default:"No snippet found"}</span></td>
                </tr>
{sectionelse}
                <tr>
		    <td colspan="2">No content found</td>
                </tr>
{/section}
	    </table>
