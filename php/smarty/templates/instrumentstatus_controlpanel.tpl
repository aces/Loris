<tr><td class="controlPanelSection">Administration</td></tr>
{section name=item loop=$administration}
                <tr>
                    <td class="controlPanelItem">
{if $access.administration and $administration[item].showlink}
                        <img src="images/{$administration[item].icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;<a href="main.php?test_name={$test_name}&commentID={$commentID}&candID={$candID}&sessionID={$sessionID}&setAdministration={$administration[item].label}">{$administration[item].label}</a>
{else}
                        <img src="images/{$administration[item].icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;{$administration[item].label}
{/if}
                    </td>
                </tr>
{/section}
                <tr><td>&nbsp;</td></tr>

                <tr><td class="controlPanelSection">Data Entry</td></tr>
{section name=item loop=$data_entry}
                <tr>
                    <td class="controlPanelItem">
{if $access.data_entry and $data_entry[item].showlink}
                        <img src="images/{$data_entry[item].icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;<a href="main.php?test_name={$test_name}&commentID={$commentID}&candID={$candID}&sessionID={$sessionID}&setDataEntry={$data_entry[item].label}">{$data_entry[item].label}</a>
{else}
                        <img src="images/{$data_entry[item].icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />&nbsp;{$data_entry[item].label}
{/if}
                    </td>
                </tr>
{/section}
                <tr><td>&nbsp;</td></tr>

        {if $subtests != ""}
                <!-- instrument pages -->
                <tr><td class="controlPanelSection">Subtests</td></tr>
           
                <!-- top button -->
            {if $subtest != ""}
                {assign var=icon value="transfer"}
            {else}
                {assign var=icon value="book"}
            {/if}
                <tr>
                    <td class="controlPanelItem">
                        <img src="images/{$icon}.gif" alt="" width="12" height="12" />&nbsp;
            {if $subtest != ""}
                        <a href="main.php?test_name={$test_name}&candID={$candID}&sessionID={$sessionID}&commentID={$commentID}">Top</a>
            {else}
                        Top
            {/if}
                    </td>
                </tr>
            
                <!-- subtest buttons -->
            {section name=item loop=$subtests}
                {if $subtest != $subtests[item].Name}
                    {assign var=icon value="transfer"}
                {else}
                    {assign var=icon value="book"}
                {/if}
                <tr>
                    <td class="controlPanelItem">
                        <img src="images/{$icon}.gif" alt="" width="12" height="12" />&nbsp;
                {if $subtest != $subtests[item].Name}
                        <a href="main.php?test_name={$test_name}&candID={$candID}&sessionID={$sessionID}&commentID={$commentID}&subtest={$subtests[item].Name}">{$subtests[item].Description}</a>
                {else}
                        {$subtests[item].Description}
                {/if}
                    </td>
                </tr>
            {/section}
                <tr><td>&nbsp;</td></tr>
        {/if}
