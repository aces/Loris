function notAnswered() {
  "use strict";
  var name = $(this).attr('name');
  var index = this.selectedIndex;
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
  } else if (index === 0) {
    $('[name=' + name + ']').prop('disabled', false);
    $(this).parent().removeClass('has-warning');
    $("#" + name).remove();
  } else {
    $('[name=' + name + ']').prop('disabled', true);
    $(this).parent().addClass('has-warning');
    $(this).after("<div class=\"col-xs-12 warning\" id=\"" + name + "\">Any entered data will not be saved</div>");
  }
}

/**
 * Appends a hidden empty value, if a multiselect dropdown has nothing selected
 * Required to trigger validation on the backend
 * @param {JQuery} form <form> element
 * @param {JQuery} element <select> element
 */
function addEmptyOption(form, element) {
  var selectedOptions = element.find(':selected');
  var name = element[0].name;

  if (selectedOptions.length === 0) {
    form.append("<input type='hidden' name=" + name + " value='' />");
  } else {
    $("[type='hidden' name='" + name + "']").remove();
  }
}

$(document).ready(function() {
  "use strict";
  $(".element").children().addClass("form-control input-sm");
  $(".button").removeClass("form-control");
  var naList = document.getElementsByClassName('not-answered');
  var i;
  var name;
  var index;
  for (i = 0; i < naList.length; i++) {
    name = $(naList[i]).attr('name');
    name = name.replace('_status', '');
    index = naList[i].selectedIndex;
    if (name.indexOf('_date') > -1) {
      if (index !== 0) {
        $('.' + name).prop('disabled', true);
      }
    } else if (index !== 0) {
      $('[name=' + name + ']').prop('disabled', true);
    }
    naList[i].onchange = notAnswered;
  }
  var msg = '';
  var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  if (isMac) {
    msg = "Hold CMD ⌘ to select multiple options";
  } else {
    msg = "Hold CTRL to select multiple options";
  }
  $("select[multiple]").attr("title", msg);
  $("select[multiple]").tooltip();

  var form = $('form');
  var multiselect = $('form select[multiple]');

  form.on('submit', function() {
    multiselect.each(function() {
      addEmptyOption(form, $(this));
    });
  });
});
