<script src="{$baseurl}/js/filterControl.js" type="text/javascript"></script>

<div class="row">
<div class="col-sm-12">
    <div class="col-md-8 col-sm-8">
        <form method="post" action="{$baseurl}/survey_accounts/">
            <div class="panel panel-primary">
                <div class="panel-heading" onclick="hideFilter();">
                    Selection Filter
                    <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
                    <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
                </div>
                <div class="panel-body" id="panel-body">
                    <div class="row">
                        <div class="form-group col-sm-12">
                            <label class="col-sm-12 col-md-2">{$form.PSCID.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.PSCID.html}</div>
                            <label class="col-sm-12 col-md-2">{$form.VisitLabel.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.VisitLabel.html}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-12">
                            <label class="col-sm-12 col-md-2">{$form.Email.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.Email.html}</div>
                            <label class="col-sm-12 col-md-2">{$form.Instrument.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.Instrument.html}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-2 hidden-sm">
                            <input type="button" name="button" value="Add Survey" class="btn btn-sm btn-primary" onclick="location.href='{$baseurl}/survey_accounts/add_survey/'"/>
                        </div>
                        <div class="form-group col-sm-5 col-sm-offset-5 hidden-sm">
                            <div class="col-sm-6 col-xs-12">
                                <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12"/>
                            </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="col-sm-6 col-xs-12">
                                <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/survey_accounts/?reset=true'">
                            </div>
                        </div>
                    </div>
                    <div class="row visible-sm">
                        <div class="col-sm-4">
                            <input type="button" name="button" value="Add Survey" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/survey_accounts/add_survey/'"/>
                        </div>
                        <div class="col-sm-4">
                            <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12"/>
                        </div>
                        <div class="col-sm-4 col-xs-12">
                            <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/survey_accounts/?reset=true'">
                        </div>
                    </div>
                    <input type="hidden" name="test_name" value="survey_accounts"/>
                </div>
            </div>
        </form>
    </div>
</div>
</div>

<!--  title table with pagination -->
<div class="dynamictable" id="datatable"></div>
<script>
var table = RDynamicDataTable({
     "DataURL" : "{$baseurl}/survey_accounts/?format=json",
     "getFormattedCell" : formatColumn,
     "freezeColumn" : "PSCID"
  });
ReactDOM.render(table, document.getElementById("datatable"));
</script>
