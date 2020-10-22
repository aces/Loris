<script src="{$baseurl}/js/loris.js" type="text/javascript"></script>
<script src="{$baseurl}/js/jquery/jquery-1.11.0.min.js" type="text/javascript"></script>
<script src="{$baseurl}/js/react/react-with-addons.js" type="text/javascript"></script>
<script src="{$baseurl}/js/react/react-dom.js" type="text/javascript"></script>
<script src="{$baseurl}/js/components/DirectEntry.js"></script>
<script src="{$baseurl}/js/components/Markdown.js"></script>
<link rel="stylesheet" href="{$baseurl}/bootstrap/css/bootstrap.min.css">
<style type="text/css">
	#page {
		margin-top: 50px;
	}
	.question-container {
		margin-bottom: 80px;
		text-align: center;
	}
	.field_question {
		margin-bottom: 25px;
        text-align: left;
        color: #064785;
	}
	.field_input {
		text-align: left;
	}
	.field_input > * {
		margin-bottom: 5px;
	}
	.btn-circle {
        width: 30px;
        height: 30px;
        text-align: center;
        padding: 6px 0;
        font-size: 12px;
        line-height: 1.428571429;
        border-radius: 15px;
        margin-right: 10px;
        background: white;

    }
    .select-option:hover {
      	background: lightgrey;
    }
    .select-option {
      	padding-bottom: 5px;
      	padding-top: 5px;
      	border-radius: 3px;
    }
    .has-error, .form-error {
		color: #b94a48;
	}
    .reviewPage{
        text-align: left;
    }
    .footer-bar {
        margin-top: 20px;
        color: white;
        text-align: right;
    }
</style>

<div id="reactInput">
</div>

<script>
	$(function() {
        var DirectEntryApp = React.createElement("div", {
            	className: "page-media"
        	}, React.createElement(DirectEntry, {
        		"InstrumentJSON" : {$InstrumentJSON},
        		"Values" : {$Values}
        	}));
        ReactDOM.render(DirectEntryApp, document.getElementById("reactInput"));
    });
    var loris = new LorisHelper({}, {});
</script>
