$(document).ready(function() {
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

        formEl.action = document.documentURI;
        //formEl.action = "submit.php?key=" + document.getElementById("key").textContent;
        $("#test_form").submit();
    }
    $("#savecontinue").click(ajaxSubmit);
    $("#finalize").click(ajaxSubmit);
    $("#complete").click(ajaxSubmit);
    $("#goback").click(ajaxSubmit);

    var NavButtons = document.getElementById("buttons");
    if(NavButtons) {
        var InstrumentTable = document.getElementsByClassName("instrument")[0];
        var Footer = document.createElement("tfoot");
        Footer.appendChild(NavButtons);
        InstrumentTable.appendChild(Footer);
    }

});
