/* global fetchAll */
class TBody extends React.Component {
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
        arr.push(<Row key ={data.arr[i].id} data ={data.arr[i]} deleteCallback ={this.deleteCallback.bind(this)}/>);
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
      for (let i = 0; i < data.arr.length; ++i) {
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
  onFetchAllCallback(e) {
    this.setState(
      {
        data: e.detail
      }
        );
  }
  componentDidMount() {
    fetchAll(
      {
        centerId: this.props.centerId,
        success: function(data) {
          this.setState(
            {
              data: data
            }
                    );
        }.bind(this)
      }
        );
    window.addEventListener("acknowledgement-insert", this.onAddCallback.bind(this));
    window.addEventListener("acknowledgement-fetch-all", this.onFetchAllCallback.bind(this));
  }
}

window.TBody = TBody;
