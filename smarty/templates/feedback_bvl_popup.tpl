<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="stylesheet" href="{$css}" type="text/css" />
<!-- shortcut icon that displays on the browser window -->
<link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />

<title>{$study_title}</title>
</head>
<body>

<!-- start main table -->
<table valign="top" width="100%" border="0" cellpadding="3" cellspacing="2">
<tr>
<th background="images/title_background.jpg" class="banner" colspan="2" align="left">
<strong>{$study_title} - Behavioural Feedback system</strong>
</th>
</tr>
<tr>
<td colspan="2">

{if $error_message}
    <!-- table with error messages -->
    <table border="0" valign="top" width="100%" >
    <tr>
    <th>The following errors have occured:</th>
    </tr>
    {section name=errorMsg loop=$error_message}
        <tr>
        <td class="controlPanelSection" nowrap="nowrap">{$error_message[errorMsg]}</td>
        </tr>
    {/section}
    </table>
    <!-- end table -->
{else}
    {if $candID!=""}
        <!-- table with candidate profile information -->
        <table border="0" valign="top" width="100%" >
        <td class="controlPanelSection" nowrap="nowrap">
        DCCID: <a target="GUI" href="main.php?test_name=timepoint_list&candID={$candID}">{$candID}</a> &nbsp;
        PSCID: {$PSCID} &nbsp;
        {if $sessionID!=""}
            Visit: <a target="GUI" href="main.php?test_name=instrument_list&candID={$candID}&sessionID={$sessionID}">{$visitLabel}</a> &nbsp;
        {/if}
        {if $commentID!=""}
            Instrument: {$instrument_name} &nbsp;
        {/if}
        </td>
        </table>
        <!-- end table -->
    {/if}
    
    {if $candID!=""}
    <!-- activate and close forms - shown only to authorized users-->
    {if $has_permission}
        <table border="0" valign="top" width="100%" class="std">
        <!-- form to activate new threads -->
            <!--<form name="activateThreadsForm" method="post" action="{$formAction}">
                <td align="center"><input type="submit" name="activate_thread_form_submit" value="Post New Feedback" class="button"></td>
            </form>-->
        <!-- form to close active threads -->
            <form name="closeThreadsForm" method="post" action="{$formAction}">
                <td align="center"><input type="submit" name="close_thread_form_submit" value="Close All Threads" class="button"></td>
            </form>
        </table>
    {/if}
    {/if}
        
    {if $candID!=""}
    <!-- create feedback form- shown only to authorized users-->
    <table border="0" valign="top" width="100%" class="std">
    <tr>
    <th colspan="4">Add new {$feedbackLevel} level feedback</TH>
    </tr>
    {if $form_error_message.new!=""}
        <TH class="error" bcolor="#FF0000" colspan="4" >{$form_error_message.new}</TH>
    {/if}
    <form name="newThreadForm" method="post" action="{$formAction}">
      <tr>
      <th>Type</th>
      {if $commentID!=""}
          <th>FieldNames</th>
      {/if}
      <th>Comment</th>
      <th>Action Required?</th>
      <td align="center" rowspan="6"><input type="submit" name="add_new_thread_form_submit" value="Save Data" class="button"></td>
        {section name="typeCounter" loop=$threadTypes}
        {assign var=newTypeCounter value=$threadTypes[typeCounter].Type}
        <tr>
          <td align="center">
          {$threadTypes[typeCounter].Label}
          <input type="hidden" name="newFormThreadData[{$newTypeCounter}][Type]" value="{$newTypeCounter}">
          <input type="hidden" name="newFormThreadData[{$newTypeCounter}][Level]" value="{$feedbackLevel}">
          </td>
          <td align="center">
			     {html_options name="newFormThreadData[$newTypeCounter][FieldName]" values=$FieldNames selected=$new_thread_data[$newTypeCounter].FieldNameValue options=$FieldNames}
   	      </td>
          <td align="center"><input type="text" size="30" maxlength="255" name="newFormThreadData[{$newTypeCounter}][Comment]" value="{$new_thread_data[$newTypeCounter].CommentValue}"></td>
          
          <td align="center">
                {if $has_permission}
                    {html_options name="newFormThreadData[$newTypeCounter][Public]" values=$YNArray selected=$new_thread_data[$newTypeCounter].PublicValue options=$YNLabelArray}
                {else}
                    <input type="hidden" name="newFormThreadData[{$newTypeCounter}][Public]" value="N">
                {/if}
          </td>
        </tr>
        {/section}
    </table>
    {/if}
    
    <!-- table with threads summary -->
    <table border="0" valign="top" width="100%" class="listColorCoded">
    <tr>
    <th nowrap="nowrap">QC Class</th>
    {if $sessionID!=""}
        <th nowrap="nowrap">Instrument</th>
    {else}
        <th nowrap="nowrap">Visit</th>
    {/if}
    <th nowrap="nowrap"># Threads</th>
    </tr>
    {section name=record loop=$thread_summary_data}
        <tr>
        <td nowrap="nowrap">{$thread_summary_data[record].QC_Class}</td>
        {if $sessionID!=""}
            <td nowrap="nowrap">
            {if $thread_summary_data[record].CommentID != $commentID}
                <a target="GUI" href="main.php?test_name={$thread_summary_data[record].Instrument}&candID={$candID}&sessionID={$sessionID}&commentID={$thread_summary_data[record].CommentID}">
            {/if}
            {$thread_summary_data[record].Instrument}</a></td>
        {else}
            <td nowrap="nowrap"><a target="GUI" href="main.php?test_name=instrument_list&candID={$candID}&sessionID={$thread_summary_data[record].SessionID}">{$thread_summary_data[record].Visit}</a></td>
        {/if}
        <td nowrap="nowrap">{$thread_summary_data[record].No_Threads}</td>
        </tr>
    {sectionelse}
        <tr><td colspan="7">No feedback</td></tr>
    {/section}
    </table>

    <!-- form to add new thread and new comments -->
    <form name="existingThreadForm" method="post" action="{$formAction}">
    
    <!-- table with threads details - data -->   
    <table valign="top" width="100%" class="std">
    {section name=thread loop=$thread_list_data}
    {assign var=threadCount value=$smarty.section.thread.index}
        <th nowrap="nowrap">FieldName</th>
        <th nowrap="nowrap">FeedbackID</th>
        <th nowrap="nowrap">Type</th>
        <th nowrap="nowrap">QC Status</th>
        <th nowrap="nowrap">Date</th>
        <th nowrap="nowrap">Modified</th>
        <th nowrap="nowrap">Active</th>
        </tr>
        <tr id= "{$thread_list_data[thread].FeedbackID}">
        <td align="center">{$thread_list_data[thread].FieldName}</td>
        <td align="center">{$thread_list_data[thread].FeedbackID}</td>
        <td align="center">{$thread_list_data[thread].Type}</td>
        <td align="center" bgcolor="{$thread_list_data[thread].QC_color}">{$thread_list_data[thread].QC_status}</td>
        <td align="center">{$thread_list_data[thread].Date}</td>
        <td align="center">{$thread_list_data[thread].Modified}</td>
        <td align="center">{$thread_list_data[thread].Active}</td>
        </tr>
        {section name=entry loop=$thread_entry[thread]}
            <tr>
            <td align="left" colspan="4">{$thread_entry[thread][entry].UserID} &nbsp;
            [{$thread_entry[thread][entry].Date}] &nbsp;
            </td>
            <td>[{$thread_entry[thread][entry].Date}] &nbsp</td>
          	<td>{$thread_entry[thread][entry].FieldName}</td>
     		<td><B>{$thread_entry[thread][entry].Comment}</B></td>
            </tr>
        {/section}
        <!-- error message row -->
        {if $thread_list_data[thread].error_message != ""}
            <tr>
            <td colspan="4">{$thread_list_data[thread].error_message}</td>
            </tr>
        {/if}
        <tr>
        <td colspan="7">
            <table valign="top" width="100%">
                <th>Comment</th>
                {if $has_permission}
                    <th>Change Type</th>
                        {if $existing_thread_data[thread].doNotShowStatusField}
                          <th>QC Status</th>
                        {/if}
                    <th>Action Required?</th>
                {/if}
                <td align="center" rowspan="2"><input type="submit" name="existing_thread_form_submit" value="Save Data" class="button"></td>
                </tr>
                <tr>
                <td align="center"><input TYPE=TEXT SIZE=30 NAME="formThreadData[{$threadCount}][Comment]" VALUE="{$existing_thread_data[thread].CommentValue}"></td>
                <input type="hidden" name="formThreadData[{$threadCount}][FeedbackID]" VALUE="{$thread_list_data[thread].FeedbackID}">
                
                {if $has_permission}
                    <td align="center">
                        {html_options name="formThreadData[$threadCount][Type]" values=$threadTypeIDArray selected=$existing_thread_data[thread].Type output=$threadTypeLabelArray}
                    </td>
                    {if $existing_thread_data[thread].doNotShowStatusField}
                      <td align="center">
                      {html_options name="formThreadData[$threadCount][Status]" values=$existing_thread_data[thread].threadStatusArray selected=$existing_thread_data[thread].Status output=$existing_thread_data[thread].threadStatusLabelArray}
                      </td>
                    {/if}
                    <td align="center">
                        {html_options name="formThreadData[$threadCount][Public]" values=$threadYNArray selected=$existing_thread_data[thread].Public output=$threadYNLabelArray}
                    </td>
                {else}
                    <input type="hidden" name="formThreadData[{$threadCount}][Status]" VALUE="{$existing_thread_data[thread].threadStatusArray}">
                {/if}
                </tr>
            </table>
        </td>
        </tr>  
        <br>
    {/section}
    </table>    

    </form>
{/if}

<!-- end Main Table and HTML PAGE -->
</td>
</tr>
</table>
</body>
</html>
