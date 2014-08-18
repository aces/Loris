<script src="js/filterControl.js" type="text/javascript"></script>

<div class="col-sm-12">
    <div class="col-md-8 col-sm-8">
        <form method="post" action="main.php?test_name=mri_violations">
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
                        <div class="form-group col-sm-5 col-sm-offset-7 hidden-sm">
                            <div class="col-sm-6 col-xs-12">
                                <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12"/>
                            </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="col-sm-6 col-xs-12">
                                <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=mri_violations&reset=true'">
                            </div>
                        </div>
                    </div>
                    <div class="row visible-sm">
                        <div class="col-sm-6">
                            <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12"/>
                        </div>
                        <div class="col-sm-6 col-xs-12">
                            <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=mri_violations&reset=true'">
                        </div>
                    </div>
                    <input type="hidden" name="test_name" value="mri_violations" />
                </div>
            </div>
        </form>
    </div>
</div>

<!--  title table with pagination -->
<table id="LogEntries" border="0" valign="bottom" width="100%">
    <tr>
        <!-- display pagination links -->
        <td align="right">{$page_links}</td>
    </tr>
</table>

<div class="table-responsive">
    <form method="post" action="main.php?test_name=conflicts_resolve" name="conflicts_resolve" id="conflicts_resolve">
        <table class="table table-hover table-primary table-bordered table-unresolved-conflicts" border="0">
            <thead>
                <tr class="info">
                    <th>No.</th>
                    {section name=header loop=$headers}
                        {if $headers[header].name ne 'SeriesUID'}
                            <th nowrap="nowrap"><a href="main.php?test_name=mri_violations&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
                        {/if}
                    {/section}
                </tr>
            </thead>
            <tbody>
                {section name=item loop=$items}
                    <tr>
                    <!-- print out data rows -->
                    {section name=piece loop=$items[item]}
                    {if $items[item][piece]}
                        {if $items[item][piece].value eq 'Could not identify scan type'}
                            <td nowrap="nowrap" bgcolor="{$items[item][piece].bgcolor}"> 
                                <a href="main.php?test_name=mri_protocol_violations&PatientName={$items[item].PatientName}{if $series}&SeriesUID={$series}{/if}&filter=true">{$items[item][piece].value}</a>
                            </td>
                        {elseif $items[item][piece].value eq 'Protocol Violation'}
                        <td nowrap="nowrap" bgcolor="{$items[item][piece].bgcolor}">
                            <a href="main.php?test_name=mri_protocol_check_violations&PatientName={$items[item].PatientName}{if $series}&SeriesUID={$series}{/if}&filter=true">{$items[item][piece].value}</a>
                        </td>
                        {else}
                            <td nowrap="nowrap" bgcolor="{$items[item][piece].bgcolor}">
                                {$items[item][piece].value}
                            </td>
                        {/if}
                    {/if}
                    {/section}
                    </tr>           
                {sectionelse}
                    <tr><td colspan="12">No data found</td></tr>
                {/section}
            </tbody>
        </table>
    </form>
</div>