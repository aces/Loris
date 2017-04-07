class TBody extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            data:null
        };
    }
    deleteCallback (id) {
        let data = this.state.data;
        if (data && data.arr) {
            console.log(data.arr);
            console.log("in delete", data.arr.length);
            for (i in data.arr) {
                if (data.arr[i].id == id) {
                    data.arr.splice(i, 1);
                    console.log(data.arr);
                    console.log("in delete", data.arr.length);
                    this.setState({
                        data:{
                            arr:[data.arr[0]]
                        }
                    });
                    break;
                }
            }
        }
    }
    render () {
        let data = this.state.data;
        let arr  = [];
        if (data && data.arr) {
            console.log("in render", data.arr.length);
            for (i in data.arr) {
                arr.push(<Row data={data.arr[i]} deleteCallback={this.deleteCallback.bind(this)}/>);
            }
        }
        return (
            <tbody>
                {arr}
            </tbody>
        );
    }
    componentDidMount () {
        $.ajax({
            type: "GET",
            url : "/acknowledgements/ajax/fetch_all_of_center.php",
            data: {
                "center_id":this.props["center_id"]
            },
            dataType: "json",
            success: function (data) {
                console.log(data);
                this.setState({
                    data:data
                });
            }.bind(this)
        });
    }
}

window.TBody = TBody;