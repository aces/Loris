<script type="text/javascript" src="GetJS.php?Module=mri_violations&file=mri_protocol_violations.js"></script>

<div class="col-sm-12">
    <div class="col-md-8 col-sm-8">
        <form method="post" action="main.php?test_name=mri_violations&submenu=mri_protocol_violations">
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
                                <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=mri_violations&submenu=mri_protocol_violations&reset=true'">
                            </div>
                        </div>
                    </div>
                    <div class="row visible-sm">
                        <div class="col-sm-6">
                            <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12"/>
                        </div>
                        <div class="col-sm-6 col-xs-12">
                            <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=mri_violations&submenu=mri_protocol_violations&reset=true'">
                        </div>
                    </div>
                    <input type="hidden" name="test_name" value="mri_violations" />
                    <input type="hidden" name="submenu" value="mri_protocol_violations" />
                </div>
            </div>
        </form>
    </div>
</div>

<!-- Mri- protocol table  -->
<div id='hide' style="font-weight: bold" class="toggle_mri_tbl">
  <span class="glyphicon glyphicon-minus"></span> Hide mri-protocol Table
</div>

<div id='show' style="font-weight: bold" class="toggle_mri_tbl">
  <span class="glyphicon glyphicon-plus"></span> Show mri-protocol Table
</div>

<table class="dynamictable table table-hover table-primary table-bordered" border="0" width="100%">
    <thead>
        <tr class="info">
            {assign var=count value=0}
            {foreach from=$mri_protocol_header item=mp}
                <th id="header_{$count}">
                   {$mp}
                </th>
                {assign var=count value=$count+1}
            {/foreach}
        </tr>
    </thead>
    <tbody>
        {foreach from=$mri_protocol_data item=mp}
          {assign var=ccount value=0}

            <tr>
              {foreach from=$mp item=row}
                {if $violated_scans_modifications}
                   <td id="row_{$mp.ID}_td_{$ccount}" class='description' contenteditable = "true">
                {else}
                   <td id="row_{$mp.ID}_td_{$ccount}" class='description'>
                {/if}
                        {$row}
                    {$k}
                           </td>
                {assign var=ccount value=$ccount+1}
              {/foreach}
            </tr>
        {/foreach}
    </tbody>
</table>
</br></br>

<table border="0" valign="bottom" width="100%">
<tr>
    <td align="right">{$page_links}</td>
</tr>
</table>

<table class="dynamictable table table-hover table-primary table-bordered" border="0" width="100%">
    <thead>
        <tr class="info">
            <th nowrap="nowrap">No.</th>
                {section name=header loop=$headers}
                    <th nowrap="nowrap"><a href="main.php?test_name=mri_violations&submenu=mri_protocol_violations&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
                {/section}
        </tr>
    </thead>
    <tbody>
        {section name=item loop=$items}
            <tr>
            <!-- print out data rows -->
            {section name=piece loop=$items[item]}
                <td nowrap="nowrap" bgcolor="{$items[item][piece].bgcolor}">
                    {$items[item][piece].value}
                </td>
            {/section}
            </tr>
        {sectionelse}
            <tr><td colspan="19">No data found</td></tr>
        {/section}
    </tbody>
</table>
