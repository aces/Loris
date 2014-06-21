<form method="post" name="candidate_parameters" id="candidate_parameters">
<table class="std">

    <!-- table title -->
    <tr><th colspan="6">Candidate Information</th></tr>

    {foreach from=$form.errors item=error}
    <tr>
        <td nowrap="nowrap" colspan="6" class="error">{$error}</td>
    </tr>
    {/foreach}
	
    {if $form.dob_error}
    <tr>
        <td colspan="6" class="error">{$form.dob_error.label}</td>
    </tr>
    {/if}
    <tr>
        <td nowrap="nowrap" >{$form.pscid.label}</td>
        <td nowrap="nowrap" id="pscid">{$pscid}</td>
    </tr>
    {foreach from=$params_list item=value key=name}
    <tr>
        <td nowrap="nowrap">{$form.$name.label}</td>
        <td nowrap="nowrap">{$value}</td>
    </tr>
    {/foreach}

    <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td nowrap="nowrap" colspan="6">
        <input class="button" onclick="location.href='main.php?test_name=candidate_parameters&subtest=update_candidate_info&candID={$candID}&identifier={$candID}'" value="Update Candidate Info" type="button" />
     </td>
     </tr>
{if $display_proband}
     <tr><th colspan="6">Proband Information</th> </tr>
{foreach from=$proband_info item=value key=name}
<tr>
<td nowrap="nowrap">{$form.$name.label}</td>
<td nowrap="nowrap">{$value}</td>
</tr>
{/foreach}
    <tr>
        <td nowrap="nowrap">{$form.Age_Difference.label}</td>
        <td nowrap="nowrap">{$form.Age_Difference.html}</td>
    </tr>

    <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td nowrap="nowrap" colspan="6">
    <input class="button" onclick="location.href='main.php?test_name=candidate_parameters&subtest=update_proband_info&candID={$candID}&identifier={$candID}'" value="Update Proband Info" type="button" />
    </td>
    </tr>
{/if}
{if $display_family}
      <tr><th colspan="6">Family Information</th></tr>
    <tr>
       {foreach from=$sibling_list item=sibling key=keyid}
    <tr>
    <td nowrap="nowrap">{$form.SiblingcID.label}</td>
    <td>
     <a href="main.php?test_name=timepoint_list&candID={$sibling.CandID}">
         {$sibling.CandID}
      </a>
   </td>
   </tr>
    <tr>
    <td nowrap="nowrap">{$form.relation_type.label}</td>
    <td nowrap="nowrap">{$sibling.Relationship_type}</td>
    </tr>
    {/foreach}
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td nowrap="nowrap" colspan="6">
    <input class="button" colspan="2" onclick="location.href='main.php?test_name=candidate_parameters&subtest=add_family&candID={$candID}&identifier={$candID}'" value="Add Family Info" type="button" />
    </td>
 {/if} 
<tr><th colspan="6">Participant Status</th></tr>
{*
<tr>
<td nowrap="nowrap" >{$form.pscid.label}</td>
<td nowrap="nowrap" id="pscid">{$pscid}</td>
</tr>
*}
<tr>
<td><b>Status</b></td>
<td><b>Details</b></td>
<td><b>Data Entry Staff</b></td>
<td><b>Date Updated</b></td>
<td><b>Comments</b></td>
</tr>
{foreach from=$history_list item=row}
<tr>
{foreach from=$row item=value key=name}
<td>{$value}</td>
{/foreach}
<tr></tr>
{/foreach}

<tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
<td nowrap="nowrap" colspan="6">
    <input class="button" onclick="location.href='main.php?test_name=candidate_parameters&subtest=update_participant_status&candID={$candID}&identifier={$candID}'" value="Update Participant Status" type="button" />
</td>
</tr>


{if $display_consent}
<tr><th colspan="6">Participation Consent Status</th></tr>
{foreach from=$consent_list item=list}
{foreach from=$list item=consent key=listname}
{if $listname=='label'}
{foreach from=$consent item=row}
<td><b>{$row}</b></td>
{/foreach}
{/if}
{if $listname=='history'}
{foreach from=$consent item=row}
<tr>
{foreach from=$row item=value key=name}
<td>{$value}
{/foreach}
</tr>
{/foreach}
{/if}
{/foreach}
{/foreach}
{if $form.$row.error}
<span class="error">{$form.$row.error}</span>
{/if}
</td>
</tr>
<tr>
<td colspan="6">&nbsp;</td>
</tr>
<tr>
<td></td>
    <td></td>
    <td></td>
    <td></td>
<td nowrap="nowrap" colspan="6">
    <input class="button" onclick="location.href='main.php?test_name=candidate_parameters&subtest=update_consent_info&candID={$candID}&identifier={$candID}'" value="Update Consent Info" type="button" />
</td>
</tr>
{/if}
<tr>
<input class="button" onclick="location.href='main.php?test_name=timepoint_list&candID={$candID}'" value="Return to timepoint list" type="button" />
</td>
</tr>
</table>
{$form.hidden}
</form>
