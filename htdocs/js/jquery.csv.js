/* Usage:
 *  jQuery.csv()(csvtext)               returns an array of arrays representing the CSV text.
 *  jQuery.csv("\t")(tsvtext)           uses Tab as a delimiter (comma is the default)
 *  jQuery.csv("\t", "'")(tsvtext)      uses a single quote as the quote character instead of double quotes
 *  jQuery.csv("\t", "'\"")(tsvtext)    uses single & double quotes as the quote character
 */

jQuery.extend({
  csv: function(delim, quote, lined) {
    delim = typeof delim === 'string' ? new RegExp('[' + (delim || ',') + ']') : typeof delim === 'undefined' ? ',' : delim;
    quote = typeof quote === 'string' ? new RegExp('^[' + (quote || '"') + ']') : typeof quote === 'undefined' ? '"' : quote;
    lined = typeof lined === 'string' ? new RegExp('[' + (lined || '\r\n') + ']+') : typeof lined === 'undefined' ? '\r\n' : lined;

    function splitline(v) {
      // Split the line using the delimitor
      let arr = v.split(delim);
      let out = [];
      for (let i = 0, l = arr.length; i < l; i++) {
        let hasMatch = arr[i].match(quote);
        let j;
        if (hasMatch) {
          for (j = i; j < l; j++) {
            if (arr[j].charAt(arr[j].length - 1) === hasMatch[0]) {
              break;
            }
          }
          let s = arr.slice(i, j + 1).join(delim);
          out.push(s.substr(1, s.length - 2));
          i = j;
        } else {
          out.push(arr[i]);
        }
      }
      return out;
    }

    return function(text) {
      let lines = text.split(lined);
      for (let i = 0, l = lines.length; i < l; i++) {
        lines[i] = splitline(lines[i]);
      }
      return lines;
    };
  },
});

