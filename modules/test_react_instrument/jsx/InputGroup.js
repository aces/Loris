import InputBase from "./InputBase";
import InputUtil from "./InputUtil"; //This introduces a circular dependency

export default class InputGroup extends InputBase {
    constructor (props) {
        super(props);
    }
    getErrorsImpl () {
        const result = [];
        return result;
    }
    renderImpl () {
        const inputMetadata = this.getChildArray();
        const inputArr = [];
        for (let i=0; i < inputMetadata.length; ++i) {
            const cur = inputMetadata[i];
            inputArr.push(InputUtil.renderInput(cur, i%2 == 0));
        }
        return (
            <div className="panel">
                {inputArr}
            </div>
        );
    }
    render () {
        return (
            <div className="panel panel-primary" style={{ margin:"10px" }}>
                <div className="panel-heading">
                    <h3>{this.getDescription()}</h3>
                </div>
                <div className="panel-body">
                    {this.renderErrors()}
                    {this.renderImpl()}
                </div>
            </div>
        );
    }
}