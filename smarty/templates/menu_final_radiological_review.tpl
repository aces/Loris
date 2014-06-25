<script type="text/javascript" src="js/filterControl.js"></script>

<div class="col-xs-12">
    <!-- start the selection table -->
    <form method="post" action="main.php?test_name=final_radiological_review">
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
                        <label class="col-sm-12 col-md-8">{$form.Review_done.label}</label>
                        <div class="col-sm-12 col-md-4">{$form.Review_done.html}</div>
                    </div>
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-4">{$form.Project.label}</label>
                        <div class="col-sm-12 col-md-8">{$form.Project.html}</div>
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
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-8">{$form.Exclusionary_Status.label}</label>
                        <div class="col-sm-12 col-md-4">{$form.Exclusionary_Status.html}</div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-8">{$form.Finalized.label}</label>
                        <div class="col-sm-12 col-md-4">{$form.Finalized.html}</div>
                    </div>
                    <div class="form-group col-md-4 col-sm-6">
                        <div class="col-sm-6 col-xs-12">
                            <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12" />
                        </div>
                        <div class="visible-xs col-xs-12"> </div>
                        <div class="visible-xs col-xs-12"> </div>
                        <div class="visible-xs col-xs-12"> </div>
                        <div class="visible-xs col-xs-12"> </div>
                        <div class="col-sm-6 col-xs-12">
                            <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=final_radiological_review&reset=true'">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>

<!--  title table with pagination -->

<div id="pagelinks">
<table border="0" valign="bottom" width="100%">
<tr>
    <!-- title -->
    {* Comment 
    <td class="controlPanelSection"><a href="main.php?test_name=final_radiological_review&subtest=final_radiological_review">Create new review</a></td>
    *}
    <!-- display pagination links -->
    <td align="left">{$page_links}</td>
</tr>
</table>
</div>


<!-- start data table -->
<div id="datatable" class="table-responsive">
    <table border="0" class="table table-hover table-primary table-bordered">
        <thead>
            <tr class="info">
                <th>No.</th>
                <!-- print out column headings - quick & dirty hack -->
                {section name=header loop=$headers}
                    <th><a href="main.php?test_name=final_radiological_review&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
                {/section}
            </tr>
        </thead>
        <tbody>
            {section name=item loop=$items}
                <tr>
                <!-- print out data rows -->
                {section name=piece loop=$items[item]}
                <td>
                    {if $items[item][piece].name == "PSCID"}
                        <a href="main.php?test_name=final_radiological_review&subtest=final_radiological_review&identifier={$items[item][piece].CommentID}">{$items[item][piece].value}</a>
                    {else}
                        {$items[item][piece].value}
                    {/if}
                </td>
                {/section}
                </tr>           
            {sectionelse}
                <tr><td colspan="8">Nothing found</td></tr>
            {/section}
        </tbody>
                        
    <!-- end data table -->
    </table>
</div>

