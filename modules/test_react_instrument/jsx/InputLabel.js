import InputBase from "./InputBase";

export default class InputLabel extends InputBase {
  render() {
    return (
        <div className="row" style={{margin: "10px"}}>
            <h4>{this.getDescription()}</h4>
            {this.renderErrors()}
            {this.renderImpl()}
        </div>
    );
  }
}
