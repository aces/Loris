import InputBase from "./InputBase";

export default class InputDate extends InputBase {
    constructor (props) {
        super(props);
    }
    getErrorsImpl () {
        const result = [];
        const minValue = this.getOption("MinDate", null);
        const maxValue = this.getOption("MaxDate", null);
        if (minValue != null && maxValue != null && minValue >= maxValue) {
            result.push("Rule min >= max, this will not be enforced");
        }
        return result;
    }
    renderImpl () {
        let minValue = this.getOption("MinDate", null);
        let maxValue = this.getOption("MaxDate", null);
        if (minValue != null && maxValue != null && minValue >= maxValue) {
            minValue = null;
            maxValue = null;
        }
        
        return (
            <input
                type="date"
                className="form-control"
                name={this.getFormName()}
                min={minValue}
                max={maxValue}
                required={this.isRequired()}/>
        );
    }
}