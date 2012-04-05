<form method="post" name="parameterTimepointFilterForm" action="main.php?test_name=timepoint_flag&mode={$mode}&pageID={$pageID}">
<table border="0" valign="top" class="std">
<!--    <tr>
        <th nowrap="nowrap" colspan="2">Selection Filter</th>
    </tr>-->
    <tr>
        <td nowrap="nowrap">Mode:</td>
        <td nowrap="nowrap">{$form.mode.html}</td>
    </tr>
    {if $mode == "subject"}
        <tr>
            <td nowrap="nowrap">Show Subjects:</td>
            <td nowrap="nowrap">{$form.last_change.html}</td>
        </tr>
    {/if}
    {if $mode != ""}
        <tr>
            <td nowrap="nowrap">Objective:</td>
            <td nowrap="nowrap">{$form.subprojectID.html}</td>
        </tr>
    {/if}
    {if $mode != ""}
        <tr>
            <td nowrap="nowrap">Site:</td>
            <td nowrap="nowrap">{$form.centerID.html}</td>
        </tr>
    {/if}
    {if $mode == "subject" && $form.centerID.value != ""}
        <tr>
            <td nowrap="nowrap">DCCID / Visit:</td>
            <td nowrap="nowrap">{$form.subject.html}</td>
        </tr>
    {/if}
    {if $mode == "flag"}
        <tr>
            <td nowrap="nowrap">Flag:</td>
            <td nowrap="nowrap">{$form.flag.html}</td>
        </tr>
    {/if}
    <tr>
        <td colspan="2" align="right">
            <input type="submit" name="filter" value="Show Data" class="button" />&nbsp;
            <input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=timepoint_flag&reset=true'" />
        </td>
    </tr> 
    <tr>
        <td colspan="2" align="left">
            <IMG src="images/zoom_in.gif"> - roll-over with a mouse to get more info.
        </td>
    </tr> 
<table>

<!-- Table w/ final exclusion flag -->
{if $timepoint_flag_evaluate}
    <table border="0" valign="bottom">
        <tr class="controlPanelSection">
            <td class="controlPanelSection">Evaluate Exclusionary Flags</td>
        </tr><tr>
    {section name=item loop=$timepoint_flag_evaluate}
        <tr>
            <td class="controlPanelItem">
            <img src="images/{$timepoint_flag_evaluate[item].icon|default:'locked'}.gif" alt="" border="0" width="12" height="12" />
    	{if $timepoint_flag_evaluate[item].showlink}
            <a href="main.php?test_name=timepoint_flag&mode={$mode}&pageID={$pageID}&setBVLQCExclusionFlag_SessionID={$timepoint_flag_evaluate_ID}&setBVLQCExclusionFlag={$timepoint_flag_evaluate[item].value}">
        {/if}
            {$timepoint_flag_evaluate[item].label}</a></td>
        </tr>
    {/section}
    </table>
{/if}
</form>

{if $mode!=""}
<table border="0" valign="bottom" width="100%">
    <tr>
        <td class="controlPanelSection">List of Flags</td>
        <td align="right">{$page_links}</td>
    </tr>
</table>

