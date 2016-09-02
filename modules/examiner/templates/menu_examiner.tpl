<script type="text/javascript" src="{$baseurl}/js/filterControl.js"></script>

<div class="row">
    <div class="col-sm-12 col-md-7">
        <div class="panel panel-primary">
            <div class="panel-heading" onclick="hideFilter();">
                Selection Filter
                <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
                <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
            </div>
            <div class="panel-body" id="panel-body">
                <form method="post" action="{$baseurl}/examiner/">
                    <div class="row">
                        <div class="form-group col-sm-6">
                            <label class="col-sm-12 col-md-4">{$form.examiner.label}</label>
                            <div class="col-sm-12 col-md-8">{$form.examiner.html}</div>
                        </div>
                        <div class="form-group col-sm-6">
                            <label class="col-sm-12 col-md-4">{$form.site.label}</label>
                            <div class="col-sm-12 col-md-8">{$form.site.html}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-6">
                            <label class="col-sm-12 col-md-4">{$form.radiologist.label}</label>
                            <div class="col-sm-12 col-md-8">{$form.radiologist.html}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 col-md-offset-6">
                            <div class="col-sm-6">
                                <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12" />
                            </div>
                            <div class="col-sm-6">
                                <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/examiner/?reset=true'" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="col-sm-12 col-md-5">
        <div class="panel panel-primary">
            <div class="panel-heading">
                <span class="glyphicon glyphicon-plus"></span> Add Examiner
            </div>
            <div class="panel-body">
            {foreach from=$form.errors item=error}
            <div class="col-xs-12">
                <div class="alert alert-danger" role="alert">{$error}</div>
            </div>
            {/foreach}
            <form method="post" name="examiner" id="examiner">
                <div class="row">
                    <div class="form-group col-md-8">
                        <label class="col-md-4">{$form.addName.label}</label>
                        <div class="col-md-8">{$form.addName.html}</div>
                    </div>
                    <div class="col-md-4">
                        <label>
                            {$form.addRadiologist.html}
                        </label>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-md-8">
                        <label class="col-md-4">{$form.addSite.label}</label>
                        <div class="col-md-8">{$form.addSite.html}</div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <button type="submit" class="btn btn-sm btn-success pull-right" name="fire_away"><span class="glyphicon glyphicon-plus"></span> Add</button>
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
    <!-- display pagination links -->
    <td align="right" id="pageLinks"></td>
</tr>
</table>

<br>
<!-- start data table -->
<div class="table-responsive">
    <table  class="table table-hover table-primary table-bordered" border="0" width="100%">
        <thead>
            <tr class="info">
             <th>No.</th>
                {section name=header loop=$headers}
                    <th><a href="{$baseurl}/examiner/?filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
                {/section}
            </tr>
        </thead>
        <tbody>
            {section name=item loop=$items}
            <tr>
                {section name=piece loop=$items[item]}
                    {if $items[item][piece].name == "Examiner" and $certification == "1"}
                        <td nowrap="nowrap">
                            <a href="{$baseurl}/examiner/editExaminer/?identifier={$items[item][piece].ID}">{$items[item][piece].value}</a>
                        </td>
                    {elseif $items[item][piece].name == "Site"}
                        <td nowrap="nowrap">
                            {$items[item][piece].value}
                        </td>
                    {else}
                        <td>
                            {$items[item][piece].value}
                        </td>
                    {/if}
                {/section}
            </tr>
            {sectionelse}
                <tr>
                    {if $certification == "1"}
                        <tr><td colspan="5">No examiners found.</td></tr>
                    {else}
                        <tr><td colspan="4">No examiners found.</td></tr>
                    {/if}
                </tr>
            {/section}
        </tbody>
                        
    <!-- end data table -->
    </table>
</div>
<script>
var pageLinks = RPaginationLinks(
{
    RowsPerPage : {$rowsPerPage},
    Total: {$TotalItems},
    onChangePage: function(pageNum) {
        location.href="{$baseurl}/examiner/?filter[order][field]={$filterfield}&filter[order][fieldOrder]={$filterfieldOrder}&pageID=" + pageNum
    },
    Active: {$pageID}
});
React.render(pageLinks, document.getElementById("pageLinks"));
</script>

