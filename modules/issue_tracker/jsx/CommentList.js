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
    const historyText = [];
    const btnCommentsLabel = (this.state.collapsed ?
      "Show Comment History" :
      "Hide Comment History");

    const commentHistory = this.props.commentHistory;
    for (let commentID in commentHistory) {
      if (commentHistory.hasOwnProperty(commentID)) {
        let action = " updated the " + commentHistory[commentID].fieldChanged + " to ";
        if (commentHistory[commentID].fieldChanged === 'comment') {
          action = " commented ";
        }
        historyText.push(
          <div key={"comment_" + commentID}>
            [{commentHistory[commentID].dateAdded}]
            <b> {commentHistory[commentID].addedBy}</b>
            {action}
            <i> {commentHistory[commentID].newValue}</i>
          </div>
        );
      }
    }

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
          {historyText}
        </div>
      </div>
    );
  }
}

export default CommentList;
