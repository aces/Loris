class TBody extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            data:null
        };
    }
    render () {
        let data = this.state.data;
        let arr  = [];
        if (data && data.arr) {
            console.log(data);
            for (let i in data.arr) {
                arr.push(<Row
                    key={this.props.id_prefix + data.arr[i].id}
                    uniqueKey={this.props.id_prefix + data.arr[i].id}
                    data={data.arr[i]}
                    delete_url={this.props["delete_url"]}
                    update_url={this.props["update_url"]}
                    deleteCallback={this.deleteCallback.bind(this)}
                    />);
            }
        }
        return (
            <tbody>
                {arr}
            </tbody>
        );
    }
    deleteCallback (id) {
        let data = this.state.data;
        if (data && data.arr) {
            for (let i in data.arr) {
                if (data.arr[i].id == id) {
                    data.arr.splice(i, 1);
                    this.setState({
                        data:data
                    });
                    break;
                }
            }
        }
    }
    onAddCallback (e) {
        let data = this.state.data;
        if (data && data.arr) {
            data.arr.unshift(e.detail);
            console.log(data);
            this.setState({
                data:data
            });
        }
    }
    componentDidMount () {
        $.ajax({
            type: "GET",
            url : this.props.fetch_all_url,
            data: {
                "center_id":this.props.center_id
            },
            dataType: "json",
            success: function (data) {
                console.log(data);
                this.setState({
                    data:data
                });
            }.bind(this)
        });
        window.addEventListener(this.props.id_prefix+"-insert", this.onAddCallback.bind(this));
    }
}

window.TBody = TBody;