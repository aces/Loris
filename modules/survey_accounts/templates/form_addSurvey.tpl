{if $success}
<p>Survey was added successfully.<br/> Click here to go back to view the list of survey's created : <a href="{$baseurl}/survey_accounts/">Survey List</a><br /></p>
<br />
{/if}
<br />

<div class="col-md-8">
<form method="post" name="survey_accounts" id="participant_accounts_form">
    {if not $success}
    <table class="table table-primary table-bordered" border="0">
        <!-- table title -->
        <tr class="info"><th colspan="2">Usage</th></tr>

        <tr>
            <td colspan="2">
                Use this form to create a link for a study participant to use in order to directly enter a form/data into Loris. 
            </td>
        </tr>

        <!-- table title -->
        <tr class="info"><th colspan="2">Add Survey</th></tr>

        {foreach from=$form.errors item=error}
        <tr>
            <td nowrap="nowrap" colspan="2" class="error">{$error}</td>
        </tr>
        {/foreach}

        <tr>
            <td id="email-error" nowrap="nowrap" colspan="2" style="display: none;" class="error"></td>
        </tr>

        <tr>
            <td nowrap="nowrap">{$form.CandID.label}</td>
            <td nowrap="nowrap">{$form.CandID.html}</td>
        </tr>
        <tr>
            <td nowrap="nowrap">{$form.PSCID.label}</td>
            <td nowrap="nowrap">{$form.PSCID.html}</td>
        </tr>
        <tr>
            <td nowrap="nowrap">{$form.VL.label}</td>
            <td nowrap="nowrap">{$form.VL.html}</td>
        </tr>
        <tr>
            <td nowrap="nowrap">{$form.Test_name.label}</td>
            <td nowrap="nowrap">{$form.Test_name.html}</td>
        </tr>
        <tr>
            <td nowrap="nowrap">{$form.Email.label}</td>
            <td nowrap="nowrap" id="Email">{$form.Email.html}</td>
        </tr>
       <tr>
            <td nowrap="nowrap">{$form.Email2.label}</td>
            <td nowrap="nowrap" id="Email2">{$form.Email2.html}</td>
        </tr>
        <tr>
            <td nowrap="nowrap" colspan="2">
                <input class="btn btn-sm btn-primary" name="fire_away" value="Create survey" id="create_survey" type="submit" />
                <input class="btn btn-sm btn-primary email" name="fire_away" value="Email survey" id="email_survey" type="submit" />
        {/if}
            </td>
        </tr>
    </table>
    {$form.hidden}
    <div id="emailModal" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h3 class="modal-title">Email to Study Participant</h3>
                </div>
            <div class="modal-body">
                <textarea class="form-control" id="emailContent" name="email_dialog" rows="24" cols="80" placeholder="Optionally enter a customized message here. A default email will be sent if left blank.">This is where your message goes.</textarea>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" id="emailData" class="btn btn-primary">Email</button>
            </div>
        </div>
    </div>
</form>
</div>
