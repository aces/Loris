{if $upload_success}
    <p>Upload Successful<br/></p>
{/if}

{if $dicom_success}
    <p>Dicoms Are inserted<br/></p>
{/if}

{if $minc_success}
    <p>Mincs Are inserted<br/></p>
{/if}

<br />
<form method="post" name="mri_upload" id="mri_upload" enctype="multipart/form-data">
    <table class="std zia">
        <!-- table title -->
        <tr>
            <td>
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
           </td>
           <td>
                <tr>
                    <td nowrap="nowrap">{$form.CandID.label}</td>
                    <td nowrap="nowrap">{$form.CandID.html}</td>
                    <td nowrap="nowrap">{$form.PSCID.label}</td>
                    <td nowrap="nowrap">{$form.PSCID.html}</td>
                    <td nowrap="nowrap">{$form.VisitLabel.label}</td>
                    <td nowrap="nowrap">{$form.VisitLabel.html}</td>
                </tr>
            </td>
        </tr>
      	<tr>
      		<td nowrap="nowrap" colspan="2">
      		    <input class="button" name="fire_away" id="upload" value="Upload" type="submit" />
      		</td>
      		<td align="center">
      		    <input type="submit" name="filter" id="filter" value="Show Data" class="button" />&nbsp;
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
        <tr>
            <td>
                <div id="log_box" overflow-y: scroll overflow: auto>
                </div>
            </td> 
        </tr>
         <!--tr> <td><textarea id="log_box" type="text" rows="4" cols="50" readonly></textarea></td> <tr-->
    
    </table>
    
    <table  class ="fancytable" border="0" width="100%" class="listColorCoded">
        <tr>
             <th nowrap="nowrap">No.</th>
                {section name=header loop=$headers}
                    <th nowrap="nowrap">
                        <a href="main.php?test_name=mri_upload&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}
                        </a>
                    </th>
                {/section}
        </tr>
        {section name=item loop=$items}
            <tr>
                <!-- print out data rows -->
                {section name=piece loop=$items[item]}
                    {if $items[item][piece].name eq 'Tarchive_Info'}
                        <td nowrap="nowrap"><a href="dicom_archive.php?TarchiveID={$items[item][piece].value}">
                        View Details</a></td>
                    {elseif $items[item][piece].name eq 'MRI_Browser'}     
                        {if $items[item][piece].value neq '0'}
                            <td nowrap="nowrap">
                                <a href="mri_browser.php?filter%5BcandID%5D={$items[item][2].value}">
                                    View Images
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
        
        <tr>
            <td colspan="12">No data found</td>
        </tr>
        
        {/section}
        <!-- end data table -->
    </table>
    
    {$form.hidden}
</form>