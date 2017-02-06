/* exported RMarkdown */

/**
 * This file contains a React component which renders markdown text into HTML.
 * by way of JSX.
 *
 * Only very basic markdown is supported. In particular:
 * 1. Paragraphs can be delineated with an empty line.
 * 2. **text** or __text__ will bold the text. *text* or _text_ will italicize it.
 * 3. Up to six header levels can be supported by starting a paragraph with (up to 6)
 *    # characters.
 * 4. Links can be added with [text](url)
 *
 * This should be enough to write help documents in Markdown, even without the
 * more complicated features that markdown should support.
 *
 * @author Dave MacFarlane
 * @version 0.0.1
 *
 */
var Markdown = React.createClass({
  propTypes: {
    content: React.PropTypes.string.isRequired
  },
  render: function() {
    // Fix stupid-style newlines to be just \n.
    var fixedNewlines = this.props.content.replace("\r\n", "\n");

    // 2 newlines in a row mean it's a paragraph breaker.
    var paragraphs = fixedNewlines.split("\n\n");
    var headersRe = /^(#+)\s+(.+)$/;

    // Do a non-greedy match on text surrounded by ** or __ separately,
    // because we need to be sure that the end tag is the same as the
    // start and want the callback to reference the same index
    var boldRe1 = /(\*\*)(.+?)(\*\*)/g;
    var boldRe2 = /(__)(.+?)(__)/g;
    var boldCallback = function(match, start, content, end, offset, val) {
      return "<b>" + content + "</b>";
    };

    var italRe1 = /(\*)(.+?)(\*)/g;
    var italRe2 = /(_)(.+?)(_)/g;
    var italCallback = function(match, start, content, end, offset, val) {
      return "<i>" + content + "</i>";
    };

    var linkRe = /\[(.+?)\]\((.+?)\)/g;
    var linkCallback = function(match, text, link, offset, val) {
      return '<a href="' + link + '">' + text + '</a>';
    };
    for (let i = 0; i < paragraphs.length; i++) {
      // For now, assume that there's an empty line between
      // any headers. It's not true of strict markdown, but
      // it's true enough to enforce for the help pages.
      // Technically, a header should also end at the newline,
      // not at the end of its paragraph too.
      if (paragraphs[i][0] === '#') {
        var hlevel = 1;
        paragraphs[i] = paragraphs[i].replace(headersRe,
          function(match, headerLevel, headerContent, offset, val, hlevel) {
            hlevel = headerLevel.length;
            return headerContent;
          }
        );

        switch (hlevel) {
          case 6:
            paragraphs[i] = <h6>{paragraphs[i]}</h6>;
            break;

          case 5:
            paragraphs[i] = <h5>{paragraphs[i]}</h5>;
            break;

          case 4:
            paragraphs[i] = <h4>{paragraphs[i]}</h4>;
            break;

          case 3:
            paragraphs[i] = <h3>{paragraphs[i]}</h3>;
            break;

          case 2:
            paragraphs[i] = <h2>{paragraphs[i]}</h2>;
            break;
          case 1:
          default:
            paragraphs[i] = <h1>{paragraphs[i]}</h1>;
        }
      } else {
        var paramd = paragraphs[i];
        // Do bold before italics, because otherwise italics will catch
        // the inner * of the bold.
        paramd = paramd.replace(boldRe1, boldCallback);
        paramd = paramd.replace(boldRe2, boldCallback);

        paramd = paramd.replace(italRe1, italCallback);
        paramd = paramd.replace(italRe2, italCallback);

        paramd = paramd.replace(linkRe, linkCallback);
        paragraphs[i] = <p dangerouslySetInnerHTML={ {__html: paramd}} />;
      }
    }
    return <div>{paragraphs}</div>;
  }
});

var RMarkdown = React.createFactory(Markdown);

window.Markdown = Markdown;
window.RMarkdown = RMarkdown;

export default Markdown;
