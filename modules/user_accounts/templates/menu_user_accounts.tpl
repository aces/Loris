<script type="text/javascript" src="{$baseurl}/js/filterControl.js"></script>

<!-- start the selection table -->
<div class="row">
    <div class="col-sm-9 col-lg-8">
        <form method="post" action="{$baseurl}/user_accounts/">
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
                            <input type="button" name="button" value="Add User" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/user_accounts/edit_user/'" />
                        </div>
                        <div class="form-group col-sm-3 col-md-2 col-xs-12 col-sm-offset-3 col-md-offset-6">
                            <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12" />
                        </div>
                        <div class="form-group col-sm-3 col-md-2 col-xs-12">
                            <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/user_accounts/?reset=true'" />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div> 
</div>  
<!--  title table with pagination -->
<div class="dynamictable" id="datatable"></div>
<script>
var table = RDynamicDataTable({
     "DataURL" : "{$baseurl}/user_accounts/?format=json",
     "getFormattedCell" : formatColumn,
     "freezeColumn" : "PSCID"
  });
React.render(table, document.getElementById("datatable"));
</script>
