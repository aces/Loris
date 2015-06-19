<link rel="stylesheet" href="css/jquery-ui-1.10.4.custom.css" type="text/css"/>
<script src="js/jquery/jquery-ui-1.10.4.custom.min.js"></script>
{*<script src="js/feedback_bvl_popup.js"></script>*}
{*<script src ="js/jasny-bootstrap-all.js"></script>*}
<script src ="js/bvl_feedback_panel.js"></script>
<link rel="stylesheet" href="css/jasny-bootstrap-all.css" type="text/css" />

<!-- <div class ="ui-responsive-panel" data-role="panel" id="right-panel" data-position-fixed="true" data-display="push" data-position="right"> -->
<div class="navmenu navmenu-default navmenu-fixed-right offcanvas" id="bvl_feedback_menu">
    <div class=navbar navbar-default navbar-fixed-top"> <a style="color: white" href="main.php?test_name=candidate_list" id="candID"" name ="{$candID}">CANDID: {$candID}</a> - PSCID: {$PSCID}</div>
    <div id="accordion">
        <h3>Candidate Overview</h3>
        <div>

        </div>
        <h3>Current Thread Status</h3>
        <div>
		<table id="current_thread_tables" class ="table table-hover table-primary table-bordered dynamictable">
		<tr>
			<td>ID</td>
			<td>Date</td>
			<td>User</td>
		</tr>
		{foreach from=$thread_list item=value}
		<tbody id="{$value.FeedbackID}" name="entries">
		    <tr>
			    <td>{$value.FeedbackID}<span id="comment_icon_{$value.FeedbackID}" class="glyphicon glyphicon-pencil" name="comment_icon"></span></td>
			    <td>{$value.Date}</td>
			    {*<td>{$value.User}</td>*}
                <td><div class="btn-group">
                        {if $value.QC_status == 'opened'}
                        <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Opened <span class="caret"></span>
                        </button>
                            <ul class="dropdown-menu">
                                <li><a id="close_thread_{$value.FeedbackID}">Close</a></li>
                            </ul>
                        {/if}
                        {if $value.QC_status == 'closed'}
                        <button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Closed <span class="caret"></span>
                        </button>
                            <ul class="dropdown-menu">
                                <li><a id="open_thread_{$value.FeedbackID}">Re-Open</a></li>
                            </ul>
                        {/if}

                    </div></td>
		    </tr>
		</tbody>
            {/foreach}
		</table>
        </div>
        <h3>Add New Feedback</h3>
        <div id ="new_feedback">
		<textarea class="form-control" rows="3" id="comment"></textarea>
		<button id="save_data">Save data</button>

        </div>
    </div><!-- accordion -->

</div>
<!-- </div><!-- /panel -->

