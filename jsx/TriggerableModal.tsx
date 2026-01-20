import React, {useState, ElementType} from 'react';
import Modal, {ModalProps} from 'Modal';
import Form from 'jsx/Form';

interface TriggerableModalProps extends Omit<ModalProps, 'show' | 'onClose'> {
  label: string; // Label for the default CTA trigger button
  onClose?: ModalProps['onClose'];
  onUserInput?: () => void; // Optional callback when the trigger is activated
  TriggerTag?: ElementType; // Custom component for the modal trigger
  type?: 'primary' | 'secondary'
  disabled?: boolean;
  tooltip?: string;
}

/**
 * TriggerableModal Component
 *
 * Renders a modal triggered by a custom or default CTA component, with `show`
 * controlled internally.
 *
 * @param root0 - props
 * @param root0.label - Label for the default CTA trigger button
 * @param root0.onUserInput - Optional callback when the trigger is activated
 * @param root0.TriggerTag - Custom component for the modal trigger
 * @param root0.disabled - disabled state of trigger
 * @param root0.tooltip - tooltip for trigger
 */
const TriggerableModal = ({
  label,
  onUserInput,
  TriggerTag = Form.CTA, // Default trigger component is CTA
  disabled = false, // Destructure with default
  tooltip = '', // Destructure with default
  type = 'primary',
  ...modalProps // Spread other modal-related props to pass to Modal
}: TriggerableModalProps) => {
  const [open, setOpen] = useState(false);

  /**
   * Handles closing the modal by updating the state and calling the optional
   * `onClose` callback provided in props.
   */
  const handleClose = () => {
    setOpen(false);
    modalProps.onClose?.(); // Call onClose if it exists
  };

  /**
   * Trigger element to open the modal. Uses `TriggerTag` for a custom
   * trigger component, defaults to CTA.
   */
  const trigger = (
    <TriggerTag
      label={label}
      title={tooltip}
      disabled={disabled}
      type={type}
      onUserInput={() => {
        onUserInput?.(); // Call onUserInput if it exists
        setOpen(true); // Open the modal
      }}
    />
  );

  return (
    <>
      {trigger}
      <Modal {...modalProps} show={open} onClose={handleClose} />
    </>
  );
};

export default TriggerableModal;
