$(document).ready(function() {
    function readCookie(name) {
	var cookiename = name + "="; 
	var ca = document.cookie.split(';');
	for (var i=0;i < ca.length;i++)
	{
		var c = ca[i];
		while (c.charAt(0) ==' ') c = c.substring(1,c.length);
		if (c.indexOf(cookiename) == 0) return c.substring(cookiename.length,c.length);
	}
	return null;
    }
   
    function delete_cookie( name ) {
       document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    var cookie_name = 'MissingResponses';
    if (readCookie(cookie_name)) {
        var g = document.createElement('div');
        g.id = 'dialog-modal';
        g.title = "Missing responses";
        g.class = "popup";
        var str = readCookie(cookie_name); 
        g.innerHTML = decodeURIComponent((str + '').replace(/\+/g, '%20')); 
        document.body.appendChild(g);
        var pageNum = readCookie('PrevPage');
        var key = readCookie('URLKey');
        $("#dialog-modal").dialog({
            height: 340,
            width: 550,
            modal: true,
              buttons: {
              "Go back": function() {
		   window.location = "?key=" + key + "&pageNum=" + pageNum ;
                   delete_cookie('MissingResponses');
              },
              Cancel: function() {
                  $( this ).dialog( "close" );
                  delete_cookie('MissingResponses');
              }
             }
       });
   }

    ajaxSubmit = function(e) {
        var formEl = document.getElementById("test_form"),
            nextpageNode = document.getElementById("nextpage"),
            prevpageNode = document.getElementById("prevpage"),
            nextPage;

        if(e.currentTarget.id === 'savecontinue') {
            nextPage = nextpageNode.textContent;
        } else if(e.currentTarget.id === 'finalize') {
            nextPage = 'finalpage';
        } else if(e.currentTarget.id === 'complete') {
            nextPage = 'complete';
        } else if (e.currentTarget.id === 'goback') {
            nextPage = prevpageNode.textContent;
        }
        $("<input>").attr({
            type: 'hidden',
            name: 'nextpage',
            value: nextPage
        }).appendTo("#test_form");

        formEl.action = window.location.href;
        //formEl.action = "submit.php?key=" + document.getElementById("key").textContent;
        $("#test_form").submit();
    }
    $("#savecontinue").click(ajaxSubmit);
    $("#finalize").click(ajaxSubmit);
    $("#complete").click(ajaxSubmit);
    $("#goback").click(ajaxSubmit);

    var NavButtons = document.getElementById("buttons");
    if (NavButtons) {
	    var InstrumentTable = document.getElementsByClassName("instrument")[0];
	    var Footer = document.createElement("tfoot");
	    Footer.appendChild(NavButtons);
	    InstrumentTable.appendChild(Footer);
    }
});
