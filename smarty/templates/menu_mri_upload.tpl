
{if $upload_success}
    <p>Upload Successful<br/></p>
{/if}

{if $dicom_success}
    <p>Dicoms Are inserted<br/></p>
{/if}



<br />
<form method="post" name="mri_upload" id="mri_upload" enctype="multipart/form-data">
<table class="std">
    <!-- table title -->
    <tr><th colspan="6">Upload a New File</th></tr>

    {foreach from=$form.errors item=error}
    <tr>
        <td nowrap="nowrap" colspan="2" class="error">{$error}</td>
    </tr>
    {/foreach}

   <tr>
  		<td nowrap="nowrap">{$form.mri_file.label}</td>
  		<td nowrap="nowrap">{$form.mri_file.html}</td>
  	</tr>
  	<tr>
       <td colspan="2">
         Note: file name should be of type .tgz or tar.gz or .zip
       </td>
     </tr>
     <tr>
  		<td nowrap="nowrap">{$form.SourceLocation.label}</td>
  		<td nowrap="nowrap">{$form.SourceLocation.html}</td>
  		<td colspan="3" align="right" nowrap="nowrap"> <input type="button" id="advanced" name="advanced" value="Advanced" class="button"/></td>
  	</tr>
  
  	<tr>
  		<td nowrap="nowrap" colspan="2"><input class="button" name="fire_away" value="Upload" type="submit" /></td>
  		<td  align="center"><input type="submit" name="filter" id="filter" value="Show Data" class="button" />&nbsp;</td>
  		
  		<!--input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=datadict&reset=true'" /--> 
  	</tr>


  	<tr name="advancedOptions" style="display:none" class="advancedOptions">
        <th colspan="6" nowrap="nowrap">Advanced Options</th>
    </tr>
    <tr name="advancedOptions" style="display:none" class="advancedOptions">
        <td nowrap="nowrap">{$form.CandID.label}</td>
        <td nowrap="nowrap">{$form.CandID.html}</td>
        <td nowrap="nowrap">{$form.PSCID.label}</td>
        <td nowrap="nowrap">{$form.PSCID.html}</td>
        <td nowrap="nowrap">{$form.VisitLabel.label}</td>
        <td nowrap="nowrap">{$form.VisitLabel.html}</td>

        <td colspan="3" class="selector" align="right" nowrap="nowrap" class="advancedOptions">
            <input type="button" name="advanced" id="basic" value="Basic" class="button" />
        </td>
        
    </tr>
  
    
</table>
<table>
    <td id='hide' style="font-weight: bold" >
    	-Hide log file
    </td> 
    
    <td id='show' style="font-weight: bold" >
    	+Show log file
    </td> 
    <!--td nowrap="nowrap" colspan="2"><input class="textarea" id/></td-->
    <tr> <td><textarea id="log_box" type="text" ></textarea></td> <tr>

</table>

<table  class ="fancytable" border="0" width="100%" class="listColorCoded">
<tr>
     <th nowrap="nowrap">No.</th>
        {section name=header loop=$headers}
            <th nowrap="nowrap"><a href="main.php?test_name=mri_upload&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
        {/section}
</tr>
{section name=item loop=$items}
        <tr>
           <!-- print out data rows -->
            {section name=piece loop=$items[item]}
                {**$items[item]|@print_r**}
                 {if $items[item][piece].name eq 'TarchiveID'}
                      <td nowrap="nowrap"><a href="dicom_archive.php?TarchiveID={$items[item][piece].value}">
                      {$items[item][piece].value}{$headers[header].displayName}</a></td>
                  
                 {elseif $items[item][piece].name eq 'MincData'}     
                    {if $items[item][piece].value eq '0'}
                       <!----uploadid_candid--->     
                      <td nowrap="nowrap" id="{$items[item][1].value}_{$items[item][2].value}"  class='entire_pipeline'> 
                            <!--a href="#"-->Click here to run the mri_pipeline<!--/a-->
                      </td>
                    {else}
                      <td nowrap="nowrap">
                        <a href="mri_browser.php?filter%5BcandID%5D={$items[item][2].value}">
                              {$items[item][2].value}
                        </a>
                      </td>
                    {/if}
                 {else}
                 <td nowrap="nowrap" bgcolor="{$items[item][piece].bgcolor}">
                        {$items[item][piece].value} 
                 </td>
                 {/if}
            {/section}
       </tr>
{sectionelse}

    <tr><td colspan="12">No data found</td></tr>
{/section}

<!-- end data table -->
</table>



{$form.hidden}
</form>

