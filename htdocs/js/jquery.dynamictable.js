(function ($ ) {
    var Setup = function(wrapper, rightLink, leftLink) {
        $(rightLink).bind("click", function(event) {
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
        $(leftLink).bind("click", function(event) {
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
 
    $.fn.DynamicTable = function() {
        this.filter("table").each(function() {
            var leftLink, rightLink;
            // Add wrapper code necessary for bootstrap carousel
            $(this).wrap("<div class=\"carousel slide\" data-ride=\"carousel\"></div>");
            $(this).wrap("<div class=\"carousel-inner\"></div>");

            // Add wrapper necessary for dynamictable code
            $(this).wrap("<div class=\"dynamicContentWrapper table-scroll\" style=\"overflow-x: auto\"></div>");

            // Add links for carousel
            $(this).after('<a class="left carousel-control" href="#"><span class="glyphicon glyphicon-chevron-left"></span></a><a class="right carousel-control" href="#" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span></a>');

            // Get references to links to pass to Setup and checkOverflow
            leftLink = this.nextSibling;
            rightLink = left.nextSibling;

            Setup( this.parentElement, rightLink, leftLink);


            return this;
        })
        return this;
    }
}(jQuery ));
