<link rel="stylesheet" href="{$baseurl}/css/panel.css" type="text/css"/>
<script type="text/javascript" src ="{$baseurl}/bvl_feedback/js/bvl_feedback_panel_jquery.js"></script>
<meta itemprop="candID" context="{$candID}">
<meta itemprop="sessionID" context="{$sessionID}">
<meta itemprop="commentID" context="{$commentID}">
<script src="{$baseurl}/js/react-with-addons-0.13.3.js"></script>



<body>
<div class ="panel-wrapper" id="bvl_feedback_menu">
  <div id ="panel_content">

  </div>
</div><!-- /panel -->
</body>

<script type="text/javascript" src="{$baseurl}/bvl_feedback/js/react.behavioural_feedback_panel.js"></script>

<script type="text/javascript">

var feedback_level = {$feedback_level|@json_encode};
var candID = {$candID|@json_encode};
var PSCID = {$pscid|@json_encode};
var sessionID = {$sessionID|@json_encode};
var commentID = {$commentID|@json_encode};
var select_option = {$FieldNames};
var feedback_types = {$feedback_types|@json_encode}

  
  
  var bvl_panel = RBehaviouralFeedbackPanel({
	  feedback_level : feedback_level,
	  candID : candID,
	  pscid: PSCID,
	  sessionID : sessionID,
	  commentID : commentID,
	  select_options: select_option,
	  feedback_types: feedback_types
  });
  
React.render(bvl_panel, document.getElementById("panel_content"));
</script>
