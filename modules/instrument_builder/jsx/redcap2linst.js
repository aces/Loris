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
        selectoptions = "NULL=>''{-}" + $selectoptions;
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

export const downloadLinst = (inst, linst) => {
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
  linst.unshift(
    'table{@}' + fileName + '\n',
    'title{@}' + title + '\n'
  );
  // Standard LORIS metadata fields that the instrument builder adds
  // and LINST class automatically adds to instruments.
  linst.unshift(
    'date{@}Date_taken{@}Date of Administration{@}{@}\n',
    'static{@}Candidate_Age{@}Candidate Age (Years)\n',
    'static{@}Window_Difference{@}Window Difference (+/- Days)\n',
    'select{@}Examiner{@}Examiner{@}NULL=>\'\'\n'
  );
  const element = document.createElement('a');
  const blob = new Blob([linst.join('')], {type: 'text/plain;base64'});
  const url = URL.createObjectURL(blob);
  element.href = url;
  element.download = fileName + '.linst';
  element.style.display = 'none';
  // add element to the document so that it can be clicked
  // this is needed to download in firefox
  document.body.appendChild(element);
  element.click();
  // remove the element once it has been clicked
  document.body.removeChild(element);
  URL.revokeObjectURL(url);
};
