function localizeInstrument(rawInstrument, lang = 'en-ca') {
  const instrument = JSON.parse(JSON.stringify(rawInstrument));

  try {
    instrument['Meta']['LongName'] = instrument['Meta']['LongName'][lang];

    const convertedElements = [];

    instrument['Elements'].forEach((element) => {
      if (['label', 'text', 'calc'].includes(element.Type)  && element['Description'][lang]) {
        element['Description'] = element['Description'][lang];
        convertedElements.push(element);
      } else if (['select', 'radio', 'checkbox'].includes(element.Type) && element['Description'][lang]) {
        element['Description'] = element['Description'][lang];
        element['Options']['Values'] = element['Options']['Values'][lang];
        convertedElements.push(element);
      } else if (['radio-labels'].includes(element.Type) && element['Labels'][lang]) {
        element['Labels'] = element['Labels'][lang];
        convertedElements.push(element);
      }
    });

    instrument['Elements'] = convertedElements;
    return instrument;
  } catch (e) {
    console.log(e);
  }
}

export default localizeInstrument;
