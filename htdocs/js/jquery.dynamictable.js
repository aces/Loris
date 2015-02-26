/*global window, jQuery*/
(function ($) {
    "use strict";
    var setupScrolling = function (wrapper, rightLink, leftLink) {
        var scrolling = false, scrollContent = function (direction, elem) {
            var amount = (direction === "left" ? -3 : 3);
            $(elem).animate({
                scrollLeft: $(elem).scrollLeft() + amount
            }, 1, function () {
                if (scrolling) {
                    scrollContent(direction, elem);
                }
            });
        };
        $(rightLink).bind("click", function (event) {
            event.preventDefault();
            // Animates the scrollTop property by the specified
            // step.
            scrolling = false;
            $(wrapper).animate({
                scrollLeft: $(wrapper).scrollLeft()
            });
        }).bind("mouseover", function (event) {
            scrolling = true;
            scrollContent("right", wrapper);
        }).bind("mouseout", function (event) {
            scrolling = false;
        });
        $(leftLink).bind("click", function (event) {
            event.preventDefault();
            // Animates the scrollTop property by the specified
            // step.
            scrolling = false;
            $(wrapper).animate({
                scrollLeft: $(wrapper).scrollLeft()
            });
        }).bind("mouseover", function (event) {
            scrolling = true;
            scrollContent("left", wrapper);
        }).bind("mouseout", function (event) {
            scrolling = false;
        });
    }, checkOverflow = function (wrapper, rightLink, leftLink, headCol) {
        var staticCol = headCol === undefined ? false : true,
            element = wrapper;

        if ((element.offsetHeight < element.scrollHeight) || (element.offsetWidth < element.scrollWidth)) {
            // Your element has overflow
            if (staticCol) {
                if (headCol) {
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
            if (staticCol) {
                if (headCol) {
                    $("." + headCol).removeClass("colm-static");
                }
                $(wrapper).removeClass("scrollableStat");
            } else {
                $(wrapper).removeClass("scrollable");
            }
            $(leftLink).hide();
            $(rightLink).hide();
        }


    }, wrapTable = function (table) {
        $(table).wrap("<div class=\"row\"></div>");

        // Add wrapper code necessary for bootstrap carousel
        $(table).wrap("<div class=\"carousel slide col-xs-12\"></div>");

        // Add wrapper necessary for dynamictable code
        $(table).wrap("<div class=\"dynamicContentWrapper table-scroll\" style=\"overflow-x: auto\"></div>");

        // Add links for carousel
        $(table).after('<a class="left carousel-control" href="#"><span class="glyphicon glyphicon-chevron-left"></span></a><a class="right carousel-control" href="#" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span></a>');
    }, freezeColm = function (tableID, colm_static){
        var statColPos = $("." + tableID).offset().left,
            statColWid = $("." + tableID).outerWidth(),
            leftScrollPos = $(".left").offset().left,
            leftScrollWid = $(".left").outerWidth(),
            nextColPos = $("." + tableID + "Next").offset().left;

        if(colm_static === true){
            if(nextColPos >= statColPos + statColWid){
                $("." + tableID).each(function(key, value){
                    $(value).css("height", "");
                });
                $("." + tableID).removeClass("static-col colm-static");
                return false;
            }
        } else if(statColPos <= leftScrollWid + leftScrollPos){
            $("." + tableID).each(function(key, value){
                var height = $(value).next().outerHeight();
                $(value).outerHeight(height);
            });
            $("." + tableID).addClass("static-col colm-static");
            return true;
        }
        return colm_static;
    };

    $.fn.DynamicTable = function (options) {
        if(options && options.freezeColumn){
            var column = $("#" + options.freezeColumn)
            var indexOf = $(column).parent().children().index($(column));
            
        } else {
            console.log("there");
        }
        // colmNumber = colmNumber || -1;
        this.filter("table").each(function () {
            var leftLink,
                rightLink,
                table = this;
            // set up table for scrollable side bars
            wrapTable(this);
            // Get references to links to pass to Setup and checkOverflow
            leftLink = this.nextSibling;
            rightLink = leftLink.nextSibling;

            setupScrolling(this.parentElement, rightLink, leftLink);
            checkOverflow(this.parentElement, rightLink, leftLink);

            window.addEventListener("resize", function () {
                checkOverflow(table.parentElement, rightLink, leftLink);
            });

            if(options && options.freezeColumn) {
                var id = $(this).attr('id'),
                    colm_static = false,
                    column = $("#" + options.freezeColumn),
                    columnNumber = $(column).parent().children().index($(column));
                $(this).find("tr").each(function (key, value) {
                    if(key == 0){
                        var child2 = $(value).children().get(columnNumber + 1);
                        $(child2).attr('class', id + 'Next');
                    }
                    var child1 = $(value).children().get(columnNumber),
                        height = $(child1).next().outerHeight();
                    $(child1).attr('class', id);
                });
                $(this).parent().scroll(function(){
                    colm_static = freezeColm(id, colm_static);
                });
            }

            return this;
        });
        return this;
    };
}(jQuery));
