import Row from "./Row";

export default class TBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }
  render() {
    let data = this.state.data;
    let arr = [];
    if (data && data.arr) {
      for (let i = 0; i < data.arr.length; ++i) {
        arr.push(
                    <Row
                    key ={this.props.idPrefix + data.arr[i].id}
                    uniqueKey ={this.props.idPrefix + data.arr[i].id}
                    data ={data.arr[i]}
                    deleteUrl ={this.props.deleteUrl}
                    updateUrl ={this.props.updateUrl}
                    deleteCallback ={this.deleteCallback.bind(this)}
                    />
                );
      }
    }
    return (
            <tbody>
                {arr}
            </tbody>
        );
  }
  deleteCallback(id) {
    let data = this.state.data;
    if (data && data.arr) {
      for (let i in data.arr) {
        if (data.arr[i].id === id) {
          data.arr.splice(i, 1);
          this.setState(
            {
              data: data
            }
                    );
          break;
        }
      }
    }
  }
  onAddCallback(e) {
    let data = this.state.data;
    if (data && data.arr) {
      data.arr.unshift(e.detail);
      this.setState(
        {
          data: data
        }
            );
    }
  }
  componentDidMount() {
    $.ajax(
      {
        type: "GET",
        url: this.props.fetchAllUrl,
        data: {
          centerId: this.props.centerId
        },
        dataType: "json",
        success: function(data) {
          this.setState(
            {
              data: data
            }
                    );
        }.bind(this)
      }
        );
    window.addEventListener(this.props.idPrefix + "-insert", this.onAddCallback.bind(this));
  }
}