<div class="row">
    <div class="col-md-12 col-sm-8">
        <form method="post" name="edit_examiner" id="edit_examiner">
            <div class="panel panel-primary">
                <div class="panel-heading">
                    Edit Certification for {$examiner_name}
                </div>
                <div class="panel-body" id="panel-body">
                    {foreach from=$form.errors item=error}
                    <div class="col-xs-12">
                        <p class="error">{$error}</p>
                    </div>
                    {/foreach}
                    {foreach from=$form.pass item=item key=key}
                    <div class="row">
                        <div class="form-group col-md-12">
                            <label class="col-sm-12 col-md-1">{$form.pass[$key].label}</label>
                            <div class="col-sm-12 col-md-2">{$form.pass[$key].html}</div>
                            <label class="col-sm-12 col-md-1 col-md-offset-1">{$form.date_cert[$key].label}</label>
                            <div class="col-sm-12 col-md-3 form-inline">{$form.date_cert[$key].html}</div>
                            <label class="col-sm-12 col-md-1">{$form.comment[$key].label}</label>
                            <div class="col-sm-12 col-md-3">{$form.comment[$key].html}</div>
                        </div>
                    </div>
                    {/foreach}
                    <div class="row">
                        {if not $success}
                        <div class="col-xs-12">
                            <div class="col-sm-6 col-md-2 col-xs-12 col-md-offset-8">
                                <input class="btn btn-sm btn-primary col-xs-12" name="fire_away" value="Save" type="submit">
                            </div>
                            <div class="col-sm-6 col-md-2 col-xs-12">
                                <input class="btn btn-sm btn-primary col-xs-12" value="Reset" type="reset" onclick="location.href='main.php?test_name=examiner&subtest=editExaminer&reset=true'">
                            </div>
                        </div>
                        {/if}
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>

<div class="row">
    <div class="col-xs-12">
        <h3>Change Log</h3>
    </div>
</div>
<table class="table table-hover table-primary table-bordered dynamictable">
    <tr class="info">
        <th>Time</th>
        <th>User</th>
        <th>Measure</th>
        <th>Old Value</th>
        <th>Old Date</th>
        <th>New Value</th>
        <th>New Date</th>
    </tr>
    {$form.certification_history.html}
</table>