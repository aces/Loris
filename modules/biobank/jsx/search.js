import React, {PureComponent} from 'react';
import Modal from 'Modal';

class Search extends PureComponent {
  constructor() {
    super();
    this.state = {barcode: null};
  }

  render() {
    const onInput = (name, value) => {
      this.setState({barcode: value});
      if (Object.values(this.props.barcodes).find((barcode) => barcode == value)) {
        this.props.history.push(`/barcode=${value}`);
        this.props.onClose();
      }
    };
    return (
      <Modal
        title={this.props.title}
        show={this.props.show}
        onClose={this.props.onClose}
        throwWarning={false}
      >
        <FormElement>
          <TextboxElement
            name='barcode'
            label='Barcode'
            value={this.state.barcode}
            options={this.props.barcodes}
            onUserInput={onInput}
            placeHolder='Please Scan or Type Barcode'
            autoFocus={true}
          />
        </FormElement>
      </Modal>
    );
  }
}

Search.propTypes = {

};

Search.defaultProps = {

};

export default Search;
