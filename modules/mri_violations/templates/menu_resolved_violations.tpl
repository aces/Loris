<script src="{$baseurl|default}/js/filterControl.js" type="text/javascript"></script>
<div class="row">
<div class="col-sm-12">
    <div class="col-md-8 col-sm-8">
        <form method="post" action="{$baseurl|default}/mri_violations/resolved_violations/">
            <div class="panel panel-primary">
                <div class="panel-heading" onclick="hideFilter();">
                    Selection Filter
                    <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
                    <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
                </div>
                <div class="panel-body" id="panel-body">
                    <div class="row">
                        <div class="form-group col-sm-12">
                            <label class="col-sm-12 col-md-2">{$form.PatientName.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.PatientName.html}</div>
                            <label class="col-sm-12 col-md-2">{$form.TimeRun.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.TimeRun.html}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-12">
                            <label class="col-sm-12 col-md-2">{$form.Filename.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.Filename.html}</div>
                            <label class="col-sm-12 col-md-2">{$form.ProblemType.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.ProblemType.html}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-12">
                            <label class="col-sm-12 col-md-2">{$form.Description.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.Description.html}</div>
                            <label class="col-sm-12 col-md-2">{$form.SeriesUID.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.SeriesUID.html}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-12">
                            <label class="col-sm-12 col-md-2">{$form.Project.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.Project.html}</div>
                            <label class="col-sm-12 col-md-2">{$form.Subproject.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.Subproject.html}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-12">
                            <label class="col-sm-12 col-md-2">{$form.Site.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.Site.html}</div>
                            <label class="col-sm-12 col-md-2">{$form.Resolved.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.Resolved.html}</div>
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
                                <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl|default}/mri_violations/resolved_violations/?reset=true'">
                            </div>
                        </div>
                    </div>
                    <div class="row visible-sm">
                        <div class="col-sm-6">
                            <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12"/>
                        </div>
                        <div class="col-sm-6 col-xs-12">
                            <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl|default}/mri_violations/resolved_violations/?reset=true'">
                        </div>
                    </div>
                    <input type="hidden" name="test_name" value="mri_violations" />
                </div>
            </div>
    </div>
</div>
</div>

<div id="tabs" style="background: white">
    <ul class="nav nav-tabs">
        <li class="statsTab"><a class="statsTabLink" id="onLoad" href="{$baseurl|default}/mri_violations/">Not Resolved</a></li>
        <li class="statsTab active"><a class="statsTabLink" href="{$baseurl|default}/mri_violations/resolved_violations/">Resolved</a></li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane active">
            <div class="row">
                  <!--  title table with pagination -->
                  <div class="dynamictable" id="datatable"></div>
            </div>
        </div>
    </div>
<script>
loris.hiddenHeaders = {(empty($hiddenHeaders))? [] : $hiddenHeaders };
var table = RDynamicDataTable({
     "DataURL" : "{$baseurl|default}/mri_violations/resolved_violations/?format=json",
     "getFormattedCell" : formatColumn,
     "freezeColumn" : "PatientName"
  });
ReactDOM.render(table, document.getElementById("datatable"));
</script>
