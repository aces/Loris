import swal from 'sweetalert2';

$(function() {
  'use strict';

  $('div').tooltip();

  let count = 0;
  $('.add').on('click', function(e) {
    e.preventDefault();

    count = count + 1;

    // Field that will be copied
    let currentField = $(this).parent().find('.entry:first-child');

    let id = $(currentField).parent().attr('id');
    let name = 'add-' + id + '-' + count;

    // Setup the new form field
    let newField = currentField.clone();
    assignFormControlNames(newField, name);
    $(newField).find('.btn-remove')
      .addClass('remove-new')
      .removeClass('btn-remove');
    resetForm(newField);

    newField.appendTo($(this).parent().children(':first'));
  });

  $('body').on('click', '.remove-new', function() {
    if ($(this).parent().parent().parent().children().length > 1) {
      $(this).parent().parent().remove();
    } else {
      resetForm($(this).parent().parent());
    }
  });

  $('.btn-remove').on('click', function(e) {
    e.preventDefault();

    let selectedOption = $(this).parent().parent().find('.form-control:first')
      .prop('value');

    let fieldName = $(this)
      .parent().parent().parent().parent().parent().children()
      .attr('data-original-title');

    swal.fire({
      text: 'Please confirm you want to delete the option "' +
                selectedOption
                + '" of the field "' + fieldName + '".',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.value) {
        let id = $(this).attr('name');
        let button = this;

        $.ajax({
          type: 'post',
          url: loris.BaseURL + '/configuration/ajax/process.php',
          data: {remove: id},
          success: function() {
            if ($(button)
              .parent().parent().parent().children()
              .length > 1
            ) {
              $(button).parent().parent().remove();
            } else {
              let parentID = $(button)
                .parent().parent().parent()
                .attr('id');
              let name = 'add-' + parentID;

              resetForm($(button).parent().parent());
              assignFormControlNames($(button).parent().parent(), name);
              $(button)
                .addClass('remove-new')
                .removeClass('btn-remove');
            }
          },
          error: function(xhr, desc, err) {
            console.error(xhr);
            console.error('Details: ' + desc + '\nError:' + err);
          },
        });
      }
    });
  });

  // On form submit, process the changes through an AJAX call
  $('body').on('submit', 'form', function(e) {
    e.preventDefault();

    // Clear previous feedback
    $('.submit-area > label').remove();

    if (hasIncompleteMappingFields()) {
      $('<label>Mapping rows need both a value and mapped value.</label>')
        .hide()
        .appendTo('.submit-area')
        .fadeIn(500).delay(1000);
      return;
    }

    let form = $(this).serialize();

    $.ajax({
      type: 'post',
      url: loris.BaseURL + '/configuration/ajax/process.php',
      data: form,
      success: function() {
        let html = '<label>Submitted</label>';
        $(html)
          .hide()
          .appendTo('.submit-area')
          .fadeIn(500).delay(1000).fadeOut(500);
        location.reload();
      },
      error: function(xhr, desc, err) {
        let html = '<label>' + xhr.responseText + '</label>';
        $(html).hide().appendTo('.submit-area').fadeIn(500).delay(1000);
      },
    });
  });

  // On form reset, to delete the elements added with the "Add field" button that were not submitted.
  $('body').on('reset', 'form', function(e) {
    $('.tab-pane.active').find('select[name^="add-"]').parent().remove();
  });
});

/*
function validate(form) {
    // age
    // year
    // email - this should be done already
    // not same instrument twice
}
*/

/**
 * Reset form
 *
 * @param {Element} form A DOM form element
 */
function resetForm(form) {
  'use strict';

  $(form).find(
    'input:text, input:password, input:file, select, textarea'
  ).val('');
  $(form).find('input:radio, input:checkbox')
    .removeAttr('checked').removeAttr('selected');
}

/**
 * Assign posted field names to simple and mapping configuration controls.
 *
 * @param {Element} field A configuration entry element
 * @param {string} name The base POST field name
 */
function assignFormControlNames(field, name) {
  'use strict';

  $(field).find('.form-control').attr('name', name);
  $(field).find('.configuration-mapping-mapped-value')
    .attr('name', 'mapping-' + name);
}

/**
 * Check whether any mapping row has only one side of the pair filled.
 *
 * @returns {boolean} True when an incomplete mapping row exists
 */
function hasIncompleteMappingFields() {
  'use strict';

  let incomplete = false;
  $('.configuration-mapping-fields').each(function() {
    let value = $.trim($(this).find('.configuration-mapping-value').val());
    let mappedValue = $.trim(
      $(this).find('.configuration-mapping-mapped-value').val()
    );

    if ((value === '') !== (mappedValue === '')) {
      incomplete = true;
      return false;
    }
  });

  return incomplete;
}
