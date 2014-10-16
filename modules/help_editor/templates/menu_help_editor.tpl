<script type="text/javascript" src="js/filterControl.js"></script>

<div class="row">
<div class="col-sm-10 col-md-10">
    <div class="panel panel-primary">
        <div class="panel-heading" onclick="hideFilter();">
            Selection Filter
            <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
            <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
        </div>
        <div class="panel-body" id="panel-body">
            <form method="post" action="main.php?test_name=help_editor">
                <div class="row">
                    <div class="form-group col-sm-6">
                        <label class="col-sm-12 col-md-4">{$form.topic.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.topic.html}</div>
                    </div>
                    <div class="form-group col-sm-6">
                        <label class="col-sm-12 col-md-4">{$form.keyword.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.keyword.html}</div>
                    </div>
                </div>
                <div class="row">
                        <div class="form-group col-md-6">
                        <div class="col-sm-4 col-sm-offset-4">
                            <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12" />
                        </div>
                        <div class="col-sm-4">
                            <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=help_editor&reset=true'" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
</div>






<!--  title table with pagination -->
<table border="0" valign="bottom" width="100%">
<tr>
    <!-- title -->
    <td class="controlPanelSection">List of Topics</td>
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
                    <th><a href="main.php?test_name=help_editor&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>                
                    
                {/section}
                

            </tr>
        </thead>
        <tbody>
            {section name=item loop=$items} 
                <tr>
                <!-- print out data rows -->
                {section name=piece loop=$items[item]} 
                    {if substr_count($items[item][piece].name, "Topic")}
                     
                        <td id ='{$items[item][piece].name}' class='description' bgcolor="{$items[item][piece].bgcolor}">
                          {if $items[item][piece].parentID eq -1 && $items[item][piece].name eq 'Main_Topic' && $items[item][piece].value eq '-'}
                           {$items[item][piece].value}
                           {else}
                           <a href="main.php?test_name=help_editor&subtest=edit_help_content&helpID={$items[item][piece].helpID}&parentID={$items[item][piece].parentID}">
                           {$items[item][piece].value}</a>
                          {/if}
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
