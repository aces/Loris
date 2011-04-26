<h3 class="controlPanelSection">Administration</h3>
<ul class="controlPanel">
{section name=item loop=$administration}
    <li>
        <img src="images/{$administration[item].icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />
    {if $access.administration and $administration[item].showlink}
        <a href="main.php?test_name={$test_name}&commentID={$commentID}&candID={$candID}&sessionID={$sessionID}&setAdministration={$administration[item].label}">{$administration[item].label}</a>
    {else}
        {$administration[item].label}
    {/if}
    </li>
{/section}
</ul>

{if $validity}
<h3 class="controlPanelSection">Validity</h3>
<ul class="controlPanel">
{section name=item loop=$validity}
    <li>
        <img src="images/{$validity[item].icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />
    {if $access.validity and $validity[item].showLink}
        <a href="main.php?test_name={$test_name}&commentID={$commentID}&candID={$candID}&sessionID={$sessionID}&setValidity={$validity[item].label}">{$validity[item].label}</a>
    {else}
        {$validity[item].label}
    {/if}
    </li>
{/section}
</ul>
{/if}
<h3 class="controlPanelSection">Data Entry</h3>
<ul class="controlPanel">
{section name=item loop=$data_entry}
    <li>
        <img src="images/{$data_entry[item].icon|default:'default'}.gif" alt="" border="0" width="12" height="12" />
    {if $access.data_entry and $data_entry[item].showlink}
        <a href="main.php?test_name={$test_name}&commentID={$commentID}&candID={$candID}&sessionID={$sessionID}&setDataEntry={$data_entry[item].label}">{$data_entry[item].label}</a>
    {else}
        {$data_entry[item].label}
    {/if}
    </li>
{/section}
</ul>



{if $subtests != ""}
    <!-- instrument pages -->
    <h3 class="controlPanelSection">Subtests</h3>
    <!-- top button -->
    {if $subtest != ""}
        {assign var=icon value="transfer"}
    {else}
        {assign var=icon value="book"}
    {/if}
    <ul class="controlPanel">
        <li>
            <img src="images/{$icon}.gif" alt="" width="12" height="12" />&nbsp;
            {if $subtest != ""}
                        <a href="main.php?test_name={$test_name}&candID={$candID}&sessionID={$sessionID}&commentID={$commentID}">Top</a>
            {else}
                        Top
            {/if}
        </li>
        <!-- subtest buttons -->
        {section name=item loop=$subtests}
            {if $subtest != $subtests[item].Name}
                {assign var=icon value="transfer"}
            {else}
                {assign var=icon value="book"}
            {/if}
            <li>
                <img src="images/{$icon}.gif" alt="" width="12" height="12" />&nbsp;
            {if $subtest != $subtests[item].Name}
                <a href="main.php?test_name={$test_name}&candID={$candID}&sessionID={$sessionID}&commentID={$commentID}&subtest={$subtests[item].Name}">{$subtests[item].Description}</a>
            {else}
                {$subtests[item].Description}
            {/if}
            </li>
            {/section}
    </ul>
{/if}
