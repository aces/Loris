{literal}   
<script language="javascript" type="text/javascript">
    function hideFilter(){
        $("#panel-body").toggle();
        $("#down").toggle();
        $("#up").toggle();
    }
</script>
{/literal}

<div class="col-md-7 col-sm-10 col-lg-6">
    <form method="post" action="main.php?test_name=certification">
        <div class="panel panel-primary">
            <div class="panel-heading" onclick="hideFilter();">
                Selection Filter
                <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
                <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
            </div>
            <div class="panel-body" id="panel-body">
                <div class="row">
                    <div class="form-group col-sm-2">
                        <label class="col-sm-12">{$form.centerID.label}</label>
                        <div class="col-sm-12">{$form.centerID.html}</div>
                    </div>
                    <div class="form-group col-sm-5">
                        <label class="col-sm-12">{$form.full_name.label}</label>
                        <div class="col-sm-12">{$form.full_name.html}</div>
                    </div>
                    <div class="form-group col-sm-5">
                        <label class="col-sm-12">{$form.measure.label}</label>
                        <div class="col-sm-12">{$form.measure.html}</div>
                    </div>
            <!--        <td nowrap="nowrap">Date:</td>
                    <td nowrap="nowrap">{$form.date_cert.html}</td>
                    <td nowrap="nowrap">DCCID:</td>
                    <td nowrap="nowrap">{$form.subject.html}</td>-->
                </div>
                <div class="row">
                    <div class="col-sm-4 col-xs-12">
                        <input type="button" name="button" value="Add Certification" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=certification&subtest=edit_event'" />
                    </div>
                    <div class="visible-xs col-xs-12"> </div>
                    <div class="visible-xs col-xs-12"> </div>
                    <div class="visible-xs col-xs-12"> </div>
                    <div class="visible-xs col-xs-12"> </div>
                    <div class="col-sm-3 col-xs-12">
                        <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12" />
                    </div>
                    <div class="visible-xs col-xs-12"> </div>
                    <div class="visible-xs col-xs-12"> </div>
                    <div class="visible-xs col-xs-12"> </div>
                    <div class="visible-xs col-xs-12"> </div>
                    <div class="col-sm-3 col-xs-12">
                        <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=certification&reset=true'" />
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>

<!--  title table with pagination -->
<table border="0" valign="bottom" width="100%">
    <tr>
        <!-- title -->
        <td class="controlPanelSection">List of Certification Events</td>
        <!-- display pagination links -->
        <td align="right">{$page_links}</td>
    </tr>
</table>

<div class="table-responsive">  
  <!-- start data table -->
    <table border="0" width="100%" class="table table-hover table-primary table-bordered">
    <tr class="info">
        <th>No.</th>
        <!-- print out column headings - quick & dirty hack -->
        {section name=header loop=$headers}
        {if $headers[header].name != subject && $headers[header].name != date}
            <th><a href="main.php?test_name=certification&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
        {/if}
        {/section}
    </tr>

    {section name=item loop=$items}
        <tr>
        <!-- print out data rows -->
        {section name=piece loop=$items[item]}
        {if $items[item][piece].name != "ID"} 
        <td>
    		{if $items[item][piece].name == "full_name"}
    		<a href="main.php?test_name=certification&subtest=edit_event&identifier={$items[item][piece].ID}">{$items[item][piece].value}</a>
            {elseif $items[item][piece].name != "date"}
            {$items[item][piece].value}
            {/if}
        </td>
        {/if}
        {/section}
        </tr>           
    {sectionelse}
        <tr><td colspan="6">No certification events found</td></tr>
    {/section}

    <!-- end data table -->
    </table>
</div>

