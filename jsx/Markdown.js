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
const ReactMarkdown = require('react-markdown');

class Markdown extends Component {
  render() {
    return <ReactMarkdown source={this.props.content} />;
  }
}

Markdown.propTypes = {
  content: PropTypes.string.isRequired,
};

let RMarkdown = React.createFactory(Markdown);

window.Markdown = Markdown;
window.RMarkdown = RMarkdown;

export default Markdown;
