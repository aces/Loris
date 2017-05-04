import InputBase from "./InputBase";

export default class InputHeader extends InputBase {
    constructor (props) {
        super(props);
    }
    getErrorsImpl () {
        const result = [];
        result.push("Rule level is not implemented yet");
        return result;
    }
    render () {
        return (
            <div className="row" style={{ margin:"10px" }}>
                <h4>{this.getDescription()}</h4>
                {this.renderErrors()}
                {this.renderImpl()}
            </div>
        );
    }
}