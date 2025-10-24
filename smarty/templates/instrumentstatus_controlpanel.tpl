<script type="text/javascript" src="{$baseurl}/js/instrument_controlpanel_control.js"></script>
{if $InstrumentResetting }
    <h3 class="controlPanelSection">{dgettext("instruments", "Clear Instrument")}</h3>
    <ul class="controlPanel">
        <li><div id="deleteInstrumentBtn"></div></li>
    </ul>
    <script type="text/javascript" src="{$baseurl}/instruments/js/ControlpanelDeleteInstrumentData.js"></script>
    <script type="text/javascript">
        ReactDOM.createRoot(
            document.getElementById("deleteInstrumentBtn")
        ).render(RControlpanelDeleteInstrumentData());
    </script>
{/if}
<h3 class="controlPanelSection">{dgettext("loris", "Administration")}</h3>
<ul class="controlPanel fa-ul">
    {section name=item loop=$administration}
        <li>
            <span class="fa-li"><i class="{$administration[item].icon|default:'far fa-square'}"></i></span>
            {if $access.administration and $administration[item].showlink}
                <a href="?commentID={$commentID}&candID={$candID}&sessionID={$sessionID}&setAdministration={$administration[item].label}&test_name={$test_name}">{dgettext("loris", $administration[item].label)}</a>
            {else}
                {dgettext("loris", $administration[item].label)}
            {/if}
        </li>
    {/section}
</ul>
{if $validity}
    <h3 class="controlPanelSection">{dgettext("instruments", "Validity")}</h3>
    <ul class="controlPanel fa-ul">
        {section name=item loop=$validity}
            <li>
                <span class="fa-li"><i class="{$validity[item].icon|default:'far fa-square'}"></i></span>
                {if $access.validity and $validity[item].showLink}
                    <a href="?commentID={$commentID}&candID={$candID}&sessionID={$sessionID}&setValidity={$validity[item].label}&test_name={$test_name}">{dgettext("instruments", $validity[item].label)}</a>
                {else}
                    {dgettext("instruments", $validity[item].label)}
                {/if}
            </li>
        {/section}
    </ul>
{/if}
<h3 class="controlPanelSection">{dgettext("loris", "Data Entry")}</h3>
<ul class="controlPanel fa-ul">
    {section name=item loop=$data_entry}
        <li>
            <span class="fa-li"><i class="{$data_entry[item].icon|default:'far fa-square'}"></i></span>
            {if $access.data_entry and $data_entry[item].showlink}
                <a href="?commentID={$commentID}&candID={$candID}&sessionID={$sessionID}&setDataEntry={$data_entry[item].label}&test_name={$test_name}">{dgettext("loris", $data_entry[item].label)}</a>
            {else}
                {if $data_entry[item].tooltip}
                    <span data-toggle="tooltip" data-placement="right" title="{$data_entry[item].tooltip}">
                      {dgettext("loris", $data_entry[item].label)}
                    </span>
                {else}
                    {dgettext("loris", $data_entry[item].label)}
                {/if}
            {/if}
        </li>
    {/section}
</ul>
{if $subtests != ""}
    <!-- instrument pages -->
    <h3 class="controlPanelSection">{dgettext("instruments", "Subtests")}</h3>
    <!-- top button -->
    {if $subtest != ""}
        {assign var=icon value="far fa-file-alt"}
    {else}
        {assign var=icon value="fas fa-file-alt"}
    {/if}
    <ul class="controlPanel fa-ul">
        <li>
            <span class="fa-li"><i class="{$icon}" width="12" height="12"></i></span>
            {if $subtest != ""}
                <a href="{$baseurl}/instruments/{$test_name}/?candID={$candID}&sessionID={$sessionID}&commentID={$commentID}">{dgettext("instruments", "Top")}</a>
            {else}
                {dgettext("instruments", "Top")}
            {/if}
        </li>
        <!-- subtest buttons -->
        {section name=item loop=$subtests}
            {if $subtest != $subtests[item].Name}
                {assign var=icon value="far fa-file-alt"}
            {else}
                {assign var=icon value="fas fa-file-alt"}
            {/if}
            <li>
                <span class="fa-li"><i class="{$icon}" width="12" height="12"></i></span>
                {if $subtest != $subtests[item].Name}
                    <a href="{$baseurl}/instruments/{$test_name}/{$subtests[item].Name}/?candID={$candID}&sessionID={$sessionID}&commentID={$commentID}">{$subtests[item].Description}</a>
                {else}
                    {$subtests[item].Description}
                {/if}
            </li>
        {/section}
    </ul>
{/if}
