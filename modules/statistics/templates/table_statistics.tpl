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
<script type="text/javascript" src="{$baseurl}/statistics/js/table_statistics.js"></script>
<h2 class="statsH3">{$SectionHeader}</h2>
<h3 class="statsH3">{$TableHeader}</h3>
<p>{$Disclamer}</p>

<div class="row">
    {if $Subsection=="demographics" }
        <div class="col-sm-4">
            {html_options id="DemographicInstrument" options=$DropdownOptions name="$DropdownName" selected=$DropdownSelected class="form-control"}
        </div>
        <input type="checkbox" id="showVL" checked/> Show Visit Labels
        <button onClick="updateDemographicInstrument()" class="btn btn-primary btn-small">Submit Query</button>
    {/if}

    {if $Subsection==mri }
        <div class="col-sm-2">
            {html_options id="mri_type" options=$DropdownOptions name="$DropdownName" selected=$DropdownSelected class="form-control"}
        </div>
        <input type="checkbox" id="showVL" checked/> Show Visit Labels
        <button onClick="updateMRITable()" class="btn btn-primary btn-small">Submit Query</button>
    {/if}

    {if $Subsection=="data_entry" }
        <div class="col-sm-2">
            {html_options id="BehaviouralInstrument" options=$DropdownOptions name="$DropdownName" selected=$DropdownSelected class="form-control"}
        </div>
        <input type="checkbox" id="showVL" checked/> Show Visit Labels
        <button onClick="updateBehaviouralInstrument()" class="btn btn-primary btn-small">Submit Query</button>
    {/if}
</div>

