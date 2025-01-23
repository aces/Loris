Subject: [LORIS] Media Email Digest for Project(s) {$project} since {$startDate}

<html>
<body bgcolor="#FFFFFF">

<p>Hello,</p>
<p>{$count} new file(s) have been uploaded for project(s) {$project} since {$startDate}</p>


<br>
<table border="1">
    <tr>
        <th>Project</th>
        <th>PSCID</th>
        <th>File Name</th>
        <th>Date Uploaded</th>
    </tr>

    {foreach from=$entries key=id item=entry}
        <tr>
            <td style="padding: 10px; text-align: left">{$entry['Alias']}</td>
            <td style="padding: 10px; text-align: left">{$entry['PSCID']}</td>
            <td style="padding: 10px; text-align: left"><a href="{$url}/media/?fileName={$entry['file_name']}">{$entry['file_name']}</a></td>
            <td style="padding: 10px; text-align: left">{$entry['last_modified']}</td>
        </tr>
    {/foreach}
</table>

<br />
You are receiving this email as you have Media Upload Digest notifications turned <b>ON</b> in your LORIS profile.
To change your notification settings, please visit the <a href="{$url}/my_preferences/">my preferences page</a>.

</body></html>

<p>Thank you,</p>
<p>LORIS Team</p>