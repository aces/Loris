            <h1>{$pagetitle}</h1>
            
            <br />

            <table border="0" cellpadding="5" cellspacing="0" width="100%" class="tbl">
{section name=rows loop=$list}
{if $list[rows].section != $section}
                <tr>
		    <th colspan="2">{$list[rows].section}</th>
                </tr>
{/if}
                <tr>
		    <td><a href="context_help_popup.php?helpID={$list[rows].helpID}">{$list[rows].topic}</a> <span class="date">{$list[rows].updated}</span></td>
                </tr>
{assign var="section" value=$list[rows].section}
{/section}
	    </table>
