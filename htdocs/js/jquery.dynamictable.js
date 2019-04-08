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
  'use strict';
  const setupScrolling = function(wrapper, rightLink, leftLink) {
    let scrolling = false;
    const step = 100;
    let scrollAmount = 0;
    const scrollContent = function(direction, elem) {
      $(elem).animate({
        scrollLeft: $(elem).scrollLeft() + scrollAmount,
      }, 1, function() {
        if (scrolling) {
          scrollContent(direction, elem);
        }
      });
    };
    $(rightLink).bind('click', function(event) {
      event.preventDefault();
      // Animates the scrollTop property by the specified
      // step.
      scrolling = false;
      $(wrapper).animate({
        scrollLeft: $(wrapper).scrollLeft() + step,
      });
    }).bind('mousemove', function(event) {
      event.preventDefault();
      scrollAmount = (event.clientX - $(this).offset().left) / 5;
      if (!scrolling) {
        scrolling = true;
        scrollContent('right', wrapper);
      }
    }).bind('mouseout', function(event) {
      event.preventDefault();
      scrolling = false;
    });
    $(leftLink).bind('click', function(event) {
      event.preventDefault();
      // Animates the scrollTop property by the specified
      // step.
      scrolling = false;
      $(wrapper).animate({
        scrollLeft: $(wrapper).scrollLeft() - step,
      });
    }).bind('mousemove', function(event) {
      event.preventDefault();
      scrollAmount = (-1 * ($(this).offset().left + $(this).outerWidth()) +
        event.clientX) / 5;
      if (!scrolling) {
        scrolling = true;
        scrollContent('left', wrapper);
      }
    }).bind('mouseout', function(event) {
      event.preventDefault();
      scrolling = false;
    });
  };
  const checkOverflow = function(wrapper, rightLink, leftLink, headCol) {
    const staticCol = (headCol !== undefined);
    const element = wrapper;
    const headers = wrapper.children[3];

    if ((element.offsetHeight < element.scrollHeight) ||
        (element.offsetWidth < element.scrollWidth)) {
      // Your element has overflow

      $(wrapper).on('scroll', function() {
        const leftScroll = $(wrapper).scrollLeft();
        $(headers).scrollLeft(leftScroll);
      });
      if (staticCol) {
        if (headCol) {
          $('.' + headCol).addClass('colm-static');
        }
        $(wrapper).addClass('scrollableStat');
      } else {
        $(wrapper).addClass('scrollable');
      }
      $(leftLink).show();
      $(rightLink).show();
    } else {
      // Your element has no overflow
      $(wrapper).off('scroll');
      if (staticCol) {
        if (headCol) {
          $('.' + headCol).removeClass('colm-static');
        }
        $(wrapper).removeClass('scrollableStat');
      } else {
        $(wrapper).removeClass('scrollable');
      }
      $(leftLink).hide();
      $(rightLink).hide();
    }
  };
  const headerAlign = function(table, headers) {
    const tableHeaders = $(table).find('thead').children().children();
    const fixedHeaders = $(headers).find('thead').children().children();

    for (let i = 0; i < tableHeaders.length; i++) {
      if (!$(fixedHeaders[i]).hasClass('static-col')) {
        let temp = $(tableHeaders[i]).width();
        $(fixedHeaders[i]).width(temp);
        temp = $(tableHeaders[i]).css('width');
        $(fixedHeaders[i]).css({'min-width': temp});
      }
    }

    $(headers).width($(table).parent().width());
  };
  const wrapTable = function(table) {
    $(table).wrap('<div class="row"></div>');
    // Add wrapper code necessary for bootstrap carousel
    $(table).wrap('<div class="carousel slide col-xs-12"></div>');

    // Add wrapper necessary for dynamictable code
    $(table).wrap('<div class="dynamicContentWrapper table-scroll" ' +
      'style="overflow-x: auto"></div>');

    const headers = document.createElement('div');
    $(headers).addClass('frozenHeader');
    $(headers).html('<table style="margin-bottom: 0px"><thead>' +
        $(table).find('thead').html() +
        '</thead><table>'
    );
    $($(headers).children()[0]).addClass($(table).attr('class'));
    $($(headers).children()[0]).removeClass('dynamictable');
    $(table).after($(headers));
    $(headers).hide();
    headerAlign(table, headers);

    // Add links for carousel
    $(table).after(
        '<a class="left leftScrollBar carousel-control" href="#">' +
      '<span class="glyphicon glyphicon-chevron-left"></span>' +
      '</a><a class="right carousel-control" href="#" data-slide="next">' +
      '<span class="glyphicon glyphicon-chevron-right"></span></a>'
    );
  };
  const unwrapTable = function(table) {
    // Delete links for carousel
    $(table).nextAll().remove();
    // Remove wrapper necessary for dynamictable code
    $(table).unwrap();
    // Remove wrapper code necessary for bootstrap carousel
    $(table).unwrap();
    // Remove row wrapper
    $(table).unwrap();
  };
  const addFrozenHeaderColm = function(frozenHeader) {
    const frozenCell = document.createElement('div');
    const headerCell = $(frozenHeader).find('.static-col');
    $(frozenCell).addClass('static-col colm-static headerColm');
    $(frozenCell).html($(headerCell).html());
    // add 18px since height is beting set with padding included
    $(frozenCell).height($($(frozenHeader).find('th')[0]).height() + 18);
    const temp = $(frozenCell).css('height');
    $(headerCell).css({padding: '0px'});
    const top = $(frozenHeader).css('top');
    $(frozenCell).css({'min-height': temp, 'top': top});
    $(frozenCell).html($($('.dynamictableFrozenColumn')[0]).html());
    $(frozenHeader).after(frozenCell);
  };
  const freezeColm = function(tableID, colmStatic) {
    const statColPos = $('.' + tableID + 'FrozenColumn').offset().left;
    const statColWid = $('.' + tableID + 'FrozenColumn').outerWidth();
    const leftScrollPos = $('.leftScrollBar').offset().left;
    const leftScrollWid = $('.leftScrollBar').outerWidth();
    const nextColPos = $('.' + tableID + 'Next').offset().left;
    const tablePos = $('#' + tableID).offset().left;
    const header = $('#' + tableID).siblings('.frozenHeader')[0];

    if (colmStatic === true) {
      if (nextColPos >= statColPos + statColWid || statColPos <= tablePos) {
        $('.' + tableID).each(function(key, value) {
          if (key >= 0) {
            $(value).css('height', '');
          }
        });
        $('.' + tableID + 'FrozenColumn').removeClass('static-col colm-static');
        $(header).find('.dynamictableFrozenColumn').css({padding: '8px'});
        $('.headerColm').remove();
        return false;
      }
    } else if (statColPos <= leftScrollWid + leftScrollPos) {
      $('.' + tableID + 'FrozenColumn').each(function(key, value) {
        if (key >= 0) {
          const height = $(value).next().outerHeight();
          $(value).outerHeight(height);
        }
      });
      $('.' + tableID + 'FrozenColumn').addClass('static-col colm-static');
      if ($(header).parent().find('.headerColm').length === 0 &&
        $(header).parent().find('.frozenHeader').is(':visible')
      ) {
        addFrozenHeaderColm(header);
      }
      return true;
    }
    return colmStatic;
  };

  $.fn.DynamicTable = function(options) {
    if (options && options.removeDynamicTable) {
      unwrapTable(this);
      return this;
    }
    this.filter('table').each(function() {
      const table = this;
      const id = $(table).attr('id');
      let colmStatic = false;
      let column;
      let columnNumber;
      let child1;

      // check if table is already scollable, if so delete scroll components
      if ($(this).parent('.dynamicContentWrapper').length === 1) {
        unwrapTable(this);
      }
      // set up table for scrollable side bars
      wrapTable(this);
      // Get references to links to pass to Setup and checkOverflow
      const leftLink = this.nextSibling;
      const rightLink = leftLink.nextSibling;

      setupScrolling(this.parentElement, rightLink, leftLink);
      checkOverflow(this.parentElement, rightLink, leftLink);

      window.addEventListener('resize', function() {
        const headers = $($(table).parent().find('table')[1]).parent();
        checkOverflow(table.parentElement, rightLink, leftLink);
        headerAlign(table, headers);
      });

      window.addEventListener('scroll', function() {
        const thead = $(table).find('thead');
        const eTop = $(thead).offset().top - $(window).scrollTop(); // gets the position from the top
        const headers = $($(table).parent().find('table')[1]).parent();
        const height = $(table).height() - $(headers).height();
        if (eTop <= 50 && height + eTop >= 50) {
          // near LORIS header
          let top = 0;
          if (eTop < 0) {
            top = Math.abs(eTop) + 50;
          } else {
            top = 50 - eTop;
          }
          $(headers).css({top: top});
          $('.headerColm').css({top: top});
          $(headers).show();
          headerAlign(table, headers);
          if ($(table).find('.static-col').length !== 0 &&
            $(table).parent().find('.headerColm').length === 0
          ) {
            addFrozenHeaderColm(headers);
          }
        } else {
          $(headers).hide();
          $(headers).find('.dynamictableFrozenColumn').css({padding: '8px'});
          $('.headerColm').remove();
        }
      });

      if (options && options.freezeColumn) {
        column = $('#' + options.freezeColumn);
        columnNumber = $(column).parent().children().index($(column));
        $(this).find('tr').each(function(key, value) {
          if (key === 0) {
            const child2 = $(value).children().get(columnNumber + 1);
            $(child2).addClass(id + 'Next');
          }
          child1 = $(value).children().get(columnNumber);
          // height = $(child1).next().outerHeight();
          $(child1).addClass(id + 'FrozenColumn');
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
