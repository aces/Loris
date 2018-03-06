
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
        	}, React.createElement(DirectEntry));
        ReactDOM.render(DirectEntryApp, document.getElementById("reactInput"));
    });
</script>