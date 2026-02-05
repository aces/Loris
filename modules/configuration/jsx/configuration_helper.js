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
    newField.find('.form-control').attr('name', name);
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

    let selectedOption = $(this).parent().parent().children()
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

        fetch(loris.BaseURL + '/configuration/ajax/process.php', {
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          body: new URLSearchParams({remove: id}),
          credentials: 'same-origin',
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('request_failed');
            }
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
              $(button)
                .parent().parent().children('.form-control')
                .attr('name', name);
              $(button)
                .addClass('remove-new')
                .removeClass('btn-remove');
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  });

  // On form submit, process the changes through an AJAX call
  $('form').on('submit', function(e) {
    e.preventDefault();

    let form = $(this).serialize();

    // Clear previous feedback
    $('.submit-area > label').remove();

    fetch(loris.BaseURL + '/configuration/ajax/process.php', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: form,
      credentials: 'same-origin',
    })
      .then(async (response) => {
        if (!response.ok) {
          let text = await response.text();
          let error = new Error('request_failed');
          error.lorisMessage = text;
          throw error;
        }
        let html = '<label>Submitted</label>';
        $(html)
          .hide()
          .appendTo('.submit-area')
          .fadeIn(500).delay(1000).fadeOut(500);
        location.reload();
      })
      .catch((error) => {
        let html = '<label>' + (error.lorisMessage || '') + '</label>';
        $(html).hide().appendTo('.submit-area').fadeIn(500).delay(1000);
      });
  });

  // On form reset, to delete the elements added with the "Add field" button that were not submitted.
  $('form').on('reset', function(e) {
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
