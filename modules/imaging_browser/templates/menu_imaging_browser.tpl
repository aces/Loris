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
<script>
    loris.hiddenHeaders = {(empty($hiddenHeaders))? [] : $hiddenHeaders };
</script>
<div class="row">
<div class="col-sm-9">
<div class="panel panel-primary">
<div class="panel-heading" onclick="hideFilter();">
    Selection Filter
    <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
    <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
</div>
<div class="panel-body" id="panel-body">
    <form method="post" action="{$baseurl}/imaging_browser/">
         <div class="row">
            <div class="form-group col-sm-4">
                <label class="col-sm-12 col-md-4">
                    {$form.pscid.label}
                </label>
                <div class="col-sm-12 col-md-8">
                    {$form.pscid.html}
                </div>
            </div>
             <div class="form-group col-sm-4">
                <label class="col-sm-12 col-md-4">
                    {$form.DCCID.label}
                </label>
                <div class="col-sm-12 col-md-8">
                    {$form.DCCID.html}
                </div>
            </div>
             <div class="form-group col-sm-4">
                <label class="col-sm-12 col-md-4">
                    {$form.VL.label}
                </label>
                <div class="col-sm-12 col-md-8">
                    {$form.VL.html}
                </div>
            </div>
        </div>
        <div class="row">
            <div class="form-group col-sm-4">
                <label class="col-sm-12 col-md-4">
                    {$form.SiteID.label}
                </label>
                <div class="col-sm-12 col-md-8">
                    {$form.SiteID.html}
                </div>
            </div>
            <div class="form-group col-sm-4">
                <label class="col-sm-12 col-md-4">
                    {$form.VisitQCStatus.label}
                </label>
                <div class="col-sm-12 col-md-8">
                    {$form.VisitQCStatus.html}
                </div>
            </div>
            {if $form.ProjectID}
            <div class="form-group col-sm-4">
                <label class="col-sm-12 col-md-4">
                    {$form.ProjectID.label}
                </label>
                <div class="col-sm-12 col-md-8">
                    {$form.ProjectID.html}
                </div>
            </div>
            {/if}
        </div>
        <div class="row">
            <div class="form-group col-sm-4">
                <label class="col-sm-12 col-md-4">
                    {$form.Scan_type.label}
               </label>
                <div class="col-sm-12 col-md-8">
                    {$form.Scan_type.html}
                </div>
            </div>
            <div class="form-group col-sm-4">
                <label class="col-sm-12 col-md-4">
                    {$form.Pending.label}
                </label>
                <div class="col-sm-12 col-md-8">
                    {$form.Pending.html}
                </div>
            </div>
            <div class="col-sm-2 col-sm-offset-8">
                 <input type="submit" class="btn btn-sm btn-primary col-xs-12" name="filter" value="Show Data">
            </div>
            <div class="col-sm-2">
                <input type="button"
                       name="reset"
                       value="Clear Form"
                       class="btn btn-sm btn-primary col-xs-12"
                       onclick="location.href='{$baseurl}/imaging_browser/?reset=true'" />
            </div>
           </div><!--closing row -->
    </form>
</div>
</div>
</div>

</div>

<div id="datatable">

<script>
var table = RDynamicDataTable({
        "DataURL" : "{$baseurl}/imaging_browser/?format=json",
        "getFormattedCell" : formatColumn

});
React.render(table, document.getElementById("datatable"));
</script>

