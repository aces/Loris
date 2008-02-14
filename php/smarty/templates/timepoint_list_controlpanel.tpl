                <tr><td class="controlPanelSection">Actions</td></tr>
                <tr>
                    <td class="controlPanelItem">
{if $isDataEntryPerson}
                        <img src="images/open.gif" alt="" border="0" width="12" height="12" />&nbsp;<a href="main.php?test_name=create_timepoint&candID={$candID}&identifier={$candID}">
{else}
                        <img src="images/locked.gif" alt="" border="0" width="12" height="12" />&nbsp;
{/if}
                        Create time point</a>
                    </td>
                </tr>
                    <td class="controlPanelItem">
{if $isDataEntryPerson}
                        <img src="images/open.gif" alt="" border="0" width="12" height="12" />&nbsp;<a href="main.php?test_name=candidate_parameters&candID={$candID}&identifier={$candID}">
{else}
                        <img src="images/locked.gif" alt="" border="0" width="12" height="12" />&nbsp;
{/if}
                        Edit Candidate Info</a>
                    </td>
                </tr>
                <tr>
                    <td class="controlPanelItem">
{if $isDataEntryPerson}
                        <img src="images/open.gif" alt="" border="0" width="12" height="12" />&nbsp;<a href="main.php?test_name=demographics&candID={$candID}&identifier={$candID}">
{else}
                        <img src="images/locked.gif" alt="" border="0" width="12" height="12" />&nbsp;
{/if}
                        Demographics Form</a>
                    </td>
                </tr>
                <tr>
                    <td class="controlPanelItem">
{if $isDataEntryPerson}
                        <img src="images/open.gif" alt="" border="0" width="12" height="12" />&nbsp;<a href="main.php?test_name=mri_safety&candID={$candID}&identifier={$candID}">
{else}
                        <img src="images/locked.gif" alt="" border="0" width="12" height="12" />&nbsp;
{/if}
                        MRI Safety Form</a>
                    </td>
                </tr>
                <tr><td>&nbsp;</td></tr>