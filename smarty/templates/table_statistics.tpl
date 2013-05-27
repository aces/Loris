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
<script type="text/javascript" src="js/modules/table_statistics.js"></script>

<h2 class="statsH2">{$Header}</h2>

{if $Subsection!="mri" }
    {html_options id="instrument" options=$DropdownOptions name="$DropdownName" selected=$DropdownSelected}
    <button onClick="updateDemographicInstrument()">Submit Query</button>
{/if}

{if $Subsection==mri }
   {html_options id="mri_type" options=$DropdownOptions name="$DropdownName" selected=$DropdownSelected}
    <button onClick="updateMRITable()">Submit Query</button>
{/if}


</h2>

<table class="data" width="80%">
    <tr>
        <th rowspan="2">Timepoint</th>
            {foreach key=proj item=name from=$Subprojects}
            <th colspan="{php}print count($this->get_template_vars("Subcategories"))+1;{/php}">{$name|capitalize}</th>
            {/foreach}
        <th colspan="{php}print count($this->get_template_vars("Subcategories"))+1;{/php}">Total</th>
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
   <th colspan="{php}print (count($this->get_template_vars("Subcategories"))+1)*(count($this->get_template_vars("Subprojects"))+1)+1;{/php}" width="50%">{$center.LongName}<br></th></tr>
        {foreach item=visit from=$Visits key=title}
            {assign var="rowtotal" value="0}

            {if $visit neq 'v06'}
            <tr>
            {/if}
                <td>{$title}</td>
                {foreach key=proj item=value from=$Subprojects}
                    {* Special case. proj=2 means its a 12 month visit.
                     * and it's impossible to have a 6 month visit for
                     * a 12 month recruit. *}
                {assign var="subtotal" value="0" }
                {foreach key=sub item=subcat from=$Subcategories}
                    {if $visit eq 'v06' and $proj eq 2}
                        <td class="{$subcat|lower|regex_replace:"/ /":"_"}">NA</td>
                    {else}
                        <td class="{$subcat|lower|regex_replace:"/ /":"_"}">{$data[$proj][$center.ID][$visit][$subcat]|default:"0"}</td>
                        {assign var="subtotal" value=`$subtotal+$data[$proj][$center.ID][$visit][$subcat]` }
                        {assign var="rowtotal" value=`$rowtotal+$data[$proj][$center.ID][$visit][$subcat]` }
                    {/if}
                {/foreach}
                <td class="subtotal">
                    {assign var="Numerator" value=`$data[$proj][$center.ID][$visit][$Subcategories.0]`}
                    {php}
                        $Numerator = $this->get_template_vars("Numerator");
                        $Denominator = $this->get_template_vars("subtotal");
                        if($Denominator > 0) {
                            print round($Numerator*100/$Denominator);
                            print "%";
                        } else {
                            print "0%";
                        }
                    {/php}
                </td>
                {/foreach}
                {* Totals for row *}
                {foreach key=sub item=subcat from=$Subcategories}
                    <td class="{$subcat|lower|regex_replace:"/ /":"_"} total">{$data[$center.ID][$visit][$subcat]|default:"0"}</td>
                {/foreach}
                <td class="total">
                    {assign var="Numerator" value=`$data[$center.ID][$visit][$Subcategories.0]`}
                    {php}
                        $Numerator = $this->get_template_vars("Numerator");
                        $Denominator = $this->get_template_vars("rowtotal");
                        if($Denominator > 0) {
                            print round($Numerator*100/$Denominator);
                            print "%";
                        } else {
                            print "0%";
                        }
                    {/php}
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
                    {assign var="sitetotal" value=`$sitetotal+$data[$proj][$center.ID][$subcat]` }
                    {$data[$proj][$center.ID][$subcat]|default:"0"}
                </td>
                {/foreach}
                <td class="subtotal">
                    {assign var="totalsitetotal" value=`$totalsitetotal+$sitetotal` }
                    {assign var="Numerator" value=`$data[$proj][$center.ID][$Subcategories.0]`}
                    {php}
                        $Numerator = $this->get_template_vars("Numerator");
                        $Denominator = $this->get_template_vars("sitetotal");
                        if($Denominator > 0) {
                            print round($Numerator*100/$Denominator);
                            print "%";
                        } else {
                            print "0%";
                        }
                    {/php}
                </td>
            {/foreach}
            {foreach key=sub item=subcat from=$Subcategories}
                <td class="{$subcat|lower|regex_replace:"/ /":"_"} total">
                    {$data[$center.ID][$subcat]|default:"0"}
                </td>
            {/foreach}
            <td class="total">
                {assign var="Numerator" value=`$data[$center.ID][$Subcategories.0]`}
                {php}
                    $Numerator = $this->get_template_vars("Numerator");
                    $Denominator = $this->get_template_vars("totalsitetotal");
                    if($Denominator > 0) {
                        print round($Numerator*100/$Denominator);
                        print "%";
                    } else {
                        print "0%";
                    }
                {/php}
            </td>

            </tr>
      {/foreach}
      {* Totals at the bottom *}
	<tr>
       <th colspan="{php}print (count($this->get_template_vars("Subcategories"))+1)*(count($this->get_template_vars("Subprojects"))+1)+1;{/php}" width="50%">Total</th>
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
                        {assign var="subtotal" value=`$subtotal+$data[$proj][$visit][$subcat]` }
                    {/if}
                {/foreach}
                <td class="subtotal">
                    {assign var="Numerator" value=`$data[$proj][$visit][$Subcategories.0]`}
                    {php}
                        $Numerator = $this->get_template_vars("Numerator");
                        $Denominator = $this->get_template_vars("subtotal");
                        if($Denominator > 0) {
                            print round($Numerator*100/$Denominator);
                            print "%";
                        } else {
                            print "0%";
                        }
                    {/php}
                </td>
            {/foreach}
            {assign var="finaltotal" value="0" }
            {foreach key=sub item=subcat from=$Subcategories}
                <td class="{$subcat|lower|regex_replace:"/ /":"_"} total">{$data[$visit][$subcat]|default:"0"}</td>
                {assign var="finaltotal" value=`$finaltotal+$data[$visit][$subcat]` }
            {/foreach}
            <td class="total">
                {assign var="Numerator" value=`$data[$visit][$Subcategories.0]`}
                    {php}
                        $Numerator = $this->get_template_vars("Numerator");
                        $Denominator = $this->get_template_vars("finaltotal");
                        if($Denominator > 0) {
                            print round($Numerator*100/$Denominator);
                            print "%";
                        } else {
                            print "0%";
                        }
                    {/php}
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
                    {assign var="total" value=`$total+$data[$proj][$subcat]`}
                    <td class="total" >{$data[$proj][$subcat]|default:"0"}</td>
                {/foreach}
                <td class="total">
                    {assign var="Numerator" value=`$data[$proj][$Subcategories.0]`}
                    {php}
                        $Numerator = $this->get_template_vars("Numerator");
                        $Denominator= $this->get_template_vars("total");
                        if($Denominator != 0) {
                            print round($Numerator*100 / $Denominator);
                            print "%";
                        }
                {/php}
                (Total: {$total})
                </td>
            {/foreach}
            {* Totals for grand total *}
            {foreach key=sub item=subcat from=$Subcategories}
                
                <td class="total">{php}
                    $data = $this->get_template_vars("data");
                    $subcat= $this->get_template_vars("subcat");
                    if($data["Cat" . $subcat]) {
                        print $data["Cat" . $subcat];
                    } else {
                        print "0";
                    }
                {/php}
                </td>
            {/foreach}
            <td class="total">
                {php}
                    $Subcats = $this->get_template_vars("Subcategories");
                    $data = $this->get_template_vars("data");
                    $Numerator = $data["Cat" . $Subcats[0]];
                    $Denominator = $data['total'];
                    if($Denominator != 0) {
                        print round($Numerator*100 / $Denominator);
                        print "%";
                    }
                {/php}
                (Total: {$data.total})
            </td>
        </tr>
    </table>