<br>
<table id="bigtable" class="data table table-primary table-bordered">
    <tr>
        <th rowspan="1" id="tpcol">Subproject</th>
        {assign var='colspan' value=count($Subcategories)}
        {foreach key=proj item=name from=$Subprojects}
            <th colspan="{$colspan}">{$name|capitalize}</th>
        {/foreach}
        <th colspan="{$colspan}">Total Across Subprojects</th>
    </tr>
    <tr>
        <th>Categories</th>
        {foreach key=proj item=name from=$Subprojects}
            {* Go through each category once, and add the total
               for each cohort *}
            {foreach key=subcategory item=category from=$Subcategories}
                <th>{$category}</th>
            {/foreach}
        {/foreach}

        {* And then each category once for the totals *}
        {foreach key=subcategory item=category from=$Subcategories}
            <th>{$category}</th>
        {/foreach}
    </tr>
    <tr>
        {foreach item=center from=$Centers}
        {* Calculation for the colspan is:
                 (number of subprojects + 1 for total)
                 x
                 (number of subcategories + 1 for percent)
                 +1 for timepoint list
        *}
        {assign var='colspan' value=(count($Subcategories))*(count($Subprojects)+1)}
        <th>{$center.LongName}</th>
        <th colspan="{$colspan}" width="50%"><br></th>
    </tr>
    {foreach item=visit from=$Visits key=title}
        <tr id="visitrow">
            {assign var="rowtotal" value="0"}
            <td>{$title}</td>
            {foreach key="proj" item="value" from=$Subprojects}
                {assign var="subtotal" value="0" }
                {foreach key=sub item=subcat from=$Subcategories}
                    {if $subcat@index eq 0}
                        {assign var="Numerator" value=$data[$proj][$center.ID][$visit][$Subcategories.0]}
                        {assign var="subtotal" value={$data[$proj][$center.ID][$visit].total}}
                        {if $subtotal > 0 and $Numerator > 0}
                            {assign var="percent" value={math equation="x*y/z" x=$Numerator y=100 z=$subtotal format="%.0f"}}
                        {else}
                            {assign var="percent" value='0'}
                        {/if}
                        <td class="{$subcat|lower|regex_replace:"/ /":"_"}">{$data[$proj][$center.ID][$visit][$subcat]|default:"0"} ({$percent}%)</td>
                    {else}
                        <td class="{$subcat|lower|regex_replace:"/ /":"_"}">{$data[$proj][$center.ID][$visit][$subcat]|default:"0"}</td>
                    {/if}
                {/foreach}
            {/foreach}
            {* Totals for row *}
            {foreach key=sub item=subcat from=$Subcategories}
                {if $subcat@index eq 0}
                    {assign var="Numerator" value=$data[$center.ID][$visit][$Subcategories.0]}
                    {assign var="rowtotal" value=$data[$center.ID][$visit].total}
                    {if $rowtotal > 0 and $Numerator > 0}
                        {assign var="percent" value={math equation="x*y/z" x=$Numerator y=100 z=$rowtotal format="%.0f"}}
                    {else}
                        {assign var="percent" value='0'}
                    {/if}
                    <td class="{$subcat|lower|regex_replace:"/ /":"_"} total">{$data[$center.ID][$visit][$subcat]|default:"0"} ({$percent}%)</td>
                {else}
                    <td class="{$subcat|lower|regex_replace:"/ /":"_"} total">{$data[$center.ID][$visit][$subcat]|default:"0"}</td>
                {/if}
            {/foreach}
        </tr>
    {/foreach}
    <tr>
        <td class="subtotal">Site Total Across All Visits</td>
        {assign var="totalsitetotal" value="0"}
        {foreach key=proj item=value from=$Subprojects}
            {assign var="sitetotal" value="0"}
            {foreach key=sub item=subcat from=$Subcategories}
                {if $subcat@index eq 0}
                    {assign var="Numerator" value=$data[$proj][$center.ID][$Subcategories.0]}
                    {assign var="sitetotal" value=$data[$proj][$center.ID].total}
                    {if $sitetotal > 0 and $Numerator > 0}
                        {assign var="percent" value={math equation="x*y/z" x=$Numerator y=100 z=$sitetotal format="%.0f"}}
                    {else}
                        {assign var="percent" value='0'}
                    {/if}
                    <td class="{$subcat|lower|regex_replace:"/ /":"_"} subtotal">{$data[$proj][$center.ID][$subcat]|default:"0"} ({$percent}%)</td>
                {else}
                    <td class="{$subcat|lower|regex_replace:"/ /":"_"} subtotal">{$data[$proj][$center.ID][$subcat]|default:"0"}</td>
                {/if}
            {/foreach}
        {/foreach}
        {foreach key=sub item=subcat from=$Subcategories}
            {if $subcat@index eq 0}
                {assign var="Numerator" value=$data[$center.ID][$Subcategories.0]}
                {assign var="totalsitetotal" value=$data[$center.ID].total}
                {if $totalsitetotal > 0 and $Numerator > 0}
                    {assign var="percent" value={math equation="x*y/z" x=$Numerator y=100 z=$totalsitetotal format="%.0f"}}
                {else}
                    {assign var="percent" value='0'}
                {/if}
                <td class="{$subcat|lower|regex_replace:"/ /":"_"} total subtotal">{$data[$center.ID][$subcat]|default:"0"} ({$percent}%)</td>
            {else}
                <td class="{$subcat|lower|regex_replace:"/ /":"_"} total subtotal">{$data[$center.ID][$subcat]|default:"0"}</td>
            {/if}
        {/foreach}
    </tr>
    {/foreach}



    {* Totals at the bottom *}
    <tr>
        {assign var='colspan' value=(count($Subcategories))*(count($Subprojects)+1)}
        <th>Total</th>
        <th colspan="{$colspan}" width="50%"></th>
    </tr>
    {foreach from=$Visits item=visit key=title}
        <tr id="visitrow">
            <td>{$title}</td>
            {foreach from=$Subprojects key=proj item=value}
                {assign var="subtotal" value="0" }
                {foreach key=sub item=subcat from=$Subcategories}
                    {if $subcat@index eq 0}
                        {assign var="Numerator" value=$data[$proj][$visit][$Subcategories.0]}
                        {assign var="subtotal" value={$data[$proj][$visit].total}}
                        {if $subtotal > 0 and $Numerator > 0}
                            {assign var="percent" value={math equation="x*y/z" x=$Numerator y=100 z=$subtotal format="%.0f"}}
                        {else}
                            {assign var="percent" value='0'}
                        {/if}
                        <td class="{$subcat|lower|regex_replace:"/ /":"_"}">{$data[$proj][$visit][$subcat]|default:"0"} ({$percent}%)</td>
                    {else}
                        <td class="{$subcat|lower|regex_replace:"/ /":"_"}">{$data[$proj][$visit][$subcat]|default:"0"}</td>
                    {/if}
                {/foreach}
            {/foreach}
            {assign var="finaltotal" value="0" }
            {foreach key=sub item=subcat from=$Subcategories}
                {if $subcat@index eq 0}
                    {assign var="Numerator" value=$data[$visit][$Subcategories.0]}
                    {assign var="finaltotal" value=$data[$visit].total}
                    {if $finaltotal > 0 and $Numerator > 0}
                        {assign var="percent" value={math equation="x*y/z" x=$Numerator y=100 z=$finaltotal format="%.0f"}}
                    {else}
                        {assign var="percent" value='0'}
                    {/if}
                    <td class="{$subcat|lower|regex_replace:"/ /":"_"} total">{$data[$visit][$subcat]|default:"0"} ({$percent}%)</td>
                {else}
                    <td class="{$subcat|lower|regex_replace:"/ /":"_"} total">{$data[$visit][$subcat]|default:"0"}</td>
                {/if}
            {/foreach}
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
                {if $subcat@index eq 0}
                    {assign var="Numerator" value=$data[$proj][$Subcategories.0]}
                    {assign var="total" value=$data[$proj].total}
                    {if $total > 0 and $Numerator > 0}
                        {assign var="percent" value={math equation="x*y/z" x=$Numerator y=100 z=$total format="%.0f"}}
                    {else}
                        {assign var="percent" value='0'}
                    {/if}
                    <td class="{$subcat|lower|regex_replace:"/ /":"_"} subtotal">{$data[$proj][$subcat]|default:"0"} ({$percent}%)</td>
                {else}
                    <td class="{$subcat|lower|regex_replace:"/ /":"_"} subtotal">{$data[$proj][$subcat]|default:"0"}</td>
                {/if}
            {/foreach}
        {/foreach}
        {* Totals for grand total *}
        {foreach key=sub item=subcat from=$Subcategories}
            {if $subcat@index eq 0}
                {assign var="Numerator" value=$data[$Subcategories.0]}
                {assign var="totaltotal" value=$data.total}
                {if $totaltotal > 0 and $Numerator > 0}
                    {assign var="percent" value={math equation="x*y/z" x=$Numerator y=100 z=$totaltotal format="%.0f"}}
                {else}
                    {assign var="percent" value='0'}
                {/if}
                <td class="{$subcat|lower|regex_replace:"/ /":"_"} total subtotal">{$data[$subcat]|default:"0"} ({$percent}%)</td>
            {else}
                <td class="{$subcat|lower|regex_replace:"/ /":"_"} total subtotal">{$data[$subcat]|default:"0"}</td>
            {/if}
        {/foreach}
    </tr>
</table>
