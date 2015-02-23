<script src="js/filterControl.js" type="text/javascript"></script>

<div class="row">
<div class="col-sm-12">
    <div class="col-md-8 col-sm-8">
        <form method="post" action="main.php?test_name=mri_violations&submenu=mri_protocol_check_violations">
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
                                <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=mri_violations&submenu=mri_protocol_check_violations&reset=true'">
                            </div>
                        </div>
                    </div>
                    <div class="row visible-sm">
                        <div class="col-sm-6">
                            <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12"/>
                        </div>
                        <div class="col-sm-6 col-xs-12">
                            <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=mri_violations&submenu=mri_protocol_check_violations&reset=true'">
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
<!--  title table with pagination -->
<div class="row">
<div id="pagelinks">
    <table border="0" valign="bottom" width="100%">
        <tr>
            <!-- title -->
            <td align="right">{$page_links}</td>
        </tr>
    </table>
</div>
</div>
<div class="row">
<div id="results" class="carousel slide" data-ride="carousel">
    <div class="carousel-inner">
        <div class="table-scroll" id="content">
            <table class="table table-hover table-primary table-bordered" border="0">
                <thead>
                    <tr class="info">
                        <th nowrap="nowrap">No.</th>
                        {section name=header loop=$headers}
                            <th nowrap="nowrap">
                                <a href="main.php?test_name=mri_violations&submenu=mri_protocol_check_violations&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a>
                            </th>
                        {/section}
                    </tr>
                </thead>
                <tbody>
                    {section name=item loop=$items}
                        <tr
                        {if $items[item].severity == "exclude"}
                            class="error"
                        {elseif $items[item].severity == "warning"}
                            class="warn"
                            {/if}>
                        <!-- print out data rows -->
                        {section name=piece loop=$items[item]}
                        <td nowrap="nowrap">
                            {if $items[item][piece].name== "PatientName"}
                                <a href="main.php?test_name=dicom_archive&subtest=viewDetails&tarchiveID={$items[item].TarchiveID}">{$items[item][piece].value}</a>
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
