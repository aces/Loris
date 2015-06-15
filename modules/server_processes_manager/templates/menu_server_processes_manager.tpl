<div class="row">
    <div class="col-sm-10 col-md-8">
        <div class="panel panel-primary">
            <div class="panel-heading" onclick="hideFilter();">
                Selection Filter
            </div>
            <div class="panel-body" id="panel-body">
                <form method="post" name="server_processes" id="server_processes" enctype="multipart/form-data">

                    <div class="row">
                        <div class="form-group col-sm-6">
                            <label class="col-sm-12 col-md-4">{$form.pid.label}</label>
                            <div class="col-sm-12 col-md-8">{$form.pid.html}</div>
                        </div>
                        <div class="form-group col-sm-6">
                            <label class="col-sm-12 col-md-4">{$form.type.label}</label>
                            <div class="col-sm-12 col-md-8">{$form.type.html}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-6">
                            <label class="col-sm-12 col-md-4">{$form.userid.label}</label>
                            <div class="col-sm-12 col-md-8">{$form.userid.html}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-sm-6 col-sm-offset-6">
                            <div class="col-sm-6">
                                <input type="submit" name="filter" id="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12" />
                            </div>
                            <div class="col-sm-6">
                                <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/main.php?test_name=server_processes_manager&reset=true'" />
                            </div>
                        </div>
                    </div>
                    {$form.hidden}
                </form>
            </div>
        </div>
    </div>
</div>


<div class='row'>
    <table class="table table-hover table-primary table-bordered dynamictable" border="0" width="100%">
        <thead>
            <tr class="info">
                <th>No.</th>
                <!-- print out column headings - quick & dirty hack -->
                {section name=header loop=$headers}
                    <th><a href="{$baseurl}/main.php?test_name=server_processes_manager&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
                {/section}
            </tr>
        </thead>

        <tbody>
            {section name=item loop=$items}
            <tr>
            {section name=piece loop=$items[item]}
                {if $items[item][piece].bgcolor != ''}
                <td style="background-color:{$items[item][piece].bgcolor}">
                {else}
                <td>
                {/if}
                    {$items[item][piece].value}
                </td>
            {/section}
            </tr>
            {sectionelse}
            <tr><td colspan="12">No server processes found</td></tr>
            {/section}
        </tbody>
    </table>
</div>
