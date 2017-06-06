export default class Row extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      data: props.data
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data) {
      this.setState({
        data: nextProps.data
      });
    }
  }
  onEditClick() {
    this.setState(
      {
        isEdit: true
      }
        );
  }
  onDeleteClick() {
    const data = this.state.data;

    if (confirm("Really delete '" + data.title + "'?")) {
      $.ajax(
        {
          method: "DELETE",
          url: this.props.deleteUrl + "?id=" + encodeURIComponent(data.id),
          dataType: "json",
          success: function(d) {
            this.props.deleteCallback(data.id);
          }.bind(this),
          error: function(error) {
          }
        }
            );
    }
  }
  onEditSubmit(e) {
    e.preventDefault();

    let data = this.state.data;

    const val = $("#" + this.props.uniqueKey + "-input").val();

    $.ajax(
      {
        method: "PUT",
        url: this.props.updateUrl + "?id=" + encodeURIComponent(data.id),
        dataType: "json",
        data: {
          title: val
        },
        success: function(d) {
          data.title = val;
          this.setState(
            {
              isEdit: false,
              data: data
            }
                    );
        }.bind(this),
        error: function(error) {
        }
      }
        );
  }
  onEditCancel() {
    this.setState(
      {
        isEdit: false
      }
        );
  }
  render() {
    let data = this.state.data;

    if (this.state.isEdit) {
      return (
                <tr>
                    <td>
                        <form onSubmit ={this.onEditSubmit.bind(this)}><input id={this.props.uniqueKey + "-input"} type="text" className="form-control" defaultValue={data.title} autoFocus={true}/></form>
                    </td>
                    <td><a href ="#/" onClick={this.onEditSubmit.bind(this)}>Save</a></td>
                    <td><a href ="#/" onClick ={this.onEditCancel.bind(this)}>Cancel</a></td>
                </tr>
            );
    }
    if (data.hidden === "1") {
      return (
                  <tr style={{backgroundColor: "#EEEEEE"}}>
                      <td>{data.title}</td>
                      <td><small>Deleted</small></td>
                      <td><small>Deleted</small></td>
                  </tr>
              );
    }
    return (
                  <tr>
                      <td onDoubleClick ={this.onEditClick.bind(this)}>{data.title}</td>
                      <td><a href ="#/" onClick={this.onEditClick.bind(this)}>Edit</a></td>
                      <td><a href ="#/" onClick ={this.onDeleteClick.bind(this)}>Delete</a></td>
                  </tr>
              );
  }
}
