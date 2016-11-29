$(document).ready(function(){
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $(".wrapper").toggleClass("active");
    });
    $(".help-button").click(function(e) {
        var helpContent = $('div.help-content');
        if(helpContent.length) {
            helpContent.toggle();
            e.preventDefault();
            return;
        }
        var getParams = {};
        getParams.test_name = loris.TestName;
        if(loris.Subtest != "") {
            getParams.subtest = loris.Subtest;
        }
        document.cookie = 'LastUrl=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
        $.get(loris.BaseURL + "/help_editor/ajax/help.php", getParams, function (content) {
            var div = document.createElement("div"),
                btn = document.createElement("BUTTON"),
                edit = document.createElement("BUTTON"),
                text = document.createTextNode("Edit"),
                button = document.createTextNode("Close"),
		wrap;

		if (content.format == "markdown") {
			wrap = document.createElement("div");
	    wrap.setAttribute("id", "help-wrapper");

			ReactDOM.render(RMarkdown({ 'content' : content.content}), wrap);
		} else {
		            wrap = document.createElement("pre");
	    wrap.setAttribute("id", "help-wrapper");
	    wrap.innerHTML = "<hr id='help-separator'>";
            if (content.topic) {
            	wrap.innerHTML = "<h3>" + content.topic + "</h3>";
            } else {
		// This is a hack because otherwise the alignment of the edit/close
		// buttons gets screwed up. The CSS should eventually be fixed and
		// this removed.
			wrap.innerHTML = "<h3></h3>";
		}
            wrap.innerHTML += content.content;
            if (content.updated) {
	            wrap.innerHTML =  wrap.innerHTML + "<hr>Last updated: " + content.updated ;
            }
		}
            btn.appendChild(button);
            btn.className="btn btn-default";
            btn.setAttribute("id","helpclose");
            edit.appendChild(text);
            edit.className="btn btn-default";
            edit.setAttribute("id", "helpedit");
            div.appendChild(wrap);
            div.appendChild(btn);

		// Markdown format content came from the filesystem and can't
	// be edited online.
            if(loris.userHasPermission("context_help") && content.format !== 'markdown') {
                div.appendChild(edit);
                edit.addEventListener("click", function(e) {
                    e.preventDefault();
                    document.cookie = "LastUrl = " + document.location.toString();
                    window.open(loris.BaseURL + "/help_editor/edit_help_content/?section="
                        +getParams.test_name+"&subsection="+getParams.subtest, "_self");
                });
            }
            document.getElementById('page').appendChild(div);
            div.setAttribute("class", "help-content");
            $(div).addClass('visible');
            btn.addEventListener("click", function(e) {
                $(div).hide();
                e.preventDefault();
            }) ;
            e.preventDefault();
        },
        "json");
    });

    $(".dynamictable").DynamicTable();
    $(".fileUpload").FileUpload();
});

