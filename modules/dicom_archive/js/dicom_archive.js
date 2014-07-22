function toggleLayer(whichLayer) {
    "use strict";
    var style2;
    if (document.getElementById) {
    // this is the way the standards work
        style2 = document.getElementById(whichLayer).style;
        style2.display = style2.display === "block" ? "none" : "block";
    } else if (document.all) {
        // this is the way old msie versions work                                                                    
        style2 = document.all[whichLayer].style;
        style2.display = style2.display === "block" ? "none" : "block";
    } else if (document.layers) {
        // this is the way nn4 works                                                                                 
        style2 = document.layers[whichLayer].style;
        style2.display = style2.display === "block" ? "none" : "block";
    }
}
