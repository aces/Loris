/*global document: false, $: false, window: false*/
function change() {
    "use strict";
    $('#hide').show();
    $('#show').hide();
    $('#mri-protocol').show();
    $('#show').bind('click', function () {
        $('#mri-protocol').show('slow', function () {});
        $('#hide').show();
        $('#show').hide();
    });

    //To hide : table hides...and the show shows...
    $('#hide').bind('click', function () {
        $('#mri-protocol').hide('slow', function () {});
        $('#show').show();
        $('#hide').hide();
    });
}

function save() {
    "use strict";
    var default_value, id, value;
    /**To get the default value**/
    $('.description').focus(function (event) {
        id = event.target.id;
        default_value = $("#" + id).text();
    });

    $('.description').keypress(
      function(event) {
        if (event.which === 13 || event.keyCode === 13) {
          event.preventDefault();
          var id = '#' + event.target.id;
          $(id).blur();
        }
      }
    );

    $('.description').blur(
      function(event) {
          event.stopImmediatePropagation();
          id = event.target.id;
          value = $('#'+id).text();
          if (value !== default_value) {
            $('.description').attr('contenteditable', false);
            var userIsSure = confirm('Are you sure you want to edit this field?');
            if (userIsSure) {
              $.post(
                loris.BaseURL + '/mri_violations/ajax/UpdateMRIProtocol.php',
                {
                  field_id: id,
                  field_value: value
                }
              );
            } else {
              $('#' + id).text(default_value);
            }
            $('.description').attr('contenteditable', true);
          }
      }
    );
}

$(function () {
    "use strict";
    change();
    save();
});
