/**
 * This is a wrapper for a scrollable table that dynamically
 * changes depending on weather or not the table has overflow
 * or not. 
 *
 * To setup the table use the function setup passing it the 
 * ID of the table and the left and right scroll buttons
 *
 * Use the checkOverflow function to dynamically change the
 * table wheather or not it has overflow
 *
 * Author: Jordan Stirling <jstirling91@gmail.com>
 */
var step = 100;
var scrolling = false;
var Table = {
	setup: function (tableID, rightID, leftID){
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
	},
	checkOverflow: function (tableID, rightID, leftID, headCol) {
		var staticCol = headCol === undefined ? false : true;
	    var element = document.querySelector('#' + tableID);
	    if( element && ((element.offsetHeight < element.scrollHeight) || (element.offsetWidth < element.scrollWidth))){
	        // your element have overflow
	        if(staticCol){
	        	$("." + headCol).addClass("colm-static");
	        	$('#' + tableID).addClass("scrollableStat");
	        }
	        else{
	        	$('#' + tableID).addClass("scrollable");
	        }
	        $('#' + leftID).show();
	        $('#' + rightID).show();
	    }
	    else{
	        //your element don't have overflow
	        if(staticCol){
	        	$("." + headCol).removeClass("colm-static");
	        	$('#' + tableID).removeClass("scrollableStat");
	        }
	        else{
	        	$('#' + tableID).removeClass("scrollable");
	        }
	        $('#' + leftID).hide();
	        $('#' + rightID).hide();
	    }
	}
}