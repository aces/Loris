$("body").delegate("[name^=digit_span]", "change", function () {
	if ($(this).val() == 2) {
		document.getElementsByName($(this).attr("name").slice(0,-1)+"2")[0].value = 0;
		document.getElementsByName($(this).attr("name").slice(0,-1)+"2")[0].disabled=true;
	} else {
		document.getElementsByName($(this).attr("name").slice(0,-1)+"2")[0].disabled=false;
	}
});

