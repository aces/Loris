import i18n from 'I18nSetup';
import swal from 'sweetalert2';
import lorisFetch from 'jslib/lorisFetch';

$(function() {
  const {t} = i18n;
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
      text: t(
        'Please confirm you want to delete the option'
        + ' "{{option}}" of the field "{{field}}".',
        {
          ns: 'configuration',
          option: selectedOption,
          field: fieldName,
        }
      ),
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: t('Confirm', {ns: 'configuration'}),
      cancelButtonText: t('Cancel', {ns: 'loris'}),
    }).then((result) => {
      if (result.value) {
        let id = $(this).attr('name');
        let button = this;

        lorisFetch(loris.BaseURL + '/configuration/ajax/process.php', {
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          body: new URLSearchParams({remove: id}),
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

  $('body').on('click', '.configuration-image-upload-button', function() {
    let button = $(this);
    let upload = button.closest('.configuration-image-upload');
    let input = upload.find('.configuration-image-file')[0];
    let file = input.files[0];

    if (!file) {
      swal.fire({
        text: 'Select an image to upload.',
        type: 'warning',
      });
      return;
    }

    let data = new FormData();
    data.append('file', file);
    button.prop('disabled', true);

    $.ajax({
      type: 'post',
      url: loris.BaseURL + '/configuration/upload',
      data: data,
      processData: false,
      contentType: false,
      success: function(response) {
        $('.configuration-image-select').each(function() {
          let select = $(this);
          let exists = select.find('option').filter(function() {
            return $(this).val() === response.path;
          }).length > 0;
          if (!exists) {
            select.append(new Option(response.path, response.path));
          }
        });
        upload.prev('.configuration-image-select').val(response.path);
        input.value = '';
        swal.fire({
          text: 'Image uploaded. Submit the form to save this selection.',
          type: 'success',
        });
      },
      error: function(xhr) {
        let message = xhr.responseJSON && xhr.responseJSON.error
          ? xhr.responseJSON.error
          : 'The image could not be uploaded.';
        swal.fire({
          text: message,
          type: 'error',
        });
      },
      complete: function() {
        button.prop('disabled', false);
      },
    });
  });

  // On form submit, process the changes through an AJAX call
  $('form').on('submit', function(e) {
    e.preventDefault();

    let form = $(this).serialize();

    // Clear previous feedback
    $('.submit-area > label').remove();

    lorisFetch(loris.BaseURL + '/configuration/ajax/process.php', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: form,
    })
      .then(async (response) => {
        if (!response.ok) {
          let text = await response.text();
          let error = new Error('request_failed');
          error.lorisMessage = text;
          throw error;
        }
        let html = '<label>' + t(
          'Submitted',
          {ns: 'configuration'}
        ) + '</label>';
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
