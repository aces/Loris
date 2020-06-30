<script src="{$baseurl}/js/filterControl.js" type="text/javascript"></script>

<div class="row">
    <div class="col-sm-12">
        <div class="col-md-8 col-sm-8">
            <form method="post" action="{$baseurl}/mri_violations/mri_protocol_check_violations/">
                <div class="panel panel-primary">
                    <div class="panel-heading" onclick="hideFilter();">
                        Selection Filter
                        <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
                        <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
                    </div>
                    <div class="panel-body" id="panel-body">
                        <div class="row">
                            <div class="form-group col-sm-12">
                                <label class="col-sm-12 col-md-2">{$form.TarchiveID.label}</label>
                                <div class="col-sm-12 col-md-4">{$form.TarchiveID.html}</div>
                                <label class="col-sm-12 col-md-2">{$form.SeriesUID.label}</label>
                                <div class="col-sm-12 col-md-4">{$form.SeriesUID.html}</div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-sm-12">
                                <label class="col-sm-12 col-md-2">{$form.PatientName.label}</label>
                                <div class="col-sm-12 col-md-4">{$form.PatientName.html}</div>
                                <label class="col-sm-12 col-md-2">{$form.CandID.label}</label>
                                <div class="col-sm-12 col-md-4">{$form.CandID.html}</div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-sm-5 col-sm-offset-7 hidden-sm">
                                <div class="col-sm-6 col-xs-12">
                                    <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12"/>
                                </div>
                                <div class="visible-xs col-xs-12"> </div>
                                <div class="visible-xs col-xs-12"> </div>
                                <div class="visible-xs col-xs-12"> </div>
                                <div class="visible-xs col-xs-12"> </div>
                                <div class="col-sm-6 col-xs-12">
                                    <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/mri_violations/mri_protocol_check_violations/?reset=true'">
                                </div>
                            </div>
                        </div>
                        <div class="row visible-sm">
                            <div class="col-sm-6">
                                <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12"/>
                            </div>
                            <div class="col-sm-6 col-xs-12">
                                <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/mri_violations/mri_protocol_check_violations/?reset=true'">
                            </div>
                        </div>
                        <input type="hidden" name="test_name" value="mri_violations" />
                        <input type="hidden" name="submenu" value="mri_protocol_check_violations" />
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<div id="tabs" style="background: white">
    <ul class="nav nav-tabs">
        <li class="statsTab active"><a class="statsTabLink">Protocol violations</a></li>
        <li class="statsTab"><a class="statsTabLink" id="onLoad" href="{$baseurl}/mri_violations/mri_protocol_violations/">Resolved violations</a></li>
    </ul>
    <div class="tab-content" style="margin: 14px;">
        <div class="tab-pane active">
            <div class="dynamictable" id="datatable"></div>
        </div>
    </div>
</div>

<script>
loris.hiddenHeaders = {(empty($hiddenHeaders))? [] : $hiddenHeaders };
var hasWritePermission = {json_encode($hasWritePermission)};
var table = RDynamicDataTable({
     "DataURL" : "{$baseurl}/mri_violations/mri_protocol_check_violations/?format=json",
     "getFormattedCell" : formatColumn,
     "freezeColumn" : "PSCID"

  });
ReactDOM.render(table, document.getElementById("datatable"));
</script>
