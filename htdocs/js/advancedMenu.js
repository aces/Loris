/* export isElementSet, showAdvancedOptionsCheck */

function isElementSet() {
  'use strict';
  let set = 0;
  let options = $('.advancedOptions option:selected'); // /get all the selected dropdowns for the TR with the ID advancedOptions
  let texts = $('.advancedOptions input[type=text]');
    // /brows through the selected dropdowns
    // /if any of the dropdown is not equal to 'All' then set the variable set to true
  options.each(function() {
    let value = $(this).text();
    if (value !== 'All') {
      set = 1;
      return;
    }
  });
    // browse though the text elements
    // /if any of the text element is not empty then set the variable set to true
  texts.each(function() {
    let value = $(this).val();
    if (value !== '') {
      set = 1;
      return;
    }
  });
  return set;
}

function showAdvancedOptionsCheck() {
  'use strict';
  let els = $('.advancedOptions'); // /get all the TR elements with the ID advancedOptions
  let set = isElementSet();
  if (set) {
    els.show();
    $('.advanced-buttons').toggle();
  } else {
    els.hide();
  }
}

$(function() {
  'use strict';
  showAdvancedOptionsCheck();
});
