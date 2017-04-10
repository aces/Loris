class Row extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            is_edit:false,
            data:props.data
        };
    }
    onEditClick () {
        this.setState({
            is_edit:true
        });
    }
    onDeleteClick () {
        const data = this.state.data;
        
        if (confirm("Really delete '"+data.title+"'?")) {
            $.ajax({
                method: "DELETE",
                url : this.props["delete_url"] + "?id=" + encodeURIComponent(data.id),
                dataType: "json",
                success: function (d) {
                    this.props.deleteCallback(data.id);
                }.bind(this),
                error: function (error) {
                    console.log(error);
                }
            });
        }
    }
    onEditSubmit (e) {
        e.preventDefault();
        
        let data = this.state.data;
        
        const val = $("#"+this.props.uniqueKey+"-input").val();
        console.log(val);
        
        $.ajax({
            method: "PUT",
            url : this.props["update_url"] + "?id=" + encodeURIComponent(data.id),
            dataType: "json",
            data: {
                title:val
            },
            success: function (d) {
                console.log("Edited");
                data.title = val;
                this.setState({
                    is_edit:false,
                    data:data
                });
            }.bind(this),
            error: function (error) {
                console.log(error);
            }
        });
    }
    onEditCancel () {
        this.setState({
            is_edit:false
        });
    }
    render () {
        let data = this.state.data;
        
        if (this.state.is_edit) {
            return (
                <tr>
                    <td>
                        <form onSubmit={this.onEditSubmit.bind(this)}><input id={this.props.uniqueKey+"-input"} type="text" className="form-control" defaultValue={data.title} autoFocus={true}/></form>
                    </td>
                    <td><a href="#/" onClick={this.onEditSubmit.bind(this)}>Save</a></td>
                    <td><a href="#/" onClick={this.onEditCancel.bind(this)}>Cancel</a></td>
                </tr>
            );
        } else {
            return (
                <tr>
                    <td onDoubleClick={this.onEditClick.bind(this)}>{data.title}</td>
                    <td><a href="#/" onClick={this.onEditClick.bind(this)}>Edit</a></td>
                    <td><a href="#/" onClick={this.onDeleteClick.bind(this)}>Delete</a></td>
                </tr>
            );
        }
    }
}
window.Row = Row;