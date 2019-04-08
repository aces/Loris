$(document).ready(function() {
  // If <input type="date" /> is not supported (i.e. Firefox), load
  // jquery date-picker
  if (!Modernizr.inputtypes.date) { // eslint-disable-line
    const dateInputs = $('input[type=date]');
    dateInputs.datepicker({
      dateFormat: 'yy-mm-dd',
      changeMonth: true,
      changeYear: true,
      yearRange: '1900:' + new Date().getFullYear(),
      constrainInput: true,
    });
    dateInputs.attr('placeholder', 'yyyy-mm-dd');
    dateInputs.on('keydown paste', function(e) {
      e.preventDefault();
    });
  }
  if (!Modernizr.inputtypes.month) { // eslint-disable-line
    const monthInputs = $('input[type=month]');
    monthInputs.datepicker({
      dateFormat: 'yy-mm',
      changeMonth: true,
      changeYear: true,
      yearRange: '1900:' + new Date().getFullYear(),
      constrainInput: true,
      onChangeMonthYear: function(y, m, d) {
        // Update date in the input field
        $(this).datepicker('setDate', new Date(y, m - 1, d.selectedDay));
      },
    });
    monthInputs.attr('placeholder', 'yyyy-mm');
    monthInputs.on('keydown paste', function(e) {
      e.preventDefault();
    });
  }
});

