export const toLinst = (
  redcaptype,
  redcapfieldname,
  redcaplabel,
  redcapChoices,
  callback
) => {
  const label = redcaplabel.replaceAll('\n', '<br /><br />');
  switch (redcaptype) {
  case 'text':
        /* switch ($redcapOptions) {
            case '
            date_dmy 31-12-2008
            date_mdy 12-31-2008
            date_ymd 2008-12-31
            datetime_dmy 16-02-2011 17:45
            datetime_mdy 02-16-2011 17:45
            datetime_ymd 2011-02-16 17:45
            datetime_seconds_dmy 16-02-2011 17:45:23
            datetime_seconds_mdy 02-16-2011 17:45:23
            datetime_seconds_ymd
email john.doe@vanderbilt.edu
integer 1, 4, -10 whole number with no decimal
alpha_only name letters only, no numbers, spaces or special characters
number 1.3, 22, -6.28, 3.14e-2 a general number or scientific notation (no spaces)
number_1dp_comma_decimal number to 1 decimal place - comma as decimal
number_1dp number to 1 decimal place
number_2dp_comma_decimal number to 2 decimal place - comma as decimal
number_2dp number to 2 decimal place
number_3dp_comma_decimal number to 3 decimal place - comma as decimal
number_3dp number to 3 decimal place
number_4dp_comma_decimal number to 4 decimal place - comma as decimal
number_4dp number to 4 decimal place
number_comma_decimal number comma as decimal
phone_australia
phone 615-322-2222
Area codes start with a number from 2-9, followed by 0-8 and
then any third digit.
The second group of three digits, known as the central office or
schange code, starts with a number from 2-9, followed by any
two digits.
The final four digits, known as the station code, have no
restrictions.
postalcode_australia 2150 4-digit number
postalcode_canada K1A 0B1 Format: A0A 0A0 where A is a letter and 0 is a digit
ssn 123-12-1234 Format: xxx-xx-xxxx
time 19:30 military time
time_mm_ss 31:22 time in minutes and seconds
vmrn 0123456789 10 digits
Zipcode
        }
        */
      // text maps directly to LORIS
      return 'text{@}' + redcapfieldname + '{@}' + label + '\n';
  case 'descriptive':
      // descriptive maps to label with no field.
      return 'static{@}{@}' + label + '\n';
  case 'radio':
  case 'dropdown':
      // Radio or dropdown maps to a select and the options are in the
      // same format in the dictionary.
      let selectoptions = optionsToLINST(redcapChoices, callback);
      if (selectoptions) {
        selectoptions = 'NULL=>\'\'{-}' + selectoptions;
      }
      return 'select{@}' + redcapfieldname + '{@}' + label + '{@}'
          + selectoptions + '\n';
  case 'checkbox':
      // checkboxes are the same format as radios but allow multiple options,
      // so map to a selectmultiple instead of a select
      return 'selectmultiple{@}' + redcapfieldname + '{@}' + label + '{@}'
          + optionsToLINST(redcapChoices, callback) + '\n';
  case 'yesno':
      // Map yes/no fields to dropdowns with yes and no options.
      return 'select{@}' + redcapfieldname + '{@}' + label + '{@}'
          + 'NULL=>\'\'{-}\'yes\'=>\'Yes\'{-}\'no\'=>\'No\'' + '\n';
  case 'calc':
      // Calc maps to a score field.
      // We create the DB field but don't do the score.
      return 'static{@}' + redcapfieldname + '{@}' + label + '\n';
  case 'sql':
      // The "SQL" data type is used for a dynamic display of enum options. Since
      // we don't have access to the redcap database that the sql is selecting from,
      // we treat it the same way as a score/calc field so that data can be imported.
      return 'static{@}' + redcapfieldname + '{@}' + label + '\n';
  case 'slider':
      return 'numeric{@}' + redcapfieldname + '{@}' + label + '{@}0{@}100'
          + '\n';
  case 'file':
      // File upload - NOT SUPPORTED BY LINST
      return '';
  case 'notes':
      // REDCap calls textareas notes
      return 'textarea{@}' + redcapfieldname + '{@}' + label + '\n';
  default:
      callback.error('syntaxError', 'Unhandled REDCap type ' + redcaptype);
      throw new Error('Unhandled REDCap type ' + redcaptype);
  }
};

const optionsToLINST = (dictionary, callback) => {
  dictionary = dictionary.replaceAll(' | | ', ' | ');
  if (dictionary.startsWith('| ')) {
    dictionary = dictionary.substring(2);
  }

  const choices = dictionary.split('|');
  const linstChoices = choices.map((choice, index) => {
    const matches = choice.match(/^(\s)*([a-z0-9]+)(\s)*,(.*)$/i);
    if (matches === null) {
      callback.error('syntaxError', 'Could not parse radio option: \''
        + choice + '\'');
      throw new Error('Could not parse radio option: \''
        + choice + '\'');
    }
    // const backend = matches[2] + '_' + (matches[4].trim()).replace(/\s+/g, '_');
    const backend = matches[2];
    const linstFormat = '\'' + backend.toLowerCase() + '\'=>\''
      + (matches[4]).trim() + '\'';
    return linstFormat;
  });

  return linstChoices.join('{-}');
};

export const addMetaDataFields = (inst, linst) => {
  'use strict';
  const fileName = inst || 'new_instrument';
  // Get title from inst name, replace all underscores
  // with space
  let title = fileName.replaceAll('_', ' ');
  // Add space before any numbers appended to name
  title = title.replaceAll(/([A-Za-z])(\d+)/g, '$1 $2');
  // Capitalize first letters
  const replacer = (match, p1, offset, string) => {
    // p1 is first letter
    return p1.toUpperCase();
  };
  title = title.replaceAll(/(\b\w)/g, replacer);
  // Add table and title tags
  // Add Standard LORIS metadata fields that the instrument builder adds
  // and LINST class automatically adds to instruments.
  linst.unshift(
    'table{@}' + fileName + '\n',
    'title{@}' + title + '\n',
    'date{@}Date_taken{@}Date of Administration{@}{@}\n',
    'static{@}Candidate_Age{@}Candidate Age (Years)\n',
    'static{@}Window_Difference{@}Window Difference (+/- Days)\n',
    'select{@}Examiner{@}Examiner{@}NULL=>\'\'\n'
  );
  return linst;
};
