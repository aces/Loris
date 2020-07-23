import swal from 'sweetalert2';

$(document).ready(function(){
$("input[name=preview]").click(function(e) {
    if($('div.help-content').length) {
        $('div.help-content').remove();
        e.preventDefault();
    }
    var title   = $('input[name="title"]').val(),
        content = $('textarea[name="content"]').val(),
        myDate  = new Date(),
        div     = document.createElement("div"),
        btn     = document.createElement("BUTTON"),
        button  = document.createTextNode("Close"),
        wrap    = document.createElement("div");

     // add leading zeros to date format
     // Date.getMonth() returns the months 0 to 11, so add 1
     var month  = ('0'+(myDate.getMonth()+1)).slice(-2);
         date   = ('0'+myDate.getDate()).slice(-2);
         hour   = ('0'+myDate.getHours()).slice(-2);
         minute = ('0'+myDate.getMinutes()).slice(-2);
         second = ('0'+myDate.getSeconds()).slice(-2);

     var dateString = myDate.getFullYear() + "-" + month + "-" + date + " " +
                      hour + ":" + minute + ":" + second;

     wrap.setAttribute("id", "help-wrapper");
     wrap.innerHTML  = "<h3>" + title + "</h3>";
     markdownContent = document.createElement("div");
     ReactDOM.render(RMarkdown({content: content}), markdownContent);
     wrap.appendChild(markdownContent);
     wrap.innerHTML  =  wrap.innerHTML + "<hr>Last updated: " + dateString;
     btn.appendChild(button);
     btn.className="btn btn-default";
     btn.setAttribute("id","helpclose");
     div.appendChild(btn);
     div.appendChild(wrap);
     document.getElementById('page').appendChild(div);
     div.setAttribute("class", "help-content");
     btn.addEventListener("click", function(e) {
        $(div).remove();
        e.preventDefault();
        }) ;
     e.preventDefault();

});
$("#save-help").click(function(e) {
    e.preventDefault();
    var title   = $('input[name="title"]').val(),
        content = $('textarea[name="content"]').val(),
        section = $("#section").val(),
        subsection = $("#subsection").val(),
        parentID = $("#parentID").val(),
        helpID = $("#helpID").val(),
        returnString = $("#return").val();

    $.ajax({
        type: 'POST',
        url: loris.BaseURL + '/help_editor/ajax/process.php',
        data: {
            title: title ? title : '',
            content: content ? content : '',
            section: section ? section : '',
            subsection: subsection ? subsection : '',
            parentID: parentID ? parentID : '',
            helpID: helpID ? helpID : '',
        },
        success: function() {
            swal.fire({
                title: "Content update successful!",
                type: "success",
                showCancelButton: true,
                confirmButtonText: returnString,
                cancelButtonText: "Close",
                closeOnConfirm: false,
                closeOnCancel: true,
            },
            function(){
                location.href = document.referrer;
            });
        },
        error: function(xhr, errorCode, errorMsg) {
            console.error(xhr);
            swal.fire({
                title: "Content update unsuccessful.",
                text: errorCode + ": " + xhr.status + " " + errorMsg,
                type: "error",
                confirmButtonText: "Try again",
                closeOnConfirm: true,
            });
        }
    });
});
});
