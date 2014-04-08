{* This implements the default review page for a direct data entry instrument.
   Any instrument may override the getReview() function to use this (or another)
   template in order to customize the review page *}
<table class="instrument_review" width="75%" align="center">
    <thead>
        <tr>
            <th>Question</th>
            <th>Response</th>
        </tr>
    </thead>
    <tbody>
    {foreach item=row from=$questions}
        <tr {if $row.response==''}class="unanswered"{/if}>
            <td>{$row.question}</td>
            <td>{$row.response|default:"-"|replace:"_":" "|capitalize}</td>
        </tr>
    {/foreach}
    </tbody>
</table>

