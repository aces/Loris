/* global showAcknowledgementForm */
class Row extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    };
  }
  joinOnKey(arr, key) {
    if (arr === null || arr === undefined) {
      return null;
    }
    if (arr.length === 0) {
      return null;
    }
    let result = [];
    for (let i = 0; i < arr.length; ++i) {
      let num = i + 1;
      let cur = arr[i][key];

      if (i > 0) {
        result.push(<br/>);
      }
      result.push(<span key ={num}>{num}. {cur}</span>);
    }
    return (<div>{result}</div>);
  }
  onEditClick() {
    const data = this.state.data;

    showAcknowledgementForm(
      {
        method: "PUT",
        action: "/acknowledgements/ajax/update.php?id=" + encodeURIComponent(data.id),
        submitText: "Edit",
        title: "Edit Acknowledgement",
        data: data,
        callback: function() {
          $.ajax(
            {
              method: "GET",
              url: "/acknowledgements/ajax/fetch.php",
              data: {
                id: data.id
              },
              dataType: "json",
              success: function(newData) {
                this.setState(
                  {
                    data: newData
                  }
                                );
              }.bind(this)
            }
                    );
        }.bind(this)
      }
        );
  }
  onDeleteClick() {
    const data = this.state.data;

    showAcknowledgementForm(
      {
        disabled: true,
        method: "DELETE",
        action: "/acknowledgements/ajax/delete.php?id=" + encodeURIComponent(data.id),
        submitText: "Delete",
        title: "Delete Acknowledgement",
        data: data,
        callback: function() {
          this.props.deleteCallback(data.id);
        }.bind(this)
      }
        );
  }
  render() {
    let data = this.state.data;
    let inStudyAtPresent = "Unknown";

    if (data.inStudyAtPresent !== null && data.inStudyAtPresent !== undefined) {
      inStudyAtPresent = (data.inStudyAtPresent === "1") ?
            "Yes" : "No";
    }
    return (
            <tr>
                <td>{data.fullName}</td>
                <td>{data.citationName}</td>
                <td>{this.joinOnKey(data.affiliationArr, "title")}</td>
                <td>{this.joinOnKey(data.degreeArr, "title")}</td>
                <td>{this.joinOnKey(data.roleArr, "title")}</td>
                <td>{data.startDate}</td>
                <td>{data.endDate}</td>
                <td>{inStudyAtPresent}</td>
                <td><a href ="#/" onClick={this.onEditClick.bind(this)}>Edit</a></td>
                <td><a href ="#/" onClick ={this.onDeleteClick.bind(this)}>Delete</a></td>
            </tr>
        );
  }
    }
window.Row = Row;
