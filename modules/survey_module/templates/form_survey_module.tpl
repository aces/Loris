
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
	.btn-circle, .btn-box {
        width: 30px;
        height: 30px;
        text-align: center;
        padding: 6px 0;
        font-size: 12px;
        line-height: 1.428571429;
        margin-right: 10px;
        background: white;
    }
    .btn-circle {
        border-radius: 15px;
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
    .selectOption {
        padding-top: 5px;
    }
    .selectBox {
        width: 50px;
        float: left;
    }
    .selectBox > label {
        outline: 0;
        background-image: none;
        -webkit-box-shadow: inset 0 3px 5px rgba(0,0,0,0.125);
        box-shadow: inset 0 3px 5px rgba(0,0,0,0.125);
    }
    .h3title {
        font-size: 24px;
    }
    @media (min-width: 768px) {
        .col-sm-custom {
            width: 12.16666667%;
        }
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