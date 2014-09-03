<div class="row">
<div class="col-sm-9">
<div class="panel panel-primary">
    <div class="panel-heading" onclick="hideFilter();">
        Selection Filter
        <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
        <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
    </div>
    <div class="panel-body" id="panel-body">
        <form method="post" action="main.php?test_name=mri_violations">
            <div class="row">
                <div class="form-group col-sm-6">
                    <label class="col-sm-12 col-md-4">
                        {$form.PatientName.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.PatientName.html}
                    </div>
                </div>
                <div class="form-group col-sm-6">
                    <label class="col-sm-12 col-md-4">
                        {$form.TimeRun.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.TimeRun.html}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label class="col-sm-12 col-md-4">
                        {$form.Filename.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.Filename.html}
                    </div>
                </div>
                <div class="form-group col-sm-6">
                    <label class="col-sm-12 col-md-4">
                        {$form.ProblemType.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.ProblemType.html}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label class="col-sm-12 col-md-4">
                        {$form.Description.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.Description.html}
                    </div>
                </div>
                <div class="form-group col-sm-6">
                    <label class="col-sm-12 col-md-4">
                        {$form.SeriesUID.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.SeriesUID.html}
                    </div>
                </div>
            </div>
            <div class="row">
                    <div class="col-sm-4 col-md-3 col-xs-12 col-md-offset-5 col-sm-offset-4">
                        <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12" />
                    </div>

                    <div class="visible-xs col-xs-12"> </div>
                    <div class="visible-xs col-xs-12"> </div>
                    <div class="visible-xs col-xs-12"> </div>
                    <div class="visible-xs col-xs-12"> </div>
                    
                    <div class="col-sm-4 col-md-3 col-xs-12">
                        <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=reliability&reset=true'" />
                    </div>
                </div> 
        </form>
    </div>
</div>
</div>
</div>

<!--  title table with pagination -->
<table border="0" valign="bottom" width="100%">
<tr>
    <!-- title -->
    <td class="controlPanelSection"></td>
    <!-- display pagination links -->
    <td align="right">{$page_links}</td>
</tr>
</table>


<div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
    <div class="carousel-inner">
        <!-- <div class="col-xs-10 col-xs-offset-1" style="overflow-y:auto"> -->
        <div class="table-scroll" id="content">
            <table  class ="table table-hover table-primary table-bordered" border="0" width="100%">
                <thead>
                    <tr class="info">
                        <th>No.</th>
                        {section name=header loop=$headers}
                            {if $headers[header].name ne 'SeriesUID'}
                                <th><a href="main.php?test_name=mri_violations&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
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
        </div>
        <a class="left carousel-control"  id="scrollLeft" href="#carousel-example-generic">
            <span class="glyphicon glyphicon-chevron-left"></span>
        </a>
        <a class="right carousel-control" id="scrollRight" href="#carousel-example-generic" data-slide="next">
            <span class="glyphicon glyphicon-chevron-right"></span>
        </a>
    </div>
</div>