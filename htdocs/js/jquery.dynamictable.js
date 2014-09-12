(function ($ ) {
    var Setup = function(tableID, rightID, leftID) {
           $('#' + rightID).bind("click", function(event) {
            event.preventDefault();
            // Animates the scrollTop property by the specified
            // step.
            scrolling = false;
            $('#' + tableID).animate({
                scrollLeft: $('#' + tableID).scrollLeft() + step
            });
        }).bind("mouseover", function(event) {
            scrolling = true;
            scrollContent("right", tableID);
        }).bind("mouseout", function(event) {
            scrolling = false;
        });
        $('#' + leftID).bind("click", function(event) {
            event.preventDefault();
            // Animates the scrollTop property by the specified
            // step.
            scrolling = false;
            $('#' + tableID).animate({
                scrollLeft: $('#' + tableID).scrollLeft() - step
            });
        }).bind("mouseover", function(event) {
            scrolling = true;
            scrollContent("left", tableID);
        }).bind("mouseout", function(event) {
            scrolling = false;
        });
        var scrollContent = function (direction, elem) {
            var amount = (direction === "left" ? -3 : 3);
            $('#' + elem).animate({
                scrollLeft: $('#' + elem).scrollLeft() + amount
            }, 1, function() {
                if (scrolling) {
                    scrollContent(direction, elem);
                }
            });
        }
    };
 
    $.fn.DynamicTable = function(tableID, rightID, leftID) {
        this.filter("table").each(function() {
            var table = Setup( tableID, rightID, leftID );
        })
        return this;
    }
}(jQuery ));
