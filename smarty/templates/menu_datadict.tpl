{literal}

<script language="javascript" type="text/javascript">
function hideFilter(){
    $("#panel-body").toggle();
    $("#down").toggle();
    $("#up").toggle();
}

</script>
{/literal}
<div class="col-sm-10 col-md-8">
    <div class="panel panel-primary">
        <div class="panel-heading" onclick="hideFilter();">
            Selection Filter
            <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
            <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
        </div>
        <div class="panel-body" id="panel-body">
            <form method="post" action="main.php?test_name=datadict">
                <div class="row">
                    <div class="form-group col-sm-6">
                    <!-- {* <td>Objective:</td>
                        <td>{$form.Objective.html}</td> *} -->
                        <label class="col-sm-12 col-md-4">{$form.Description.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.Description.html}</div>
                    </div>
                    <div class="form-group col-sm-6">
                        <label class="col-sm-12 col-md-4">{$form.keyword.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.keyword.html}</div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-6">
                        <label class="col-sm-12 col-md-4">{$form.sourceFrom.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.sourceFrom.html}</div>
                    </div>
                    <div class="form-group col-md-6">
                        <div class="col-sm-4 col-sm-offset-4">
                            <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12" />
                        </div>
                        <div class="col-sm-4">
                            <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=datadict&reset=true'" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>






<!--  title table with pagination -->
<table border="0" valign="bottom" width="100%">
<tr>
    <!-- title -->
    <td class="controlPanelSection">List of Profiles</td>
    <!-- display pagination links -->
    <td align="right">{$page_links}</td>
</tr>
</table>

<br>
<!-- start data table -->
<div class="table-responsive">
    <table  class="table table-hover table-primary table-bordered" border="0" width="100%">
        <thead>
            <tr class="info">
             <th>No.</th>
                {section name=header loop=$headers}
                {** if $headers[header].name != "Name"**}
                    <th><a href="main.php?test_name=datadict&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>                
                    
                {**/if***}
                {/section}
                

            </tr>
        </thead>
        <tbody>
            {section name=item loop=$items}
                <tr>
                <!-- print out data rows -->
                {section name=piece loop=$items[item]}
                
                	{if substr_count($items[item][piece].name, "___description")}
                	
                	    <td id ='{$items[item][piece].name}' class='description' contenteditable = "true" bgcolor="{$items[item][piece].bgcolor}">
                	    	 {$items[item][piece].value}
                	    </td>
            		{else}
            		 	{**if $items[item][piece].name != "Name"**}
            	        	<td bgcolor="{$items[item][piece].bgcolor}"> 
              		  		{$items[item][piece].value}
            				</td>
            		 	{**/if***}
            			
            		{/if}
                {/section}
                </tr>           
            {sectionelse}

            	<tr><td colspan="12">No data found</td></tr>
            {/section}
        </tbody>
                        
    <!-- end data table -->
    </table>
</div>

