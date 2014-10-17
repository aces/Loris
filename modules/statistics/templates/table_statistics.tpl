{* Template to create a fancy stats table, such as the MRI breakdown
   or behavioural data breakdown.

    It requires the following variables to be set:
     - Header
     - DropdownOptions (options in the dropdown to change what you're seeing)
     - DropdownName (name that the selection is submitted as)
     - DropdownSelected (current option selected)
     - Subprojects (the valid subprojectIDs from the config file)
     - Subcategories (the ways this data is broken down)
     - Centers (the valid centerIDs from the psc table)
     - Visits (the visits to display)
     - Data (the data that populates the table)
 *}
<script type="text/javascript" src="GetJS.php?Module=statistics&file=table_statistics.js"></script>

<h2 class="statsH2">{$Header}</h2>

<div class="row">
{if $Subsection=="demographics" }
    <div class="col-sm-4">
        {html_options id="DemographicInstrument" options=$DropdownOptions name="$DropdownName" selected=$DropdownSelected class="form-control"}
    </div>
    <button onClick="updateDemographicTab()" class="btn btn-primary btn-small">Submit Query</button>
{/if}

{if $Subsection==mri }
    <div class="col-sm-2">
        {html_options id="mri_type" options=$DropdownOptions name="$DropdownName" selected=$DropdownSelected class="form-control"}
    </div>
    <button onClick="updateMRITable()" class="btn btn-primary btn-small">Submit Query</button>
{/if}

{if $Subsection=="data_entry" }
    <div class="col-sm-2">
        {html_options id="BehaviouralInstrument" options=$DropdownOptions name="$DropdownName" selected=$DropdownSelected class="form-control"}
    </div>
    <button onClick="updateBehaviouralInstrument()" class="btn btn-primary btn-small">Submit Query</button>
{/if}
</div>

<br>
<table class="data" width="80%">
    <tr>
        <th rowspan="2">Timepoint</th>
            {foreach key=proj item=name from=$Subprojects}
            {assign var='colspan' value=count($Subcategories)+1}
            <th colspan="{$colspan}">{$name|capitalize}</th>
            {/foreach}
        <th colspan="{$colspan}">Total</th>
    </tr>
    <tr>
        {foreach key=proj item=name from=$Subprojects}
        {* Go through each category once, and add the total
           for each cohort *}
        {foreach key=subcategory item=category from=$Subcategories}
        <th>{$category}</th>
        {/foreach}
        <th width="auto">% {$Subcategories.0}</th>
        {/foreach}

    {* And then each category once for the totals *}
        {foreach key=subcategory item=category from=$Subcategories}
        <th>{$category}</th>
        {/foreach}
        <th>Total % {$Subcategories.0}</th>
    </tr>

   {foreach item=center from=$Centers}
   {* Calculation for the colspan is:
            (number of subprojects + 1 for total) 
            x
            (number of subcategories + 1 for percent)
            +1 for timepoint list
   *}
   {assign var='colspan' value=(count($Subcategories)+1)*(count($Subprojects)+1)+1}
   <th colspan="{$colspan}" width="50%">{$center.LongName}<br></th></tr>
        {foreach item=visit from=$Visits key=title}
            {assign var="rowtotal" value="0"}

            {if $visit neq 'v06'}
            <tr>
            {/if}
                <td>{$title}</td>
                {foreach key="proj" item="value" from=$Subprojects}
                {assign var="subtotal" value="0" }
                {foreach key=sub item=subcat from=$Subcategories}
                    {if $visit eq 'v06' and $proj eq 2}
                        <td class="{$subcat|lower|regex_replace:"/ /":"_"}">NA</td>
                    {else}
                        <td class="{$subcat|lower|regex_replace:"/ /":"_"}">{$data[$proj][$center.ID][$visit][$subcat]|default:"0"}</td>
                        {assign var="subtotal" value=$subtotal+$data[$proj][$center.ID][$visit][$subcat] }
                        {assign var="rowtotal" value=$rowtotal+$data[$proj][$center.ID][$visit][$subcat] }
                    {/if}
                {/foreach}
                <td class="subtotal">
                    {assign var="Numerator" value=$data[$proj][$center.ID][$visit][$Subcategories.0]}
                    {if $subtotal > 0}
                        {assign var="percent" value={math equation="x*y/z" x=$Numerator y=100 z=$subtotal format="%.0f"}}
                    {else}
                        {assign var="percent" value='0'}
                    {/if}
                    {$percent}%
                </td>
                {/foreach}
                {* Totals for row *}
                {foreach key=sub item=subcat from=$Subcategories}
                    <td class="{$subcat|lower|regex_replace:"/ /":"_"} total">{$data[$center.ID][$visit][$subcat]|default:"0"}</td>
                {/foreach}
                <td class="total">
                    {assign var="Numerator" value=$data[$center.ID][$visit][$Subcategories.0]}
                    {if $rowtotal > 0}
                        {assign var="percent" value={math equation="x*y/z" x=$Numerator y=100 z=$rowtotal format="%.0f"}}
                    {else}
                        {assign var="percent" value='0'}
                    {/if}
                    {$percent}%
                </td>
            </tr>
            {/foreach}
            <tr>
            <td>Site Total</td>
            {assign var="totalsitetotal" value="0"}
            {foreach key=proj item=value from=$Subprojects}
                {assign var="sitetotal" value="0"}
                {foreach key=sub item=subcat from=$Subcategories}
                <td class="{$subcat|lower|regex_replace:"/ /":"_"} subtotal">
                    {assign var="sitetotal" value=$sitetotal+$data[$proj][$center.ID][$subcat] }
                    {$data[$proj][$center.ID][$subcat]|default:"0"}
                </td>
                {/foreach}
                <td class="subtotal">
                    {assign var="totalsitetotal" value=$totalsitetotal+$sitetotal }
                    {assign var="Numerator" value=$data[$proj][$center.ID][$Subcategories.0]}
                    {if $sitetotal > 0}
                        {assign var="percent" value={math equation="x*y/z" x=$Numerator y=100 z=$sitetotal format="%.0f"}}
                    {else}
                        {assign var="percent" value='0'}
                    {/if}
                    {$percent}%
                </td>
            {/foreach}
            {foreach key=sub item=subcat from=$Subcategories}
                <td class="{$subcat|lower|regex_replace:"/ /":"_"} total">
                    {$data[$center.ID][$subcat]|default:"0"}
                </td>
            {/foreach}
            <td class="total">
                {assign var="Numerator" value=$data[$center.ID][$Subcategories.0]}
                {if $totalsitetotal > 0}
                        {assign var="percent" value={math equation="x*y/z" x=$Numerator y=100 z=$totalsitetotal format="%.0f"}}
                    {else}
                        {assign var="percent" value='0'}
                    {/if}
                    {$percent}%
            </td>

            </tr>
      {/foreach}
      {* Totals at the bottom *}
	<tr>
        {assign var='colspan' value=(count($Subcategories)+1)*(count($Subprojects)+1)+1}
       <th colspan="{$colspan}" width="50%">Total</th>
    </tr>
	<tr>
        {foreach from=$Visits item=visit key=title}
            {if $visit neq 'v06'}
		<tr>
                <tr>
            {/if}
            <td>{$title}</td>     
            {foreach from=$Subprojects key=proj item=value}
                {assign var="subtotal" value="0" }
                {foreach key=sub item=subcat from=$Subcategories}
                    {if $visit eq 'v06' and $proj eq 2}
                        <td class="{$subcat|lower|regex_replace:"/ /":"_"}">NA</td>
                    {else}
                        <td class="{$subcat|lower|regex_replace:"/ /":"_"}">{$data[$proj][$visit][$subcat]|default:"0"}</td>
                        {assign var="subtotal" value=$subtotal+$data[$proj][$visit][$subcat] }
                    {/if}
                {/foreach}
                <td class="subtotal">
                    {assign var="Numerator" value=$data[$proj][$visit][$Subcategories.0]}
                    {if $subtotal > 0}
                        {assign var="percent" value={math equation="x*y/z" x=$Numerator y=100 z=$subtotal format="%.0f"}}
                    {else}
                        {assign var="percent" value='0'}
                    {/if}
                    {$percent}%
                </td>
            {/foreach}
            {assign var="finaltotal" value="0" }
            {foreach key=sub item=subcat from=$Subcategories}
                <td class="{$subcat|lower|regex_replace:"/ /":"_"} total">{$data[$visit][$subcat]|default:"0"}</td>
                {assign var="finaltotal" value=$finaltotal+$data[$visit][$subcat] }
            {/foreach}
            <td class="total">
                {assign var="Numerator" value=$data[$visit][$Subcategories.0]}
                {if $finaltotal > 0}
                        {assign var="percent" value={math equation="x*y/z" x=$Numerator y=100 z=$finaltotal format="%.0f"}}
                    {else}
                        {assign var="percent" value='0'}
                    {/if}
                    {$percent}%
            </td>
            </tr>
        {/foreach}
        <tr>
            <td class="total">Grand Total</td>
            {foreach key=proj item=name from=$Subprojects}
                {* Calculate the total instead of just looking it up, because of the potential
                   for invalid visit labels throwing off the lookup, or some visits intentionally
                   being excluded from stats *}
                {assign var="total" value="0"}
                {foreach key=sub item=subcat from=$Subcategories}
                    {assign var="total" value=$total+$data[$proj][$subcat]}
                    <td class="total" >{$data[$proj][$subcat]|default:"0"}</td>
                {/foreach}
                <td class="total">
                    {assign var="Numerator" value=$data[$proj][$Subcategories.0]}
                    {if $total > 0}
                        {assign var="percent" value={math equation="x*y/z" x=$Numerator y=100 z=$total format="%.0f"}}
                    {else}
                        {assign var="percent" value='0%'}
                    {/if}
                    {$percent}%
                (Total: {$total})
                </td>
            {/foreach}
            {* Totals for grand total *}
            {foreach key=sub item=subcat from=$Subcategories}
                
                <td class="total">
                    {if {$data.{'Cat'|cat: $subcat}}}
                        {$data.{'Cat'|cat: $subcat}}
                    {else}
                        0
                    {/if}
                </td>
            {/foreach}
            <td class="total">
                {if $data.total != 0}
                    {math equation="x*y/z" x=$data.{'Cat'|cat: $Subcategories[0]} y=100 z=$data.total format="%.0f"}%
                {/if}
                (Total: {$data.total})
            </td>
        </tr>
    </table>
