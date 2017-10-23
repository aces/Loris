/**
 * React component used to display a button and a collapsible list
 * with comments.
 */
class CommentList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {collapsed: true};

    // Bind component instance to custom methods
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  toggleCollapsed() {
    this.setState({collapsed: !this.state.collapsed});
  }

  render() {
    const btnCommentsLabel = (this.state.collapsed ?
      "Show Comment History" :
      "Hide Comment History");

    const changes = this.props.commentHistory.reduce(function (carry, item) {
      let label = item.dateAdded.concat(" ", item.addedBy, " :" );
      if (!carry[label]) {
        carry[label] = {};
      }
      carry[label][item.fieldChanged] = item.newValue;
      return carry;
    }, {});

    const history = Object.keys(changes).sort().map(function (key, i) {
      const textItems = Object.keys(changes[key]).map(function (index, j) {
        return (
          <div key={j}>
            <span>
              {'Set '.concat(index, ' to ', changes[key][index])}
            </span>
            <br/>
          </div>
        )
      }, this);
        
      return (
        <div key={i}>
          <hr/>
          <div className="history-item-label">
            {key}
          </div>
          <div className="history-item-changes">
            {textItems}
          </div>
        </div>
      );
    }, this);

    return (
      <div>
        <div className="btn btn-primary"
             onClick={this.toggleCollapsed}
             data-toggle="collapse"
             data-target="#comment-history"
             style={{margin: '10px 0'}}
        >
          {btnCommentsLabel}
        </div>
        <div id="comment-history" className="collapse">
          {history}
        </div>
      </div>
    );
  }
}

export default CommentList;