<table border="0" width="100%" class="listColorCoded">
<FORM method="post" action="main.php?test_name=timepoint_flag&mode={$mode}&pageID={$pageID}">
    <tr>
        <th nowrap="nowrap">No.</th>
        {section name=header loop=$headers}
                <th nowrap="nowrap">{$headers[header].displayName}</th>
        {/section}
    </tr>
        {section name=item loop=$items}
        
            <!--current flag name and sessionID-->
            {assign var="currSessionID" value=$items[item][1].value}
            {assign var="currCenterID" value=$items[item][2].value}
            {assign var="currFlagName" value=$items[item][3].value}
            {assign var="currFlagLabel" value=$items[item][4].value}
            {assign var="currFlagType" value=$items[item][5].value}
            {assign var="currFlagCategory" value=$items[item][6].value}
            {if $mode=='flag'}
                {assign var="currCandID" value=$items[item][7].value}
            {/if}
            
            {assign var="showLink" value=$items[item].showLink}
        
            <tr>
                {section name=piece loop=$items[item]}
        
                    {if $mode == 'subject'}
                        {if $items[item][piece].name == "flagLabel"}
                            <td nowrap="nowrap" class="{$items[item][piece].class}">
                            {$items[item][piece].value}
                                {if $items[item][piece].desc}
                                    <ACRONYM title="{$items[item][piece].desc}"><IMG src="images/zoom_in.gif" border="0"></ACRONYM>
                                {/if}
                            </td>
                        {/if}
                    {else}
                        {if $items[item][piece].name == "PSC" || $items[item][piece].name == "DCCID" || $items[item][piece].name == "Visit_label"}
                            <td nowrap="nowrap">
                                {$items[item][piece].value}
                                {if $items[item][piece].name == "DCCID"}
                                    {if $items[item][piece].desc}
                                        <ACRONYM title="{$items[item][piece].desc}"><IMG src="images/zoom_in.gif" border="0"></ACRONYM>
                                    {/if}
                                {/if}
                            </td>
                        {/if}
                    {/if}
                    
                    {if $items[item][piece].name == "rowCount" || $items[item][piece].name == "SubprojectID" || $items[item][piece].name == "last_change"}
                        <td>
                            {$items[item][piece].value}
                        </td>
                    {/if}
                    
                    {if $items[item][piece].name == "triggers" || $items[item][piece].name == "review fields"}
                        <TD nowrap="nowrap">
                            <TABLE border="0">
                                {section name=titem loop=$items[item][piece].items}
                                    {if $items[item][piece].items[titem] <> ""}
                                        <TR><TH>{$items[item][piece].headers[titem]}</TH><TD align="left">{$items[item][piece].items[titem]}</TD></TR>
                                    {/if}
                                {/section}
                            </TABLE>
                        </TD>
                    {/if}
                        
                    {if $items[item][piece].name == "status"}
                        {if $items[item][piece].value == "ON"}
                            {assign var="checkON" value='checked'}
                            {assign var="checkOFF" value=''}
                        {elseif $items[item][piece].value == "OFF"}
                            {assign var="checkON" value=''}
                            {assign var="checkOFF" value='checked'}
                        {else}
                            {assign var="checkON" value=''}
                            {assign var="checkOFF" value=''}
                        {/if}
                        <TD nowrap="nowrap" class="{$currFlagType}Type">
                            {if $showLink}
                                <input type="radio" name="dataSet[{$currFlagName}][{$currSessionID}][{$items[item][piece].name}]" value="ON" {$checkON} />ON &nbsp;
                                <input type="radio" name="dataSet[{$currFlagName}][{$currSessionID}][{$items[item][piece].name}]" value="OFF" {$checkOFF} />OFF
                                <input type="radio" name="dataSet[{$currFlagName}][{$currSessionID}][{$items[item][piece].name}]" value="NULLme" />Clear Choice
                            {else}
                                {$items[item][piece].value}
                            {/if}
                        </TD>
                    {/if}
                        
                    {if $items[item][piece].name == "pending_issue"}
                        {if $items[item][piece].value == "Y"}
                            {assign var="checkN" value=''}
                            {assign var="checkY" value='checked'}
                        {else}
                            {assign var="checkN" value='checked'}
                            {assign var="checkY" value=''}
                        {/if}
                        <TD nowrap="nowrap">
                            {if $showLink}
                                <input type="radio" name="dataSet[{$currFlagName}][{$currSessionID}][{$items[item][piece].name}]" value="N" {$checkN} />N &nbsp;
                                <input type="radio" name="dataSet[{$currFlagName}][{$currSessionID}][{$items[item][piece].name}]" value="Y" {$checkY} />Y
                            {else}
                                {$items[item][piece].value}
                            {/if}
                        </TD>
                    {/if}
        
                    {if $items[item][piece].name == "comment_text"}
                        <TD align="left" valign="top">
                        {if $showLink}
                            {if $items[item][piece].errorMessage!=""}
                                <font color="red">{$items[item][piece].errorMessage}</font>
                                <BR>
                            {/if}
                            Add:<BR>
                            <input type="text" size="40" name="dataSet[{$currFlagName}][{$currSessionID}][comment_text_new]" value="{$items[item][piece].comment_text_new}"/>
                            <BR>Edit:<BR>
                            <input type="text" size="40" name="dataSet[{$currFlagName}][{$currSessionID}][{$items[item][piece].name}]" value="{$items[item][piece].value|escape:'html'}" />
                       {else}
                            {$items[item][piece].value}
                       {/if}
                        </TD>
                   {/if}
        
                    {if $items[item][piece].name == "comment_pending_text"}
                        <TD>
                            {if $showLink}
                                <input type="text" size="20" name="dataSet[{$currFlagName}][{$currSessionID}][comment_pending_text_new]" value="{$items[item][piece].comment_pending_text_new}"/>
                                <BR>
                            {/if}
                            {$items[item][piece].value}
                        </TD>
                    {/if}
                {/section}
            </tr>
        {sectionelse}
            <tr><td colspan="13">No flags found</td></tr>
        {/section}
    <tr>
        <td colspan="13" align="left">
        <input type="submit" name="submit" value="Save Data" class="button" />
        </td>
    </tr>
</FORM>
</table>
{/if}
