<div class="container">
    <div align="center">
        <h2>{$page_title} </h2>
    </div>
    <br>
        <table class="table table-striped table-bordered">
        <tbody><tr class="reviewPage">
            <td><div><b>No</b></div></td>
            <td><div><b>Visit</b></div></td>
            <td><div><b>Survey</b></div></td>
            <td><div><b>Status</b></div></td>
            <td><div><b>Survey Link</b></div></td>
            <td><div><b>Estimated Time To Complete (Minutes)</b></div></td>
        </tr>
        {assign var=number value=1}
        {section name=data loop=$survey_data}
        <tr class="reviewPage">
            <td><div><p>{$number++}</p></div></td>
            <td><div><p>{$survey_data[data].Visit_label}</p></div></td>
            <td><div><p>{$survey_data[data].Full_name}</p></div></td>
            {if $survey_data[data].Status == 'Complete'}
                <td id="complete"><div><p>{$survey_data[data].Status}</p></div></td>
            {elseif $survey_data[data].Status == 'In Progress' }
                <td id="progress"><div><p>{$survey_data[data].Status}</p></div></td>
            {else}
            <td id="not_started"><div><p>Not Started</p></div></td>
            {/if}
                <td><div><p><a href="{$survey_url}{$survey_data[data].OneTimePassword}" target="_blank">Open Survey</a></p></div></td>
            {if $survey_data[data].completion_time === '' || $survey_data[data].completion_time === NULL}
            <td><div><p>10</p></div></td>
                {else}
                <td><div><p>{$survey_data[data].completion_time}</p></div></td>
            {/if}
        </tr>
        {/section}
        </tbody>
        </table>
    </div>
