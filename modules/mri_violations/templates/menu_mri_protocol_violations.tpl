<script type="text/javascript" src="{$baseurl}/mri_violations/js/mri_protocol_violations.js"></script>
<link rel="stylesheet" href="{$baseurl}/css/c3.css">
<script src="{$baseurl}/js/d3.min.js" charset="utf-8"></script>
<script src="{$baseurl}/js/c3.min.js"></script>

<div class="col-sm-12">
    <div class="col-md-8 col-sm-8">
        <form method="post" action="{$baseurl}/mri_violations/mri_protocol_violations/">
            <div class="panel panel-primary">
                <div class="panel-heading" onclick="hideFilter();">
                    Selection Filter
                    <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
                    <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
                </div>
                <div class="panel-body" id="panel-body">
                    <div class="row">
                        <div class="form-group col-sm-12">
                            <label class="col-sm-12 col-md-2">{$form.CandID.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.CandID.html}</div>
                            <label class="col-sm-12 col-md-2">{$form.PSCID.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.PSCID.html}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-12">
                            <label class="col-sm-12 col-md-2">{$form.PatientName.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.PatientName.html}</div>
                            <label class="col-sm-12 col-md-2">{$form.SeriesUID.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.SeriesUID.html}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-12">
                            <label class="col-sm-12 col-md-2">{$form.SeriesDescription.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.SeriesDescription.html}</div>
                            <label class="col-sm-12 col-md-2">{$form.TimeRun.label}</label>
                            <div class="col-sm-12 col-md-4">{$form.TimeRun.html}</div>
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
                                <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/mri_violations/mri_protocol_violations/?reset=true'">
                            </div>
                        </div>
                    </div>
                    <div class="row visible-sm">
                        <div class="col-sm-6">
                            <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12"/>
                        </div>
                        <div class="col-sm-6 col-xs-12">
                            <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/mri_violations/mri_protocol_violations/?reset=true'">
                        </div>
                    </div>
                    <input type="hidden" name="test_name" value="mri_violations" />
                    <input type="hidden" name="submenu" value="mri_protocol_violations" />
                </div>
            </div>
        </form>
    </div>
</div>


<div id="tabs" style="background: white">
    <ul class="nav nav-tabs">
        <li class="statsTab"><a class="statsTabLink" id="onLoad" href="{$baseurl}/mri_violations/mri_protocol_check_violations/">Protocol violations</a></li>
        <li class="statsTab active"><a class="statsTabLink">Resolved violations</a></li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane active">

            <!-- Mri- protocol table  -->
            <div id='hide' style="font-weight: bold" class="toggle_mri_tbl">
                <span class="glyphicon glyphicon-minus"></span> Hide mri-protocol Table
            </div>

            <div id='show' style="font-weight: bold" class="toggle_mri_tbl">
                <span class="glyphicon glyphicon-plus"></span> Show mri-protocol Table
            </div>

            <table id="mri-protocol" class="dynamictable table table-hover table-primary table-bordered" border="0" width="100%">
                <thead>
                <tr class="info">
                    {foreach from=$mri_protocol_header item=mp}
                    <th id="header_{$mp}">
                        {$mp}
                    </th>
                    {/foreach}
                </tr>
                </thead>
                <tbody>
                {assign var=firstProtocol value=1}
                {foreach from=$mri_protocol_data item=mpgroup}
                    {if $firstProtocol != 1}
                        {assign var=rowBorder value='style="border-bottom: 1px solid #000;"'}
                    {else}
                        {assign var=rowBorder value=''}
                    {/if}
                    
                    {foreach from=$mpgroup item=protocol}
                        <tr>
                        {foreach from=$protocol key=k item=v}   
                            <td id="row_{$protocol.ID}_td_{$k}" class='description' nowrap {$rowBorder}>
                                {$v}
                            </td>
                        {/foreach}
                        </tr>
                        {assign var=rowBorder value=''}
                    {/foreach}
                {/foreach}
                </tbody>
            </table>
            </br></br>

            <table border="0" valign="bottom" width="100%">
                <tr>
                    <td align="right" id="pageLinks"></td>
                </tr>
            </table>
          <div class="dynamictable" id="datatable"></div> 
             
      </div>
    </div>
</div>
<script>

loris.hiddenHeaders = {(empty($hiddenHeaders))? [] : $hiddenHeaders };
var table = RDynamicDataTable({
     "DataURL" : "{$baseurl}/mri_violations/mri_protocol_violations/?format=json",
     "getFormattedCell" : formatColumn,
     "freezeColumn" : "PatientName"
     
  });
ReactDOM.render(table, document.getElementById("datatable"));

</script>
