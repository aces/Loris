<!-- selection filter -->
<!-- qnts fixme this modified version does not display certain fields in the mri browser selection window-->
{literal}
    <script type="text/javascript">
        function hideFilter(){
            $("#panel-body").toggle();
            $("#down").toggle();
            $("#up").toggle();
        }
    </script>
{/literal}

<div class="row">
<div class="col-sm-9">
<div class="panel panel-primary">
    <div class="panel-heading" onclick="hideFilter();">
        Selection Filter
        <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
        <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
    </div>
    <div class="panel-body" id="panel-body">
        <form method="post" action="main.php?test_name=imaging_browser">
            <div class="row">
                <div class="form-group col-sm-6">
                    <label class="col-sm-12 col-md-4">
                        {$form.ProjectID.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.ProjectID.html}
                    </div>
                </div>
                <div class="form-group col-sm-6">
                    <label class="col-sm-12 col-md-4">
                        {$form.DCCID.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.DCCID.html}
                    </div>
                </div>
            </div>
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
                        {$form.pscid.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.pscid.html}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label class="col-sm-12 col-md-4">
                        {$form.VisitQCStatus.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.VisitQCStatus.html}
                    </div>
                </div>
                <div class="form-group col-sm-6">
                    <label class="col-sm-12 col-md-4">
                        {$form.VL.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.VL.html}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-6">
                    <label class="col-sm-12 col-md-4">
                        {$form.Pending.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.Pending.html}
                    </div>
                </div>
                <div class="form-group col-md-6">
                    <div class="col-sm-4 col-sm-offset-4">
                    		<input type="submit" class="btn btn-sm btn-primary col-xs-12" name="filter" value="Show Data">
                    </div>
                    <div class="col-sm-4">
                    		<input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=imaging_browser&reset=true'" />
                    </div>
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
</div>

<!--  title table with pagination -->
<table id="LogEntries" border="0" valign="bottom" width="100%">
<tr>
    <!-- title -->
    <td class="controlPanelSection">List of Imaging Datasets found</td>

    <!-- display pagination links -->
    <td align="right">{$page_links}</td>
</tr>
</table>

<div class="table-responsive">
<table class="table table-hover table-primary table-bordered" width="100%" border="1">
    <thead>
        <tr class="info">
            <th>No.</th>
        {foreach from=$headers item=item key=key}
            {* Add 3 to the numOutputTypes (native, selected, all types plus
               other types in the database *}
            <th {if $item.name eq 'Links'}colspan="{$numOutputTypes+3}"{/if}>
            {if $item neq ''}<a href="main.php?test_name=imaging_browser&filter[order][field]={$item.name}&filter[order][fieldOrder]={$item.fieldOrder}">{/if}
                {$item.displayName}
            {if $item neq ''}</a>{/if}
            </th>
        {/foreach}
        </tr>
    </thead>
    <tbody>
        <tr>
        
        {section name=item loop=$items}
                <!-- print out data rows -->
                <td nowrap="nowrap">{$items[item][0].value}</td>
                {section name=piece loop=$items[item]}
                {if $items[item][piece].name neq 'Links' && $items[item][piece].name neq ''} 
                    <td nowrap="nowrap">
                    {if $items[item][piece].name == "First_Acq_Date" || $items[item][piece].name == "Last_QC"}
                        {$items[item][piece].value|date_format}
                    {elseif $items[item][piece].name == "New_Data" && $items[item][piece].value == "new"}
                        <span class="newdata">NEW</span>
                    {else}
                        {$items[item][piece].value}
                    {/if}
                    </td>
                {/if}
        {/section}
        {* Links to files/output types *}
        {section name=typeIdx loop=$outputTypes}
        	     <td><a href="main.php?test_name=imaging_browser&subtest=view_session&sessionID={$items[item].sessionID}&outputType={if $outputTypes[typeIdx].outputType=='selected'}native&selectedOnly=1
                    {else}{$outputTypes[typeIdx].outputType|escape:"url"}{/if}&backURL={$backURL|escape:"url"}">{$outputTypes[typeIdx].outputType}</a>
    	    </td>
        {/section}
                <td><a href="main.php?test_name=imaging_browser&subtest=view_session&sessionID={$items[item].sessionID}&backURL={$backURL|escape:"url"}">all types</a></td>
        </tr>
        {sectionelse}
        <tr><td colspan="8">Nothing found</td></tr>
        {/section}
    </tbody>
</table>
</div>

{if $numTimepoints}
  {$numTimepoints} subject timepoint(s) selected.<br>
{/if}
