{literal}
<script language="javascript" type="text/javascript">
    function hideFilter(){
        $("#panel-body").toggle();
        $("#down").toggle();
        $("#up").toggle();
    }
</script>
{/literal}

<!-- start the selection table -->
<div class="col-sm-9 col-lg-8">
    <form method="post" action="main.php?test_name=user_accounts">
        <div class="panel panel-primary">
            <div class="panel-heading" onclick="hideFilter();">
                Selection Filter
                <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
                <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
            </div>
            <div class="panel-body" id="panel-body">
                <div class="row">
                    <div class="form-group col-sm-6">
                        <label class="col-sm-12 col-md-4">
                            {$form.centerID.label}
                        </label>
                        <div class="col-sm-12 col-md-8">
                            {$form.centerID.html}
                        </div>
                    </div>
                    <div class="form-group col-sm-6">
                        <label class="col-sm-12 col-md-4">
                            {$form.userID.label}
                        </label>
                        <div class="col-sm-12 col-md-8">
                            {$form.userID.html}
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-6">
                        <label class="col-sm-12 col-md-4">
                            {$form.active.label}
                        </label>
                        <div class="col-sm-12 col-md-8">
                            {$form.active.html}
                        </div>
                    </div>
                    <div class="form-group col-sm-6">
                        <label class="col-sm-12 col-md-4">
                            {$form.real_name.label}
                        </label>
                        <div class="col-sm-12 col-md-8">
                            {$form.real_name.html}
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-6">
                        <label class="col-sm-12 col-md-4">
                            {$form.pending.label}
                        </label>
                        <div class="col-sm-12 col-md-8">
                            {$form.pending.html}
                        </div>
                    </div>
                    <div class="form-group col-sm-6">
                        <label class="col-sm-12 col-md-4">
                            {$form.email.label}
                        </label>
                        <div class="col-sm-12 col-md-8">
                            {$form.email.html}
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-6">
                        <label class="col-sm-12 col-md-4">
                            {$form.examiner.label}
                        </label>
                        <div class="col-sm-12 col-md-8">
                            {$form.examiner.html}
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-3 col-md-2 col-xs-12">
                        <input type="button" name="button" value="Add User" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=user_accounts&subtest=edit_user'" />
                    </div>
                    <div class="form-group col-sm-3 col-md-2 col-xs-12 col-sm-offset-3 col-md-offset-6">
                        <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12" />
                    </div>
                    <div class="form-group col-sm-3 col-md-2 col-xs-12">
                        <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=user_accounts&reset=true'" />
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
    <td class="controlPanelSection"></td>
    <!-- display pagination links -->
    <td align="right">{$page_links}</td>
</tr>
</table>

<!-- start data table -->
<div class="table-responsive">
    <table border="0" width="100%" class="table table-hover table-primary table-bordered">
        <thead>
            <tr class="info">
                <th nowrap="nowrap">No.</th>
                <!-- print out column headings - quick & dirty hack -->
                {section name=header loop=$headers}
                    <th nowrap="nowrap"><a href="main.php?test_name=user_accounts&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
                {/section}
            </tr>
        </thead>
        <tbody>
            {section name=item loop=$items}
                <tr>
                <!-- print out data rows -->
                {section name=piece loop=$items[item]}
                <td nowrap="nowrap">
                    {if  $items[item][piece].name == "Username"}
                    <a href="main.php?test_name=user_accounts&subtest=edit_user&identifier={$items[item][piece].value}">{$items[item][piece].value}</a>
                    {else}
                    {$items[item][piece].value}
                    {/if}
                </td>
                {/section}
                </tr>           
            {sectionelse}
                <tr><td colspan="8">No users found</td></tr>
            {/section}
        <tbody>
                        
    <!-- end data table -->
    </table>
</div>

