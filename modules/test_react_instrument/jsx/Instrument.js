import InputUtil from "./InputUtil";

export default class Instrument extends React.Component {
    constructor (props) {
        super(props);
    }
    getInputMetadata (i) {
        return this.props.metadata.Elements[i];
    }
    getInputMetadataCount (i) {
        return this.props.metadata.Elements.length;
    }
    render () {
        const inputArr = [];
        for (let i=0; i < this.getInputMetadataCount(); ++i) {
            const cur = this.getInputMetadata(i);
            inputArr.push(InputUtil.renderInput(cur, i%2 == 0));
        }
        return (
            <div className="panel">
                {inputArr}
            </div>
        );
    }
}