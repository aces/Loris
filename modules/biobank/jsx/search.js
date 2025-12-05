import React, {PureComponent} from 'react';
import {withTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import Modal from 'Modal';
import {FormElement, TextboxElement} from 'jsx/Form';

/**
 * Provides a modal window that can be used to search barcodes
 */
class Search extends PureComponent {
  /**
   * Constructor
   */
  constructor() {
    super();
    this.state = {barcode: null};
  }

  /**
   * Render React component
   *
   * @return {JSX}
   */
  render() {
    const onInput = (name, value) => {
      this.setState({barcode: value});
      if (Object.values(this.props.barcodes)
        .find((barcode) => barcode == value)
      ) {
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
            label={t('Barcode')}
            value={this.state.barcode}
            options={this.props.barcodes}
            onUserInput={onInput}
            placeHolder={t('Please Scan or Type Barcode')}
            autoFocus={true}
          />
        </FormElement>
      </Modal>
    );
  }
}

// Search.propTypes
Search.propTypes = {
  barcodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
};

export default withTranslation(['biobank', 'loris'])(Search);
