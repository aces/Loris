class WatchingCheckbox extends React.Component {
  constructor(prop) {
    super();
    this.state = {
      checked: prop.checked,
      issueId: prop.issue_id
    };
    this.onChange = this.onChange.bind(this);
  }
  render() {
    return (
      <input type = "checkbox" checked = {this.state.checked} onChange = {this.onChange}/>
    );
  }
  onChange(e) {
    $.ajax({
      type: "PUT",
      dataType: "json",
      url: "/issue_tracker/ajax/ToggleMyWatching.php?issue_id=" + this.state.issueId,
      success: function(data) {
        this.setState({
          checked: data.watching
        });
      }.bind(this),
      error: function(err) {
        console.error(err);
      }
    });
  }
}

window.WatchingCheckbox = WatchingCheckbox;

export default WatchingCheckbox;
