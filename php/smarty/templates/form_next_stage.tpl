{if $success}

<p>Next stage started. <a href="main.php?test_name=instrument_list&candID={$candID}&sessionID={$sessionID}">Click here to continue</a>.</p>

{else}

<br />
<form method="post" name="next_stage" id="next_stage">
<table class="std">
    <!-- table title -->
    <tr><th colspan="2">Start Next Stage</th></tr>

    {foreach from=$form.errors item=error}
    <tr>
        <td nowrap="nowrap" colspan="2" class="error">{$error}</td>
    </tr>
    {/foreach}

    <tr>
        <td nowrap="nowrap">Date of {$stage}</td>
        <td nowrap="nowrap">{$form.date1.html}</td>
    </tr>
    <tr>
        <td nowrap="nowrap">Retype Date of {$stage}</td>
        <td nowrap="nowrap">{$form.date2.html}</td>
    </tr>

    {if $form.SubprojectID.html != ""}
    <tr>
        <td nowrap="nowrap">SubprojectID:</td>
        <td nowrap="nowrap">{$form.SubprojectID.html}</td>
    </tr>
    {/if}

    {if $form.scan_done.html != ""}
    <tr>
        <td nowrap="nowrap">Scan Done:</td>
        <td nowrap="nowrap">{$form.scan_done.html}</td>
    </tr>
    {/if}

    <tr>
        <td nowrap="nowrap" colspan="2"><input type="submit" name="fire_away" value="Start {$stage}" class="button" /></td>
    </tr>
</table>
{$form.hidden}
</form>

{if $stage == "Screening"}
<p>The date of {$stage|lower} is the <em>administration date of the first behavioural instrument</em>.</p>
{elseif $stage == "Visit"}
<p>The date of {$stage|lower} is the <em>date of the first MR scan</em>.<br />
In case the scan was not done,<br />enter the date of the subject"s visit to the site.<br />
<em>Scan Done Field</em>: As per Scanning and Evaluation Report.</p>
{else}
<p>This is not a valid stage to start!</p>
{/if}

{/if}

