(function ($ ) {
    var Setup = function(wrapper, rightID, leftID) {
           $('#' + rightID).bind("click", function(event) {
            event.preventDefault();
            // Animates the scrollTop property by the specified
            // step.
            scrolling = false;
            $(wrapper).animate({
                scrollLeft: $(wrapper).scrollLeft() + step
            });
        }).bind("mouseover", function(event) {
            scrolling = true;
            scrollContent("right", wrapper);
        }).bind("mouseout", function(event) {
            scrolling = false;
        });
        $('#' + leftID).bind("click", function(event) {
            event.preventDefault();
            // Animates the scrollTop property by the specified
            // step.
            scrolling = false;
            $(wrapper).animate({
                scrollLeft: $(wrapper).scrollLeft() - step
            });
        }).bind("mouseover", function(event) {
            scrolling = true;
            scrollContent("left", wrapper);
        }).bind("mouseout", function(event) {
            scrolling = false;
        });
        var scrollContent = function (direction, elem) {
            var amount = (direction === "left" ? -3 : 3);
            $(elem).animate({
                scrollLeft: $(elem).scrollLeft() + amount
            }, 1, function() {
                if (scrolling) {
                    scrollContent(direction, elem);
                }
            });
        }
    };
 
    $.fn.DynamicTable = function(rightID, leftID) {
        this.filter("table").each(function() {
            $(this).wrap("<div class=\"carousel slide\" data-ride=\"carousel\"></div>");
            $(this).wrap("<div class=\"carousel-inner\"></div>");
            $(this).wrap("<div class=\"dynamicContentWrapper\" style=\"overflow-x: auto\"></div>");
            $(this).after('<a class="left carousel-control" id="scrollLeft" href="#carousel-example-generic"><span class="glyphicon glyphicon-chevron-left"></span></a><a class="right carousel-control" id="scrollRight" href="#carousel-example-generic" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span></a>');
            //console.log(link);
            var table = Setup( this.parentElement, rightID, leftID );
        })
        return this;
    }
}(jQuery ));
