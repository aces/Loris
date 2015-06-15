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

        </div>
        <h3>Add New Feedback</h3>
        <div id ="new_feedback">
		<input type="text" id="comment">
		<button id="save_data">Save data</button>

        </div>
    </div><!-- accordion -->

</div>
<!-- </div><!-- /panel -->

