<script src="js/filterControl.js" type="text/javascript"></script>

<div class="row">
<div class="col-sm-12">
    <div class="col-md-8 col-sm-8">
        <form method="post" action="main.php?test_name=survey_accounts">
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
                            <input type="button" name="button" value="Add Survey" class="btn btn-sm btn-primary" onclick="location.href='main.php?test_name=survey_accounts&subtest=add_survey'"/>
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
                                <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=survey_accounts&reset=true'">
                            </div>
                        </div>
                    </div>
                    <div class="row visible-sm">
                        <div cladd="col-sm-4">
                            <input type="button" name="button" value="Add Survey" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=survey_accounts&subtest=add_survey'"/>
                        </div>
                        <div class="col-sm-4">
                            <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12"/>
                        </div>
                        <div class="col-sm-4 col-xs-12">
                            <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=survey_accounts&reset=true'">
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

<div id="pagelinks">
    <table border="0" valign="bottom" width="100%">
        <tr>
            <!-- title -->
            <td align="right">{$page_links}</td>
        </tr>
    </table>
</div>

<div class="row">
<div id="results" class="carousel slide" data-ride="carousel">
    <div class="carousel-inner">
        <div class="table-scroll" id="content">
            <table class="table table-hover table-primary table-bordered" border="0">
                <thead>
                    <tr class="info">
                         <th nowrap="nowrap">No.</th>
                        <!-- print out column headings - quick & dirty hack -->
                        {section name=header loop=$headers}
                            <th nowrap="nowrap"><a href="main.php?test_name=survey_accounts&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
                        {/section}
                    </tr>
                </thead>
                <tbody>
                    {section name=item loop=$items}
                        <tr>
                        <!-- print out data rows -->
                        {section name=piece loop=$items[item]}
                        <td nowrap="nowrap">
                            {if  $items[item][piece].name == "URL"}
                            <a href="survey.php?key={$items[item][piece].value}">{$items[item][piece].value}</a>
                            {else}
                            {$items[item][piece].value}
                            {/if}
                        </td>
                        {/section}
                        </tr>           
                    {sectionelse}
                        <tr><td colspan="8">No surveys found</td></tr>
                    {/section}
                </tbody>
            </table>
        </div>
        <a class="left carousel-control"  id="scrollLeft" href="#results">
            <span class="glyphicon glyphicon-chevron-left"></span>
        </a>
        <a class="right carousel-control" id="scrollRight" href="#results" data-slide="next">
            <span class="glyphicon glyphicon-chevron-right"></span>
        </a>
    </div>
</div>
</div>
