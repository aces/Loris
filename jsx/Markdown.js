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

import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Markdown extends Component {
  htmlSpecialCharsDecode(text) {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"');
  }

  render() {
    // Fix stupid-style newlines to be just \n.
    let fixedNewLines = this.props.content.replace(/\r\n/g, '\n');

    // Fix excaped html
    fixedNewLines = this.htmlSpecialCharsDecode(fixedNewLines);

    // 2 newlines in a row mean it's a paragraph breaker.
    let paragraphs = fixedNewLines.split('\n\n');
    let headersRe = /^(#+)\s+(.+)$/;

    // Do a non-greedy match on text surrounded by ** or __ separately,
    // because we need to be sure that the end tag is the same as the
    // start and want the callback to reference the same index
    let boldRe1 = /(\*\*)(.+?)(\*\*)/g;
    let boldRe2 = /(__)(.+?)(__)/g;
    function boldCallback(match, start, content, end, offset, val) {
      return '<b>' + content + '</b>';
    }

    let italRe1 = /(\*)(.+?)(\*)/g;
    let italRe2 = /(_)(.+?)(_)/g;
    function italCallback(match, start, content, end, offset, val) {
      return '<i>' + content + '</i>';
    }

    let linkRe = /\[(.+?)\]\((.+?)\)/g;
    function linkCallback(match, text, link, offset, val) {
      return '<a href="' + link + '">' + text + '</a>';
    }
    // This needs to be declared outside of the loop to keep eslint
    // happy. It's just the callback for the regex.
    let hlevel = 1;
    function headerCallback(match, headerLevel, headerContent, offset, val) {
      hlevel = headerLevel.length;
      return headerContent;
    }
    for (let i = 0; i < paragraphs.length; i++) {
      // For now, assume that there's an empty line between
      // any headers. It's not true of strict markdown, but
      // it's true enough to enforce for the help pages.
      // Technically, a header should also end at the newline,
      // not at the end of its paragraph too.
      if (paragraphs[i][0] === '#') {
        hlevel = 1;
        paragraphs[i] = paragraphs[i].replace(headersRe, headerCallback);

        switch (hlevel) {
          case 6:
            paragraphs[i] = <h6 key={i + '_help_editor_h6'}>{paragraphs[i]}</h6>;
            break;

          case 5:
            paragraphs[i] = <h5 key={i + '_help_editor_h5'}>{paragraphs[i]}</h5>;
            break;

          case 4:
            paragraphs[i] = <h4 key={i + '_help_editor_h4'}>{paragraphs[i]}</h4>;
            break;

          case 3:
            paragraphs[i] = <h3 key={i + '_help_editor_h3'}>{paragraphs[i]}</h3>;
            break;

          case 2:
            paragraphs[i] = <h2 key={i + '_help_editor_h2'}>{paragraphs[i]}</h2>;
            break;
          case 1:
          default:
            paragraphs[i] = <h1 key={i + '_help_editor_h1'}>{paragraphs[i]}</h1>;
        }
      } else {
        let paramd = paragraphs[i];
        // Do bold before italics, because otherwise italics will catch
        // the inner * of the bold.
        paramd = paramd.replace(boldRe1, boldCallback);
        paramd = paramd.replace(boldRe2, boldCallback);

        paramd = paramd.replace(italRe1, italCallback);
        paramd = paramd.replace(italRe2, italCallback);

        paramd = paramd.replace(linkRe, linkCallback);
        paragraphs[i] = <p key={i + '_help_editor_p'} dangerouslySetInnerHTML={ {__html: paramd}} />;
      }
    }
    return <div>{paragraphs}</div>;
  }
}

Markdown.propTypes = {
  content: PropTypes.string.isRequired,
};

let RMarkdown = React.createFactory(Markdown);

window.Markdown = Markdown;
window.RMarkdown = RMarkdown;

export default Markdown;
