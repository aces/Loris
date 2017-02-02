<script type="text/javascript" src="{$baseurl}/js/filterControl.js"></script>

<div class="row">
<div class="col-xs-12">
    <!-- start the selection table -->
    <form method="post" action="{$baseurl}/final_radiological_review/">
        <div class="panel panel-primary">
            <div class="panel-heading" onclick="hideFilter();">
                Selection Filter
                <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
                <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
            </div>
            <div class="panel-body" id="panel-body">
                <div class="row">
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-8">{$form.site.label}</label>
                        <div class="col-sm-12 col-md-4">{$form.site.html}</div>
                    </div>
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-8">{$form.Conflict.label}</label>
                        <div class="col-sm-12 col-md-4">{$form.Conflict.html}</div>
                    </div>
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-6">{$form.keyword.label}</label>
                        <div class="col-sm-12 col-md-6">{$form.keyword.html}</div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-8">{$form.Conflict2.label}</label>
                        <div class="col-sm-12 col-md-4">{$form.Conflict2.html}</div>
                    </div>
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-8">{$form.Visit_label.label}</label>
                        <div class="col-sm-12 col-md-4">{$form.Visit_label.html}</div>
                    </div>
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-6">{$form.pscid.label}</label>
                        <div class="col-sm-12 col-md-6">{$form.pscid.html}</div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-8">{$form.Review_Done.label}</label>
                        <div class="col-sm-12 col-md-4">{$form.Review_Done.html}</div>
                    </div>
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-8">{$form.Exclusionary_Status.label}</label>
                        <div class="col-sm-12 col-md-4">{$form.Exclusionary_Status.html}</div>
                    </div>
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-6">{$form.dccid.label}</label>
                        <div class="col-sm-12 col-md-6">{$form.dccid.html}</div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-8">{$form.SAS.label}</label>
                        <div class="col-sm-12 col-md-4">{$form.SAS.html}</div>
                    </div>
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-8">{$form.PVS.label}</label>
                        <div class="col-sm-12 col-md-4">{$form.PVS.html}</div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-8">{$form.Final_Review_Results.label}</label>
                        <div class="col-sm-12 col-md-4">{$form.Final_Review_Results.html}</div>
                    </div>
                    {if $form.Project}
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-8">{$form.Project.label}</label>
                        <div class="col-sm-12 col-md-4">{$form.Project.html}</div>
                    </div>
                    {/if}
                </div>
                <div class="row">
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-8">{$form.Finalized.label}</label>
                        <div class="col-sm-12 col-md-4">{$form.Finalized.html}</div>
                    </div>
                    <div class="form-group col-sm-4"></div>
                    <div class="form-group col-md-4 col-sm-6">
                        <div class="col-sm-6 col-xs-12">
                            <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12" />
                        </div>
                        <div class="visible-xs col-xs-12"> </div>
                        <div class="visible-xs col-xs-12"> </div>
                        <div class="visible-xs col-xs-12"> </div>
                        <div class="visible-xs col-xs-12"> </div>
                        <div class="col-sm-6 col-xs-12">
                            <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/final_radiological_review/?reset=true'">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
</div>
<div class="dynamictable" id="datatable"></div>
<script>
loris.hiddenHeaders = {(empty($hiddenHeaders))? [] : $hiddenHeaders };
var table = RDynamicDataTable({
     "DataURL" : "{$baseurl}/final_radiological_review/?format=json",
     "getFormattedCell" : formatColumn,
     "freezeColumn" : "PSCID"
  });
ReactDOM.render(table, document.getElementById("datatable"));
</script>
