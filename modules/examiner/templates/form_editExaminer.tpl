<div class="row">
    <div class="col-md-12">
        <form method="post" name="edit_examiner" id="edit_examiner">
            <div class="panel panel-primary">
                <div class="panel-heading">
                    {dgettext("examiner", "Edit Certification for")} {$examiner_name}
                </div>
                <div class="panel-body" id="panel-body">
                    {foreach from=$form.errors item=error}
                    <div class="col-xs-12">
                        <div class="alert alert-danger" role="alert">{$error}</div>
                    </div>
                    {/foreach}
                    <div class="row hidden-xs hidden-sm">
                        <div class="col-md-3">
                            <label>{dgettext("loris", "Instrument")}</label>
                        </div>
                        <div class="col-md-2">
                            <label>{dgettext("examiner", "Certification Status")}</label>
                        </div>
                        <div class="col-md-2 col-md-offset-1">
                            <label>{dgettext("examiner", "Certification Date")}</label>
                        </div>
                        <div class="col-md-2 col-md-offset-1">
                            <label>{dgettext("examiner", "Comments")}</label>
                        </div>
                    </div>
                    <hr class="row hidden-xs hidden-sm">
                    {foreach from=$instruments key=ID item=name}
                    <div class="row">
                        <div class="col-md-3">
                            <label>{$form.$name.label}</label>
                        </div>
                        {$form.$name.html}
                    </div>
                    {/foreach}
                    <hr class="row hidden-xs hidden-sm">
                    <div class="row">
                        {if not $success|default}
                        <div class="col-xs-12">
                            <div class="col-sm-6 col-md-2 col-xs-12 col-md-offset-8">
                                <input class="btn btn-sm btn-primary col-xs-12" name="fire_away" value="{dgettext("loris", "Save")}" type="submit">
                            </div>
                            <div class="col-sm-6 col-md-2 col-xs-12">
                                <input class="btn btn-sm btn-primary col-xs-12" value="{dgettext("loris", "Reset")}" type="reset" onclick="location.href='{$baseurl|default}/examiner/editExaminer/?reset=true&identifier={$identifier}'">
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
        <h3>{dgettext("examiner", "Change Log")}</h3>
    </div>
</div>
<table class="table table-hover table-primary table-bordered dynamictable">
    <tr class="info">
        <th>{dgettext("loris", "Time")}</th>
        <th>{dgettext("examiner", "User")}</th>
        <th>{dgettext("examiner", "Measure")}</th>
        <th>{dgettext("examiner", "Old Value")}</th>
        <th>{dgettext("examiner", "Old Date")}</th>
        <th>{dgettext("examiner", "New Value")}</th>
        <th>{dgettext("examiner", "New Date")}</th>
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
            {dgettext("examiner", "No changes have been made")}
        </td>
    </tr>
    {/section}
</table>
