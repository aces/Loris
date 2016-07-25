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
        pre     = document.createElement("pre"),
        btn     = document.createElement("BUTTON"),
        text    = document.createTextNode("Edit"),
        button  = document.createTextNode("Close");

     pre.innerHTML  = "<h3>" + title + "</h3>";
     pre.innerHTML += content;
     pre.innerHTML  =  pre.innerHTML + "<hr>Last updated: " + myDate.getFullYear() + "-" +
                      (myDate.getMonth() +1) + "-" + myDate.getDate() + " " +
                      myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
     btn.appendChild(button);
     btn.className="btn btn-default";
     btn.setAttribute("id","helpclose");
     div.appendChild(pre);
     div.appendChild(btn);
     document.getElementById('page').appendChild(div);
     div.setAttribute("class", "help-content");
     btn.addEventListener("click", function(e) {
        $(div).remove();
        e.preventDefault();
        }) ;
     e.preventDefault();

});
});
function goBack() {
    window.history.back();
}
