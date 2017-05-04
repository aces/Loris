import InputBase from "./InputBase";

export default class InputNumeric extends InputBase {
    constructor (props) {
        super(props);
    }
    getErrorsImpl () {
        const result = [];
        const minValue = this.getOption("MinValue", null);
        const maxValue = this.getOption("MaxValue", null);
        if (minValue != null && maxValue != null && minValue >= maxValue) {
            result.push("Rule min >= max, this will not be enforced");
        }
        return result;
    }
    renderImpl () {
        const numberType = this.getOption("NumberType", "integer");
        let minValue = this.getOption("MinValue", null);
        let maxValue = this.getOption("MaxValue", null);
        if (minValue != null && maxValue != null && minValue >= maxValue) {
            minValue = null;
            maxValue = null;
        }
        if (numberType === "integer") {
            return (
                <input
                    type="number"
                    step="1"
                    pattern="-?\d+"
                    className="form-control"
                    name={this.getFormName()}
                    min={minValue}
                    max={maxValue}
                    required={this.isRequired()}/>
            );
        } else {
            return (
                <input
                    type="number"
                    className="form-control"
                    name={this.getFormName()}
                    min={minValue}
                    max={maxValue}
                    required={this.isRequired()}/>
            );
        }
    }
}