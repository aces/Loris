<script type="text/javascript" src="{$baseurl}/js/filterControl.js"></script>

<div class="row">
<div class="col-sm-10 col-md-10">
    <div class="panel panel-primary">
        <div class="panel-heading" onclick="hideFilter();">
            Selection Filter
            <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
            <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
        </div>
        <div class="panel-body" id="panel-body">
            <form method="post" action="{$baseurl}/datadict/" id="filterForm">
                <div class="row">
                    <div class="form-group col-sm-6">
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
                            <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12" id="menu_filter_submit" />
                        </div>
                        <div class="col-sm-4">
                            <input type="button" id="menu_filter_reset" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/datadict/?reset=true'" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
</div>




<div id="datatable" />


<script>
var table = RDynamicDataTable({
    "DataURL" : "{$baseurl}/datadict/?format=json",
    "getFormattedCell" : formatDataDictColumn

});
ReactDOM.render(table, document.getElementById("datatable"));
</script>

