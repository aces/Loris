import swal from 'sweetalert2';
import ConfigurationClient from './ConfigurationClient';

const configurationClient = new ConfigurationClient();

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

        configurationClient.postForm(
          'process.php',
          new URLSearchParams({remove: id})
        )
          .then(() => {
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

    configurationClient.postForm('process.php', form)
      .then(() => {
        let html = '<label>Submitted</label>';
        $(html)
          .hide()
          .appendTo('.submit-area')
          .fadeIn(500).delay(1000).fadeOut(500);
        location.reload();
      })
      .catch(async (error) => {
        let errorMessage = '';
        if (error && error.response) {
          try {
            errorMessage = await error.response.text();
          } catch (responseError) {
            errorMessage = '';
          }
        }
        let html = '<label>' + errorMessage + '</label>';
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
