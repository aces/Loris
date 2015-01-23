<script type="text/javascript" src="js/filterControl.js"></script>

<div class="row">
<div class="col-sm-10 col-md-9">
    <div class="panel panel-primary">
        <div class="panel-heading" onclick="hideFilter();">
            Selection Filter
            <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down"></span>
            <span class="glyphicon glyphicon-chevron-up pull-right" id="up"></span>
        </div>
        <div class="panel-body" id="panel-body">
            <form method="post" action="main.php?test_name=examiner">
                <div class="row">
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-3">{$form.examiner.label}</label>
                        <div class="col-sm-12 col-md-9">{$form.examiner.html}</div>
                    </div>
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-3">{$form.site.label}</label>
                        <div class="col-sm-12 col-md-9">{$form.site.html}</div>
                    </div>
                    <div class="form-group col-sm-4">
                        <label class="col-sm-12 col-md-3">{$form.radiologist.label}</label>
                        <div class="col-sm-12 col-md-9">{$form.radiologist.html}</div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-md-6 col-md-offset-6">
                        <div class="col-sm-4 col-sm-offset-4">
                            <input type="submit" name="filter" value="Show Data" class="btn btn-sm btn-primary col-xs-12" />
                        </div>
                        <div class="col-sm-4">
                            <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=examiner&reset=true'" />
                        </div>
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
    <td align="right">{$page_links}</td>
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
                    <th><a href="main.php?test_name=examiner&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
                {/section}
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
                    <tr><td colspan="4">No examiners found.</td></tr>
                </tr>
            {/section}
        </tbody>
                        
    <!-- end data table -->
    </table>
</div>

<div class="panel panel-default">
    <div class="panel-heading">
        <span class="glyphicon glyphicon-plus"></span> Add Examiner
    </div>
    <div class="panel-body">
    <form class="form-inline">
        <div class="form-group">
            <label>{$form.addFirstName.label}</label>
            {$form.addFirstName.html}
        </div>
        <div class="form-group">
            <label>{$form.addLastName.label}</label>
            {$form.addLastName.html}
        </div>
        <div class="form-group">
            <label>{$form.addSite.label}</label>
            {$form.addSite.html}
        </div>
        <div class="checkbox">
            <label>
                <input type="checkbox" name="radiologist" value="1"> Radiologist
            </label>
        </div>
        <button type="submit" class="btn btn-default btn-success pull-right"><span class="glyphicon glyphicon-plus"></span> Add</button>
    </form>
    </div>
</div>