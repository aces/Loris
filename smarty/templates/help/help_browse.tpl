            <h1>{$pagetitle}</h1>
            
            <br />

            <table border="0" cellpadding="5" cellspacing="0" width="100%" class="tbl">
                <tr>
		    <th>Topic</th>
		    <th>Last Updated</th>
                </tr>
{section name=rows loop=$list}
                <tr>
		    <td><a href="context_help_popup.php?helpID={$list[rows].helpID}">{$list[rows].topic|indent:$list[rows].level:"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"}</a></td>
                    <td><span class="date">{$list[rows].updated}</span></td>
                </tr>
{/section}
	    </table>
