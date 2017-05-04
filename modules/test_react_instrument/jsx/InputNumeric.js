import InputBase from "./InputBase";

export default class InputNumeric extends InputBase {
  getErrorsImpl() {
    const result = [];
    const minValue = this.getOption("MinValue", null);
    const maxValue = this.getOption("MaxValue", null);
    if (
        minValue !== null && minValue !== undefined &&
        maxValue !== null && maxValue !== undefined &&
        minValue >= maxValue
    ) {
      result.push("Rule min >= max, this will not be enforced");
    }
    return result;
  }
  renderImpl() {
    const numberType = this.getOption("NumberType", "integer");
    let minValue = this.getOption("MinValue", null);
    let maxValue = this.getOption("MaxValue", null);
    if (
        minValue !== null && minValue !== undefined &&
        maxValue !== null && maxValue !== undefined &&
        minValue >= maxValue
    ) {
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
    }
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
