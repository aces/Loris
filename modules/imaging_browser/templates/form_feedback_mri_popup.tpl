<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8"/>
<link rel="stylesheet" href="{$css}" type="text/css" />
<!-- shortcut icon that displays on the browser window -->
<link rel="shortcut icon" href="{$baseurl|default}/images/mni_icon.ico" type="image/ico" />

<title>DCC MRI Quality Control</title>
</head>
<body>
{section name=error loop=$error_message}
{$error_message[error]}<br />
{/section}

<p><a href="javascript:window.close()">Click here to close this window</a></p>

<div>

{if $saved|default}
<p>Comments saved.</p>
{/if}

<table cellpadding="2" class="table table-hover table-bordered dynamictable">
{section name=data loop=$identifier}
    <tr>
        <th style="text-align:left">{$identifier[data].name}:</th>
        <td style="text-align:left">{$identifier[data].value}</td>
    </tr>
{/section}
</table>

{if $has_permission}
<form method="post">
{/if}

{foreach from=$comment item=curr_comment}
<h3>
    {$curr_comment.name}
    {if $curr_comment.select_value_array|default and $curr_comment.select_name|default}
        {* the assign is simply because i [jharlap] don't have time to figure out how to make this work otherwise *}
        {assign
            var="save_comment_status_field_name"
            value="saveCommentStatusField["|cat:$curr_comment.select_name|cat:"]"
        }
        {html_options
            name=$save_comment_status_field_name
            values=$curr_comment.select_value_array
            selected=$curr_comment.selected|default
            output=$curr_comment.select_value_array
            class='input-sm'
        }
    {else}
        {if $curr_comment.selected}({$curr_comment.selected}){/if}
    {/if}
</h3>

{if !$has_permission}
<ul>
{/if}

{section name=predefined loop=$curr_comment.predefined}
{if $has_permission}
<input type="checkbox" name="savecomments[predefined][]" value="{$curr_comment.predefined[predefined].id}" {if $curr_comment.predefined[predefined].checked}checked="checked"{/if}>&nbsp;{$curr_comment.predefined[predefined].predefined_text}<br />
{elseif $curr_comment.predefined[predefined].checked}
<li style="padding-left:0.4em">{$curr_comment.predefined[predefined].predefined_text}</li>
{/if}
{/section}

{if !$has_permission}
</ul>
{/if}

{if $has_permission}
<textarea rows='3' cols='60' name='savecomments[text][{$curr_comment.type}]'>
{/if}
{$curr_comment.saved_text}
{if $has_permission}
</textarea><br />
{/if}

{/foreach}

{if $has_permission}
<input type="submit" name="fire_away" value="Save">
</form>
{/if}

</div>

</body>
</html>
