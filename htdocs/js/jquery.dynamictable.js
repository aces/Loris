/* global window, jQuery*/

/**
 * This is a wrapper for a scrollable table that dynamically
 * changes depending on weather or not the table has overflow
 * or not. The table can be setup to freeze a column once the
 * column comes to the left of the screen. The column will
 * unfreeze once the column to its right is fully visiable.
 *
 * To setup the table without freezing a column simply call
 * the function DynamicTable on the table you want to apply
 * the scrolling using the standard jquery function calling.
 * For this the fuction does not take in any parameters.
 *
 * To setup the table with the freezing column, call in a
 * similar manner to the way without the freezing column.
 * The only diffrence being you pass an object of the structure
 *
 * { "freezeColumn" : "columnID" }
 *
 * columnID: The id of the table id in the first row  at the desired
 *           column
 *
 * ie. $("#cand").DynamicTable({ "freezeColumn" : "pscid" });
 *
 * Authors: Jordan Stirling <jstirling91@gmail.com>
 *          Dave MacFarlane
 */

(function($) {
  "use strict";
  var setupScrolling = function(wrapper, rightLink, leftLink) {
    var scrolling = false;
    var step = 100;
    var scrollAmount = 0;
    var scrollContent = function(direction, elem) {
      $(elem).animate({
        scrollLeft: $(elem).scrollLeft() + scrollAmount
      }, 1, function() {
        if (scrolling) {
          scrollContent(direction, elem);
        }
      });
    };
    $(rightLink).bind("click", function(event) {
      event.preventDefault();
      // Animates the scrollTop property by the specified
      // step.
      scrolling = false;
      $(wrapper).animate({
        scrollLeft: $(wrapper).scrollLeft() + step
      });
    }).bind("mousemove", function(event) {
      event.preventDefault();
      scrollAmount = (event.clientX - $(this).offset().left) / 5;
      if (!scrolling) {
        scrolling = true;
        scrollContent("right", wrapper);
      }
    }).bind("mouseout", function(event) {
      event.preventDefault();
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
    }).bind("mousemove", function(event) {
      event.preventDefault();
      scrollAmount = (-1 * ($(this).offset().left + $(this).outerWidth()) +
        event.clientX) / 5;
      if (!scrolling) {
        scrolling = true;
        scrollContent("left", wrapper);
      }
    }).bind("mouseout", function(event) {
      event.preventDefault();
      scrolling = false;
    });
  };
  var checkOverflow = function(wrapper, rightLink, leftLink, headCol) {
    var staticCol = (headCol !== undefined);
    var element = wrapper;

    if ((element.offsetHeight < element.scrollHeight) ||
        (element.offsetWidth < element.scrollWidth)) {
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
  };
  var wrapTable = function(table) {
    $(table).wrap("<div class=\"row\"></div>");
    // Add wrapper code necessary for bootstrap carousel
    $(table).wrap("<div class=\"carousel slide col-xs-12\"></div>");

    // Add wrapper necessary for dynamictable code
    $(table).wrap("<div class=\"dynamicContentWrapper table-scroll\" " +
      "style=\"overflow-x: auto\"></div>");

    // Add links for carousel
    $(table).after(
      '<a class="left leftScrollBar carousel-control" href="#">' +
      '<span class="glyphicon glyphicon-chevron-left"></span>' +
      '</a><a class="right carousel-control" href="#" data-slide="next">' +
      '<span class="glyphicon glyphicon-chevron-right"></span></a>'
    );
  };
  var unwrapTable = function(table) {
    // Delete links for carousel
    $(table).nextAll().remove();
    // Remove wrapper necessary for dynamictable code
    $(table).unwrap();
    // Remove wrapper code necessary for bootstrap carousel
    $(table).unwrap();
    // Remove row wrapper
    $(table).unwrap();
  };
  var freezeColm = function(tableID, colmStatic) {
    var statColPos = $("." + tableID + "FrozenColumn").offset().left;
    var statColWid = $("." + tableID + "FrozenColumn").outerWidth();
    var leftScrollPos = $(".leftScrollBar").offset().left;
    var leftScrollWid = $(".leftScrollBar").outerWidth();
    var nextColPos = $("." + tableID + "Next").offset().left;
    var tablePos = $("#" + tableID).offset().left;

    if (colmStatic === true) {
      if (nextColPos >= statColPos + statColWid || statColPos <= tablePos) {
        $("." + tableID).each(function(key, value) {
          if (key >= 0) {
            $(value).css("height", "");
          }
        });
        $("." + tableID + "FrozenColumn").removeClass("static-col colm-static");
        return false;
      }
    } else if (statColPos <= leftScrollWid + leftScrollPos) {
      $("." + tableID + "FrozenColumn").each(function(key, value) {
        if (key >= 0) {
          var height = $(value).next().outerHeight();
          $(value).outerHeight(height);
        }
      });
      $("." + tableID + "FrozenColumn").addClass("static-col colm-static");
      return true;
    }
    return colmStatic;
  };

  $.fn.DynamicTable = function(options) {
    this.filter("table").each(function() {
      var leftLink;
      var rightLink;
      var table = this;
      var id = $(table).attr('id');
      var colmStatic = false;
      var column;
      var columnNumber;
      var child1;

      // check if table is already scollable, if so delete scroll components
      if ($(this).parent(".dynamicContentWrapper").length === 1) {
        unwrapTable(this);
      }
      // set up table for scrollable side bars
      wrapTable(this);
      // Get references to links to pass to Setup and checkOverflow
      leftLink = this.nextSibling;
      rightLink = leftLink.nextSibling;

      setupScrolling(this.parentElement, rightLink, leftLink);
      checkOverflow(this.parentElement, rightLink, leftLink);

      window.addEventListener("resize", function() {
        checkOverflow(table.parentElement, rightLink, leftLink);
      });

      if (options && options.freezeColumn) {
        column = $("#" + options.freezeColumn);
        columnNumber = $(column).parent().children().index($(column));
        $(this).find("tr").each(function(key, value) {
          if (key === 0) {
            var child2 = $(value).children().get(columnNumber + 1);
            $(child2).addClass(id + 'Next');
          }
          child1 = $(value).children().get(columnNumber);
          // height = $(child1).next().outerHeight();
          $(child1).addClass(id + "FrozenColumn");
        });
        $(this).parent().scroll(function() {
          colmStatic = freezeColm(id, colmStatic);
        });
      }

      return this;
    });
    return this;
  };
})(jQuery);
