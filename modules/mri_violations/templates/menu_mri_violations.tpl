<script src="{$baseurl}/js/filterControl.js" type="text/javascript"></script>
<link rel="stylesheet" href="{$baseurl}/css/c3.css">
<script src="{$baseurl}/js/d3.min.js" charset="utf-8"></script>
<script src="{$baseurl}/js/c3.min.js"></script>
<div class="row">
    <div class="col-sm-12">
        <div class="col-md-8 col-sm-8">
            <form method="post" action="{$baseurl}/mri_violations/" name="mri_violations" id="mri_violations">
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
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-sm-5 col-sm-offset-7 hidden-sm">
                                <div class="col-sm-6 col-xs-12">
                                    {*<input class="btn btn-sm btn-primary col-md-offset-3" name="fire_away" value="Show Data" type="submit" />*}
                                    <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12"/>
                                </div>
                                <div class="visible-xs col-xs-12"> </div>
                                <div class="visible-xs col-xs-12"> </div>
                                <div class="visible-xs col-xs-12"> </div>
                                <div class="visible-xs col-xs-12"> </div>
                                <div class="col-sm-6 col-xs-12">
                                    <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/mri_violations/?reset=true'">
                                </div>
                            </div>
                        </div>
                        <div class="row visible-sm">
                            <div class="col-sm-6">
                                {*<input class="btn btn-sm btn-primary col-md-offset-3" name="fire_away" value="Show Data" type="submit" />*}
                                <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12"/>
                            </div>
                            <div class="col-sm-6 col-xs-12">
                                <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/mri_violations/?reset=true'">
                            </div>
                        </div>
                        <input type="hidden" name="test_name" value="mri_violations" />
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="row">
    <div id="tabs" style="background: white">
        <ul class="nav nav-tabs">
            <li class="statsTab active"><a class="statsTabLink" id="onLoad" href="{$baseurl}/mri_violations/">Not Resolved</a></li>
            <li class="statsTab"><a class="statsTabLink" href="{$baseurl}/mri_violations/?submenu=resolved_violations">Resolved</a></li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane active">
                <div>
                    <!--  title table with pagination -->
                    <table id="LogEntries" border="0" valign="bottom" width="100%">
                        <tr>
                            <!-- display pagination links -->
                            <td align="right" id="pageLinks"></td>
                        </tr>
                    </table>
                    <form method="post" action="{$baseurl}/mri_violations/"  name="mri_violations" id="mri_violations">
                        <table id="violationsTable" class="table table-hover table-primary table-bordered" border="0">
                            <thead>
                            <tr class="info">
                                <th>No.</th>
                                {section name=header loop=$headers}
                                    {if $headers[header].name eq 'PatientName'}
                                        <th nowrap="nowrap" id="PatientName"><a href="{$baseurl}/mri_violations/?filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
                                    {elseif $headers[header].name ne 'SeriesUID' && $headers[header].name ne 'join_id' && $headers[header].name ne 'Resolved' && $headers[header].name ne 'hash'}
                                        <th nowrap="nowrap"><a href="{$baseurl}/mri_violations/?filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
                                    {elseif $headers[header].name eq 'hash'}
                                        <th nowrap="nowrap"><a href="{$baseurl}/mri_violations/?filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">Resolution status</a></th>
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
                                                    <a href="#"
                                                       class="mri_violations"
                                                       id="mri_protocol_violations"
                                                       data-PatientName="{$items[item].PatientName}"
                                                       {if $items[item].series}
                                                            data-SeriesUID="{$items[item].series}"
                                                       {/if}
                                                    >
                                                        {$items[item][piece].value}
                                                    </a>
                                                </td>
                                            {elseif $items[item][piece].name eq 'MincFileViolated'}
                                                <td nowrap="nowrap" bgcolor="{$items[item][piece].bgcolor}">
						                            <a href="#noID" onclick="window.open('{$baseurl}/brainbrowser/?minc_location={$items[item][piece].value}', 'BrainBrowser Volume Viewer', 'location = 0,width = auto, height = auto, scrollbars=yes')">{$items[item][piece].value}</a>
                                                </td>
                                            {elseif $items[item][piece].value eq 'Protocol Violation'}
                                                <td nowrap="nowrap" bgcolor="{$items[item][piece].bgcolor}">
                                                    <a href="#" class="mri_violations" id="mri_protocol_check_violations" data-PatientName="{$items[item].PatientName}" "{if $items[item].series}" data-SeriesUID="{$items[item].series}{/if}">{{$items[item][piece].value}}</a>
                                                </td>
                                            {elseif $items[item][piece].name == "Project"}
                                                <td nowrap="nowrap" bgcolor="{$items[item][piece].bgcolor}">
                                                    {$projects[$items[item][piece].value]}
                                                </td>
                                            {elseif $items[item][piece].name == "Subproject"}
                                                <td nowrap="nowrap" bgcolor="{$items[item][piece].bgcolor}">
                                                    {$subprojects[$items[item][piece].value]}
                                                </td>
                                            {elseif $items[item][piece].name == "Site"}
                                                <td nowrap="nowrap" bgcolor="{$items[item][piece].bgcolor}">
                                                    {$sites[$items[item][piece].value]}
                                                </td>
                                            {elseif $items[item][piece].name == "join_id"}
                                                <!-- skip, do nothing -->
                                            {elseif $items[item][piece].name == "Resolved"}
                                                <!-- skip, do nothing -->
                                            {elseif $items[item][piece].name == "hash"}
                                                <td nowrap="nowrap" colspan="4" bgcolor="{$items[item][piece].bgcolor}">
                                                    {*adds the select menu generated by a utility in the controller*}
                                                    {$form[$items[item][piece].value].html}
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
                        <div class="pull-right">
                            <input class="btn btn-sm btn-primary" name="fire_away" value="Save" type="submit" />
                            <input class="btn btn-sm btn-primary" value="Reset" type="reset" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
var pageLinks = RPaginationLinks(
{
    RowsPerPage : {$rowsPerPage},
    Total: {$TotalItems},
    onChangePage: function(pageNum) {
        location.href="{$baseurl}/mri_violations/?filter[order][field]={$filterfield}&filter[order][fieldOrder]={$filterfieldOrder}&pageID=" + pageNum
    },
    Active: {$pageID}
});
ReactDOM.render(pageLinks, document.getElementById("pageLinks"));
</script>

