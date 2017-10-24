<div class="row">
    <div class="col-md-12">
        <form method="post" name="edit_examiner" id="edit_examiner">
            <div class="panel panel-primary">
                <div class="panel-heading">
                    Edit Certification for {$examiner_name}
                </div>
                <div class="panel-body" id="panel-body">
                    {foreach from=$form.errors item=error}
                    <div class="col-xs-12">
                        <div class="alert alert-danger" role="alert">{$error}</div>
                    </div>
                    {/foreach}
                    <div class="row hidden-xs hidden-sm">
                        <div class="col-md-1">
                            <label>Instrument</label>
                        </div>
                        <div class="col-md-2">
                            <label>Certification Status</label>
                        </div>
                        <div class="col-md-2 col-md-offset-1">
                            <label>Certification Date</label>
                        </div>
                        <div class="col-md-4 col-md-offset-1">
                            <label>Comments</label>
                        </div>
                    </div>
                    <hr class="row hidden-xs hidden-sm">
                    {foreach from=$instruments key=ID item=name}
                    <div class="row">
                        <div class="col-md-1">
                            <label>{$form.$name.label}</label>
                        </div>
                        {$form.$name.html}
                    </div>
                    {/foreach}
                    <div class="row">
                        {if not $success}
                        <div class="col-xs-12">
                            <div class="col-sm-6 col-md-2 col-xs-12 col-md-offset-8">
                                <input class="btn btn-sm btn-primary col-xs-12" name="fire_away" value="Save" type="submit">
                            </div>
                            <div class="col-sm-6 col-md-2 col-xs-12">
                                <input class="btn btn-sm btn-primary col-xs-12" value="Reset" type="reset" onclick="location.href='{$baseurl}/examiner/editExaminer/?reset=true&identifier={$identifier}'">
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
    {section name=history_row loop=$certification_history}
    <tr>
        <td>{$certification_history[history_row]['changeDate']}</td>
        <td>{$certification_history[history_row]['userID']}</td>
        <td>{$certification_history[history_row]['Measure']}</td>
        <td>{$certification_history[history_row]['old']}</td>
        <td>{$certification_history[history_row]['old_date']}</td>
        <td>{$certification_history[history_row]['new']}</td>
        <td>{$certification_history[history_row]['new_date']}</td>
    </tr>
    {sectionelse}
    <tr>
        <td colspan="7">
            No changes have been made
        </td>
    </tr>
    {/section}
</table>
