class Row extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            data:props.data
        };
    }
    joinOnKey (arr, key) {
        if (arr == null) {
            return null;
        }
        if (arr.length == 0) {
            return null;
        }
        let result = [];
        for (let i=0; i<arr.length; ++i) {
            let num = i+1;
            let cur = arr[i][key];
            
            if (i > 0) {
                result.push(<br/>);
            }
            result.push(<span>{num}. {cur}</span>);
        }
        return (<div>{result}</div>);
    }
    onEditClick () {
        const data = this.state.data;
        
        showAcknowledgementForm({
            method:"PUT",
            action:"/acknowledgements/ajax/update.php?id="+encodeURIComponent(data.id),
            submit_text: "Edit",
            title: "Edit Acknowledgement",
            data: data,
            callback: function () {
                $.ajax({
                    method:"GET",
                    url:"/acknowledgements/ajax/fetch.php",
                    data: {
                        id:data.id
                    },
                    dataType: "json",
                    success: function (new_data) {
                        this.setState({
                            data:new_data
                        });
                    }.bind(this)
                });
            }.bind(this)
        });
    }
    onDeleteClick () {
        const data = this.state.data;
        
        showAcknowledgementForm({
            disabled: true,
            method:"DELETE",
            action:"/acknowledgements/ajax/delete.php?id="+encodeURIComponent(data.id),
            submit_text: "Delete",
            title: "Delete Acknowledgement",
            data: data,
            callback: function () {
                this.props.deleteCallback(data.id);
            }.bind(this)
        });
    }
    render () {
        let data = this.state.data;
        let   in_study_at_present = "Unknown";
                
        if (data.in_study_at_present != null) {
            in_study_at_present = (data.in_study_at_present === "1") ?
                "Yes" : "No";
        }
        return (
            <tr>
                <td>{data.full_name}</td>
                <td>{data.citation_name}</td>
                <td>{this.joinOnKey(data.affiliation_arr, "title")}</td>
                <td>{this.joinOnKey(data.degree_arr, "title")}</td>
                <td>{this.joinOnKey(data.role_arr, "title")}</td>
                <td>{data.start_date}</td>
                <td>{data.end_date}</td>
                <td>{in_study_at_present}</td>
                <td><a href="#/" onClick={this.onEditClick.bind(this)}>Edit</a></td>
                <td><a href="#/" onClick={this.onDeleteClick.bind(this)}>Delete</a></td>
            </tr>
        );
    }
}
window.Row = Row;