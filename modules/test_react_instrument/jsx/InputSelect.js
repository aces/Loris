import InputBase from "./InputBase";

export default class InputSelect extends InputBase {
  getErrorsImpl() {
    const result = [];
    const valueArr = this.getValueArray();
    if (valueArr.length === 0) {
      result.push("There are no values");
    } else {
      let hasNonEmpty = false;
      for (let i = 0; i < valueArr.length; ++i) {
        if (valueArr[i].value !== "") {
          hasNonEmpty = true;
          break;
        }
      }
      if (!hasNonEmpty) {
        result.push("There are only empty values");
      }
    }
    return result;
  }
  renderOptions() {
    const result = [];
    const valueArr = this.getValueArray();
    for (let i = 0; i < valueArr.length; ++i) {
      const cur = valueArr[i];
      result.push(
                <option key={cur.value} value={cur.value}>{cur.text}</option>
            );
    }
    return result;
  }
  renderImpl() {
    return (
            <select
                className="form-control"
                name={this.getFormName()}
                required={this.isRequired()}
            >
                {this.renderOptions()}
            </select>
        );
  }
}
