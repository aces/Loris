export default class InputBase extends React.Component {
  renderImpl() {
    return null;
  }
  getErrorsImpl() {
    return null;
  }
  getMetadata() {
    return this.props.metadata;
  }
  getType() {
    return this.props.metadata.Type;
  }
  getFormName() {
    return this.props.metadata.Name;
  }
  getDescription() {
    return this.props.metadata.Description;
  }
  getChildArray() {
    const raw = this.props.metadata.Elements;
    return (raw === null || raw === undefined) ?
            [] : raw;
  }
  getOption(key, def) {
    const result = this.props.metadata.Options[key];
    return (result === null || result === undefined) ?
            def : result;
  }
  isRequired() {
    return this.getOption("RequireResponse", true);
  }
  isMultiselect() {
    return this.getOption("AllowMultiple", false);
  }
  getValueArray() {
    const raw = this.getOption("Values", {});
    const result = [];
    for (let key in raw) {
      if (raw.hasOwnProperty(key)) {
        result.push({
          value: key,
          text: raw[key]
        });
      }
    }
    return result;
  }
  getCurBg() {
    return this.props.altBg ? "#FAFAFF" : "#FFFFFF";
  }
  renderErrors() {
    const errors = this.getErrorsImpl();
    if (errors === null || errors === undefined || errors.length === 0) {
      return null;
    }
    const arr = [];
    for (let i = 0; i < errors.length; ++i) {
      const cur = errors[i];
      arr.push(
        <span key={i} className="label label-warning">{cur}</span>
      );
    }
    return (
        <div className="col-lg-12" style={{margin: "10px"}}>
            {arr}
        </div>
    );
  }
  render() {
    return (
        <div className="row" style={{
          padding: "10px",
          backgroundColor: this.getCurBg()
        }}>
            <div className="col-lg-4">
                {this.getDescription()}
                {this.renderErrors()}
            </div>
            <div className="col-lg-8">{this.renderImpl()}</div>
        </div>
    );
  }
}
