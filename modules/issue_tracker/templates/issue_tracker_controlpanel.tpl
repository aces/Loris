<h3>Navigation</h3>
<ul>
    {if $issue.backURL}
    <br>
    <li>
        <a href="{$issue.backURL}">
            <span class="text-default">
                <span class="glyphicon glyphicon-backward"></span>&nbsp;Back to list
            </span>
        </a>
    </li>
    <br>
    {/if}
    {if $issue.prevIssue.URL != ''}
    <li>
        <a href="{$issue.prevIssue.URL}">
                   <span class="text-default">
                       <span class="glyphicon glyphicon-step-backward"></span>&nbsp;Previous
                   </span>
        </a>
        {/if}
        {if $issue.nextIssue.URL != ''}
        <a href="{$issue.nextIssue.URL}">
                  <span class="text-default">
                      &nbsp;&nbsp;Next&nbsp;<span class="glyphicon glyphicon-step-forward"></span>
                  </span>
        </a>
    </li>
    {/if}
</ul>
</td>
<td class='td-cpanel-fake'><table class='table-cpanel-fake'></table>
<!-- /Control Panel -->
