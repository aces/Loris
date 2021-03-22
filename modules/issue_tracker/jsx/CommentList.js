import React, {Component} from 'react';

/**
 * React component used to display a button and a collapsible list
 * with comments.
 */
class CommentList extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {collapsed: true};

    // Bind component instance to custom methods
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  /**
   * Toggle Collapsed
   */
  toggleCollapsed() {
    this.setState({collapsed: !this.state.collapsed});
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const changes = this.props.commentHistory.reduce(function(carry, item) {
      let label = item.dateAdded.concat(' - ', item.addedBy);
      if (!carry[label]) {
        carry[label] = {
            data: {},
            user: item.addedBy,
            date: new Date(item.dateAdded),
        };
      }
      carry[label].data[item.fieldChanged] = item.newValue;
      return carry;
    }, {});

    const history = Object.keys(changes).sort().reverse().map(function(key, i) {
      let comment;
      const item = changes[key];
      const textItems = Object.keys(item.data).map(function(index, j) {
        if (index == 'comment') {
            comment = <div style={{marginTop: '1em'}}>
              <Markdown content={item.data[index]} />
            </div>;
            return;
        }
        return (
          <li key={j} className='row' style={{color: 'rgb(149, 149, 149)'}}>
            <div className='col-md-2'>
              <div className='col-md-8'><strong>{index}</strong></div>
              <div className='col-md-4'> to </div>
            </div>
            <div className='col-md-10'><i>{item.data[index]}</i></div>
          </li>
        );
      }, this);

      let now = new Date();
      const datediffSec = (now.getTime() - item.date.getTime()) / 1000;
      let timestr;
      if (datediffSec < 60) {
          timestr = <span> {Math.round(datediffSec)} seconds ago</span>;
      } else if (datediffSec < 60*60) {
          timestr = <span> {Math.round(datediffSec / 60)} minutes ago</span>;
      } else if (datediffSec < 60*60*24) {
          timestr = <span> {Math.round(datediffSec / (60*60))} hours ago</span>;
      } else {
          timestr = <span>
            on {item.date.toLocaleDateString()} at {item.date.toTimeString()}
          </span>;
      }

      return (
        <div key={i}>
          <hr/>
          <div className='history-item-label'>
            Updated by
            <span className="history-item-user">{item.user}</span>
            {timestr}:
          </div>
          <ul className='history-item-changes'>
            {textItems}
          </ul>
          {comment}
        </div>
      );
    }, this);

    return (
      <div id='comment-history'>
        <h3>Comments and History</h3>
        {history}
      </div>
    );
  }
}

export default CommentList;
