export default class FormAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onAddSubmit(e) {
    e.preventDefault();

    const val = $("#" + this.props.idPrefix + "-add-input").val();

    $.ajax(
      {
        type: "POST",
        url: this.props.insertUrl,
        dataType: "json",
        data: {
          centerId: this.props.centerId,
          title: val
        },
        success: function(data) {
          $.ajax(
            {
              method: "GET",
              url: this.props.fetchUrl + "?id=" + encodeURIComponent(data.id),
              dataType: "json",
              success: function(d) {
                window.dispatchEvent(
                                    new CustomEvent(
                                        this.props.idPrefix + "-insert",
                                      {
                                        detail: d
                                      }
                                    )
                                );
                this.setState(
                  {
                    error: null
                  }
                                );
              }.bind(this),
              error: function(error) {
                this.setState(
                  {
                    error: error.responseJSON.error
                  }
                                );
              }.bind(this)
            }
                    );
        }.bind(this),
        error: function(error) {
          this.setState(
            {
              error: error.responseJSON.error
            }
                    );
        }.bind(this)
      }
        );
  }
  render() {
    return (
            <div className ="panel panel-primary">
                <div className ="panel-body">
                    <form onSubmit ={this.onAddSubmit.bind(this)}>
                        <div>
                            <span className ="label" style={{backgroundColor: "#ff5f5f"}}>{this.state.error}</span>
                        </div>
                        <div className ="row">
                            <div className ="col-lg-9">
                                <input id ={this.props.idPrefix + "-add-input"} type="text" placeholder={this.props.placeholder} className="form-control"/>
                            </div>
                            <div className ="col-lg-3">
                                <input type ="submit" value ="Add" className ="form-control btn btn-small btn-primary"/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
  }
}
