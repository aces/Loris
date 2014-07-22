<script src="js/filterControl.js" type="text/javascript"></script>

<div class="col-sm-12">
    <div class="col-md-8 col-sm-8">
        <form>
            <div class="panel panel-primary">
                <div class="panel-heading" onclick="hideFilter();">
                    Selection Filter
                    <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
                    <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
                </div>
                <div class="panel-body" id="panel-body">
                    <div class="row">
                        <div class="form-group col-sm-12">
                            <label class="col-sm-12 col-md-2">{$form.Instrument.label}</label>
                            <div class="col-sm-12 col-md-9">{$form.Instrument.html}</div>
                        </div>
                    </div>
                    <div class="row">    
                        <div class="form-group col-sm-12">
                            <label class="col-sm-12 col-md-2">{$form.CandID.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.CandID.html}</div>
                            <label class="col-sm-12 col-md-1">{$form.site.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.site.html}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-12">
                            <label class="col-sm-12 col-md-2">{$form.PSCID.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.PSCID.html}</div>
                            <label class="col-sm-12 col-md-1">{$form.visit.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.visit.html}</div>
                        </div>
                        <div class="form-group col-sm-6 col-sm-offset-5 hidden-sm">
                            <div class="col-sm-6 col-xs-12">
                                <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12"/>
                            </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="visible-xs col-xs-12"> </div>
                            <div class="col-sm-6 col-xs-12">
                                <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=resolved_conflicts&reset=true'">
                            </div>
                        </div>
                    </div>
                    <div class="row visible-sm">
                        <div class="col-sm-6">
                            <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12"/>
                        </div>
                        <div class="col-sm-6 col-xs-12">
                            <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=resolved_conflicts&reset=true'">
                        </div>
                    </div>
                    <input type="hidden" name="test_name" value="resolved_conflicts" />
                </div>
            </div>
        </form>
    </div>
    <div class="col-md-4 col-sm-4">
        <a class="btn btn-default" href="main.php?test_name=conflicts_resolve" role="button">See unresolved conflicts</a>
    </div>
</div>

<table id="LogEntries" border="0" valign="bottom" width="100%">
    <tr>
        <!-- display pagination links -->
        <td align="right">{$page_links}</td>
    </tr>
</table>
<table class="table table-hover table-primary table-bordered" border="0">
    <thead>

        {foreach from=$form.errors item=error}
        <tr>
            <td nowrap="nowrap" colspan="5" class="error">{$error}</td>
        </tr>
        {/foreach}
        
        <tr class="info">
            <th>No.</th>
            {section name=header loop=$headers}
            <th><a href="main.php?test_name=resolved_conflicts&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">
            {if $headers[header].displayName == "TableName"}
                Instrument
            {else if $headers[header].displayName == "CandID"}
                DCCID
            {else if $headers[header].displayName == "FieldName"}
                Question                    
            {else}
                {$headers[header].displayName}
            {/if}
            </a></th>
            {/section}
            <th>Corrected Answer</th>
        </tr>
    </thead>
    <tbody>
        {section name=item loop=$items}
        <tr>
            {section name=piece loop=$items[item]}
                <td>
                    {$items[item][piece].value}
                </td>
            {/section}
        </tr>
        {sectionelse}
            <tr>
                <tr><td colspan="7">No resolved conflicts found.</td></tr>
            </tr>
        {/section}
    </tbody>
</table>