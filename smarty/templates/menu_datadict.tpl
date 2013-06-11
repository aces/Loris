


<form method="post" action="main.php?test_name=datadict">
<table border="0" valign="top" class="std">
 <tr>
   <th nowrap="nowrap" colspan=4>Selection Filter</th>
 </tr>

 <tr>
  <td nowrap="nowrap">{$form.Description.label}</td>
  <td nowrap="nowrap">{$form.Description.html}</td>
  <td nowrap="nowrap">{$form.keyword.label}</td>
  <td nowrap="nowrap">{$form.keyword.html}</td>
 </tr>

 <tr>
  <td nowrap="nowrap">{$form.sourceFrom.label}</td>
  <td nowrap="nowrap">{$form.sourceFrom.html}</td>
  <td></td>
  <td  align="center"><input type="submit" name="filter" value="Show Data" class="button" />&nbsp;<input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=datadict&reset=true'" /></td>
 </tr>
<table>
</form>

<!--  title table with pagination -->
<table border="0" valign="bottom" width="100%">
<tr>
    <!-- title -->
    <td class="controlPanelSection">List of Profiles</td>
    <!-- display pagination links -->
    <td align="right">{$page_links}</td>
</tr>
</table>

<!-- start data table -->
<table  class ="fancytable" border="0" width="100%" class="listColorCoded">
<tr>
 <th nowrap="nowrap">No.</th>
    {section name=header loop=$headers}
    {** if $headers[header].name != "Name"**}
        <th nowrap="nowrap"><a href="main.php?test_name=datadict&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>                
        
    {**/if***}
    {/section}
    

</tr>
{section name=item loop=$items}
    <tr>
    <!-- print out data rows -->
    {section name=piece loop=$items[item]}
    
    	{if substr_count($items[item][piece].name, "___description")}
    	
    	    <td nowrap="nowrap" id ='{$items[item][piece].name}' class='description' contenteditable = "true" bgcolor="{$items[item][piece].bgcolor}">
    	    	 {$items[item][piece].value}
    	    </td>
		{else}
		 	{**if $items[item][piece].name != "Name"**}
	        	<td nowrap="nowrap" bgcolor="{$items[item][piece].bgcolor}"> 
  		  		{$items[item][piece].value}
				</td>
		 	{**/if***}
			
		{/if}
    {/section}
    </tr>           
{sectionelse}

	<tr><td colspan="12">No data found</td></tr>
{/section}
                    
<!-- end data table -->
</table>

