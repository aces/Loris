<script src="js/filterControl.js" type="text/javascript"></script>
<link rel="stylesheet" href="css/c3.css">
<script src="js/d3.min.js" charset="utf-8"></script>
<script src="js/c3.min.js"></script>

<div class="row">
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
                                {*<input class="btn btn-sm btn-primary col-md-offset-3" name="fire_away" value="Show Data" type="submit" />*}
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
                            {*<input class="btn btn-sm btn-primary col-md-offset-3" name="fire_away" value="Show Data" type="submit" />*}
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
</div>

{*
<div class="row">
    <div class="col-sm-12">
*}
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Violations over time</h3>
                <span class="pull-right clickable glyphicon glyphicon-chevron-up"></span>
                {*<div class="pull-right">
                    <div class="btn-group views">
                        <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                            Views
                            <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu pull-right" role="menu">
                            <li class="active"><a data-target="scans-line-chart-panel">View scans per site</a></li>
                            <li><a data-target="recruitment-line-chart-panel">View recruitment per site</a></li>
                        </ul>
                    </div>
                </div>*}
            </div>
            <div class="panel-body">
                <div id="scans-line-chart-panel">
                    <h5 class="chart-title">Scan sessions per site</h5>
                    {if $total_scans neq 0}
                        <div id="scanChart"></div>
                    {else}
                        <p>There have been no scans yet.</p>
                    {/if}
                </div>
                <div id="recruitment-line-chart-panel" class="hidden">
                    <h5 class="chart-title">Recruitment per site</h5>
                    {if $recruitment['overall']['total_recruitment'] neq 0}
                        <div id="recruitmentChart"></div>
                    {else}
                        <p>There have been no candidates registered yet.</p>
                    {/if}
                </div>
            </div>
        </div>
{*
    </div>
</div>
*}
<div class="row">
<div id="tabs" style="background: white">
    <ul class="nav nav-tabs">
        <li class="statsTab active"><a class="statsTabLink" id="onLoad" href="main.php?test_name=mri_violations">Not Resolved</a></li>
        <li class="statsTab"><a class="statsTabLink" href="main.php?test_name=mri_violations&submenu=resolved_violations">Resolved</a></li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane active">
            <div class="row">
        <!--  title table with pagination -->
        <table id="LogEntries" border="0" valign="bottom" width="100%">
            <tr>
                <!-- display pagination links -->
                <td align="right">{$page_links}</td>
            </tr>
        </table>

        <div id="results" class="carousel slide" data-ride="carousel">
            <div class="carousel-inner">
                <div class="table-scroll" id="content">
                    <form method="post" action="main.php?test_name=mri_violations"  name="mri_violations" id="mri_violations">
                    <table class="table table-hover table-primary table-bordered" border="0">
                        <thead>
                            <tr class="info">
                                <th>No.</th>
                                {section name=header loop=$headers}
                                    {if $headers[header].name ne 'SeriesUID' && $headers[header].name ne 'join_id' && $headers[header].name ne 'Resolved' && $headers[header].name ne 'hash'}
                                        <th nowrap="nowrap"><a href="main.php?test_name=mri_violations&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
                                    {elseif $headers[header].name eq 'hash'}
                                        <th nowrap="nowrap"><a href="main.php?test_name=mri_violations&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">Resolution status</a></th>
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
                                            <a href="#" class="mri_violations" id="mri_protocol_violations" data-PatientName="{$items[item].PatientName}" "{if $series}"data-SeriesUID="{$series}{/if}">{$items[item][piece].value}</a>
                                        </td>
                                    {elseif $items[item][piece].value eq 'Protocol Violation'}
                                    <td nowrap="nowrap" bgcolor="{$items[item][piece].bgcolor}">
                                        <a href="#" class="mri_violations" id="mri_protocol_check_violations" data-PatientName="{$items[item].PatientName}" "{if $series}" data-SeriesUID="{$series}{/if}">{$items[item][piece].value}</a>
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
                            <tr>
                                <td nowrap="nowrap" colspan="5" id="message-area">

                                </td>
                                <td nowrap="nowrap" colspan="5">
                                    <input class="btn btn-sm btn-primary col-md-offset-3" name="fire_away" value="Save" type="submit" />
                                    <input class="btn btn-sm btn-primary" value="Reset" type="reset" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                  </form>
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
</div>
</div>
</div>
</div>
