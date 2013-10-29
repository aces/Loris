function toggleMe(a, b){
var rows=document.getElementsByName(a);
var selector=document.getElementById(b);
if (selector.style.display=="none") {
    selector.style.display="table-cell"
}
else {
    selector.style.display="none"
}

for(i=0;i<rows.length;i++)
{
    if(!rows[i])return true;
    if(rows[i].style.display=="none"){
        rows[i].style.display="table-row"
    }
   /* else if(rows[i].style.display=="table-cell") {
        rows[i].style.display="none";
    }*/
    else{
        rows[i].style.display="none"
    }
}
}
