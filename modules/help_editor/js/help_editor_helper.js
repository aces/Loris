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
        wrap    = document.createElement("pre");

     wrap.setAttribute("id", "help-wrapper");
     wrap.innerHTML  = "<h3>" + title + "</h3>";
     markdownContent = document.createElement("div");
     ReactDOM.render(RMarkdown({content: content}), markdownContent);
     wrap.appendChild(markdownContent);
     wrap.innerHTML  =  wrap.innerHTML + "<hr>Last updated: " + myDate.getFullYear() + "-" +
                      (myDate.getMonth() +1) + "-" + myDate.getDate() + " " +
                      myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
     btn.appendChild(button);
     btn.className="btn btn-default";
     btn.setAttribute("id","helpclose");
     div.appendChild(wrap);
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
