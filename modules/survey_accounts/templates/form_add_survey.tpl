{if $success}
<p>Survey was added successfully.<br/> Click here to go back to view the list of survey's created : <a href=main.php?test_name=survey_accounts> Survey List</a><br /></p>
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
                <input class="btn btn-sm btn-primary email" name="fire_away" value="Create and email" id="email_survey" type="submit">
        {/if}
            </td>
        </tr>
    </table>
    {$form.hidden}
    <div id="email_dialog">
        <textarea name="email_dialog" rows="24" cols="80">This is where your message goes.</textarea>
    </div>
</form>
</div>
