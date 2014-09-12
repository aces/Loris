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
    }, checkOverflow = function(wrapper, rightLink, leftLink, headCol) {
        var staticCol = headCol === undefined ? false : true;
        var element = wrapper;

        if( (element.offsetHeight < element.scrollHeight) || (element.offsetWidth < element.scrollWidth)) {
            // Your element has overflow
            if(staticCol) {
                if(headCol) {
                    $("." + headCol).addClass("colm-static");
                }
                $(wrapper).addClass("scrollableStat");
            } else {
                $(wrapper).addClass("scrollable");
            }
            $(leftLink).show();
            $(rightLink).show();

        } else {
            // Your element has no overflow
            if(staticCol){
                if(headCol) {
                    $("." + headCol).removeClass("colm-static");
                }
                $(wrapper).removeClass("scrollableStat");
            }
            else{
                $(wrapper).removeClass("scrollable");
            }
            $(leftLink).hide();
            $(rightLink).hide();
        }


    };
 
    $.fn.DynamicTable = function() {
        this.filter("table").each(function() {
            var leftLink, rightLink, table = this;
            // Add wrapper code necessary for bootstrap carousel
            $(this).wrap("<div class=\"carousel slide\" data-ride=\"carousel\"></div>");
            $(this).wrap("<div class=\"carousel-inner\"></div>");

            // Add wrapper necessary for dynamictable code
            $(this).wrap("<div class=\"dynamicContentWrapper table-scroll\" style=\"overflow-x: auto\"></div>");

            // Add links for carousel
            $(this).after('<a class="left carousel-control" href="#"><span class="glyphicon glyphicon-chevron-left"></span></a><a class="right carousel-control" href="#" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span></a>');

            // Get references to links to pass to Setup and checkOverflow
            leftLink = this.nextSibling;
            rightLink = leftLink.nextSibling;

            Setup( this.parentElement, rightLink, leftLink);
            checkOverflow( this.parentElement, rightLink, leftLink);

            window.addEventListener("resize", function() {
                checkOverflow( table.parentElement, rightLink, leftLink);
            });

            return this;
        })
        return this;
    }
}(jQuery ));
