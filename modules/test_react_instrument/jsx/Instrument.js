export default class Instrument extends React.Component {
    constructor (props) {
        super(props);
    }
    getInputMetadata (i) {
        return this.props.data[i];
    }
    getInputMetadataCount (i) {
        return this.props.data.length;
    }
    renderInput (inputMetadata) {
    }
    render () {
        const inputArr = [];
        for (let i=0; i < this.getInputMetadataCount(); ++i) {
            const cur = this.getInputMetadata(i);
            inputArr.push(this.renderInput(cur));
        }
        return (
            <div>
                {inputArr}
            </div>
        );
    }
}