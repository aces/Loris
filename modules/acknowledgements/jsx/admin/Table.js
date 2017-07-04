import FormAdd from "./FormAdd";
import TBody from "./TBody";

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.tbody = <TBody
            idPrefix ={props.idPrefix}
            centerId ={props.centerId}
            fetchAllUrl ={props.fetchAllUrl}
            deleteUrl ={props.deleteUrl}
            updateUrl ={props.updateUrl}
            />;
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
            <div>
                <FormAdd
                    idPrefix ={this.props.idPrefix}
                    centerId ={this.props.centerId}
                    insertUrl ={this.props.insertUrl}
                    fetchUrl ={this.props.fetchUrl}
                    placeholder ={this.props.placeholder}
                    />
                <table className ="table table-hover table-primary table-bordered table-unresolved-conflicts dynamictable">
                    <thead>
                        <tr className ="info">
                            <th>{this.props.placeholder}</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    {this.tbody}
                </table>
            </div>
        );
  }
}
