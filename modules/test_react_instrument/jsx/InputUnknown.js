import InputBase from "./InputBase";

export default class InputUnknown extends InputBase {
  renderImpl() {
    return (
        <div>
            <strong style={{color: "#FF0000"}}>
                Unimplemented/Unknown Input
            </strong>
            <pre>{JSON.stringify(this.getMetadata(), null, "\t")}</pre>
        </div>
    );
  }
}
