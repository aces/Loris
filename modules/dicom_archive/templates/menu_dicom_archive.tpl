{literal}
    <script type="text/javascript">
        function hideFilter(){
            $("#panel-body").toggle();
            $("#down").toggle();
            $("#up").toggle();
        }
    </script>
{/literal}

<!-- selection filter -->
<div class="col-sm-9">
<div class="panel panel-primary">
    <div class="panel-heading" onclick="hideFilter();">
        Selection Filter
        <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
        <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
    </div>
    <div class="panel-body" id="panel-body">
        <form method="post" action="main.php?test_name=dicom_archive">
            <div class="row">
                <div class="form-group col-sm-6">
                    <label class="col-sm-12 col-md-4">
                        {$form.SiteID.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.SiteID.html}
                    </div>
                </div>
                <div class="form-group col-sm-6">
                    <label class="col-sm-12 col-md-4">
                        {$form.PatientID.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.PatientID.html}
                    </div>
                </div>
            </div>
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
                        {$form.Gender.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.Gender.html}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label class="col-sm-12 col-md-4">
                        {$form.DoB.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.DoB.html}
                    </div>
                </div>
                <div class="form-group col-sm-6">
                    <label class="col-sm-12 col-md-4">
                        {$form.Acquisition.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.Acquisition.html}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label class="col-sm-12 col-md-4">
                        {$form.Location.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.Location.html}
                    </div>
                </div>
                <div class="form-group col-md-2">
                    <input type="submit" class="btn btn-sm btn-primary col-xs-12" name="filter" value="Show Data">
                </div>
                <div class="visible-xs visible-sm col-xs-12"> </div>
                <div class="visible-xs visible-sm col-xs-12"> </div>
                <div class="visible-xs visible-sm col-xs-12"> </div>
                <div class="visible-xs visible-sm col-xs-12"> </div>
                <div class="form-group col-md-2">
                    <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=dicom_archive&reset=true'">
                </div>
            </div>
        </form>
    </div>
</div>
</div>

<div class="col-xs-12">
<!-- listing of visits -->
{if $numTimepoints}
  {$numTimepoints} subject timepoint(s) selected.<br><br>
{/if}
</div>

<table border="0" valign="bottom" width="100%">
<tr>
    <!-- title -->
    <td class="controlPanelSection"></td>
    <!-- display pagination links -->
    <td align="right">{$page_links}</td>
</tr>
</table>

<table class="dynamictable table table-hover table-primary table-bordered">
    <thead>
    <tr class="info">
	<th>No.</th>
{section name=header loop=$headers}
        <th nowrap="nowrap">
            <a href="main.php?test_name=dicom_archive&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a>
        </th>
{/section}
    </tr>
    </thead>
    <tbody>
    <tr>
{section name=item loop=$items}
{section name=piece loop=$items[item]}
    <td{if $items[item][piece].name == "Transfer_Status"} class="{$items[item][piece].class}"{elseif $items[item][piece].class == "error"} class="{$items[item][piece].class}"{/if}>
        {if $items[item][piece].name == "Metadata"}
        <a href="main.php?test_name=dicom_archive&subtest=viewDetails&tarchiveID={$items[item][piece].tarchiveID}&backURL={$backURL|escape:"url"}">{$items[item][piece].value}</a>
        {elseif $items[item][piece].name == "MRI_Browser"}
            {if $items[item][piece].sessionID != ""}
        <a href="main.php?test_name=imaging_browser&subtest=viewSession&sessionID={$items[item][piece].sessionID}&outputType=native&backURL={$backURL|escape:"url"}">{$items[item][piece].value}</a>{else}&nbsp;{/if}
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
