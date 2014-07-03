/*global document: false, $: false, window: false, unescape: false, Option: false,isElementsSet*/

function notAnswered() {
    "use strict";
    var name = $(this).attr('name'), index = this.selectedIndex;
    name = name.replace('_status', '');
    if (name.indexOf('_date') > -1) {
        if (index === 0) {
            $('.' + name).prop('disabled', false);
            $(this).parent().removeClass('has-warning');
            $("#" + name).remove();
        } else {
            $('.' + name).prop('disabled', true);
            $(this).parent().addClass('has-warning');
            $(this).after("<div class=\"col-xs-12 warning\" id=\"" + name + "\">Any entered data will not be saved</div>");
        }
    } else {
        if (index === 0) {
            $('[name=' + name + ']').prop('disabled', false);
            $(this).parent().removeClass('has-warning');
            $("#" + name).remove();
        } else {
            $('[name=' + name + ']').prop('disabled', true);
            $(this).parent().addClass('has-warning');
            $(this).after("<div class=\"col-xs-12 warning\" id=\"" + name + "\">Any entered data will not be saved</div>");
        }
    }
}
$(document).ready(function () {
    "use strict";
    $(".element").children().addClass("form-control input-sm");
    $(".button").removeClass("form-control");
    var naList = document.getElementsByClassName('not-answered'), i, name, index;
    for (i = 0; i < naList.length; i++) {
        name = $(naList[i]).attr('name');
        name = name.replace('_status', '');
        index = naList[i].selectedIndex;
        if (name.indexOf('_date') > -1) {
            if (index === 0) {
                $('.' + name).prop('disabled', false);
            } else {
                $('.' + name).prop('disabled', true);
            }
        } else {
            if (index === 0) {
                $('[name=' + name + ']').prop('disabled', false);
            } else {
                $('[name=' + name + ']').prop('disabled', true);
            }
        }
        naList[i].onchange = notAnswered;
    }
});