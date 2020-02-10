/**
 * React component used to display
 * issue_tracker attachments list.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Modal from 'jsx/Modal';

class AttachmentsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attachments: this.props.attachments,
      showModalAttachmentDelete: false,
      deleteItem: {
        file_name: '',
        file_uuid: '',
      },
    };
    this.deleteAttachment = this.deleteAttachment.bind(this);
    this.openModalAttachmentDelete = this.openModalAttachmentDelete.bind(this);
    this.closeModalAttachmentDelete = this.closeModalAttachmentDelete.bind(this);
  }

  deleteAttachment() {
    const state = Object.assign({}, this.state);
    const url = window.location.origin +
      '/issue_tracker/ajax/Attachment.php' +
      '?action=delete' +
      '&uuid=' + state.deleteItem.file_uuid;
    fetch(url,
      {
        credentials: 'same-origin',
        method: 'DELETE',
      }).then((resp) => resp.json())
      .then((data) => {
        window.location.href = window.location.origin
          + '/issue_tracker/issue/'
          + this.props.issue;
      }).catch((error) => {
        console.error(error);
        this.setState({
          error: 'An error occurred when deleting attachment!\n Error: ' +
            error.status + ' (' + error.statusText + ')',
        });
      }
    );
  }

  openModalAttachmentDelete(event) {
    event.preventDefault();
    const json = JSON.parse(event.target.getAttribute('value'));
    this.setState({
      showModalAttachmentDelete: true,
      deleteItem: json,
    });
  }

  closeModalAttachmentDelete() {
    this.setState({
      showModalAttachmentDelete: false,
    });
  }

  render() {
    const footerCSS = {
      float: 'right',
      paddingRight: '100px',
    };
    const modalConfirmationDeleteAttachment = (
      <Modal
        title='Confirmation'
        onClose={this.closeModalAttachmentDelete}
        show={this.state.showModalAttachmentDelete}
      >
        <p style={{fontSize: '15pt'}}>
          Please confirm the request to delete the
          "{this.state.deleteItem.file_name}" attachment.
        </p>
        <div style={footerCSS}>
          <ButtonElement
            onUserInput={this.deleteAttachment}
            label={'Delete attachment'}
          />
        </div>
      </Modal>
    );

    let attachmentsRows = [];
    for (const key in this.state.attachments) {
      if (this.state.attachments.hasOwnProperty(key)) {
        const item = this.state.attachments[key];
        const deleteData = JSON.stringify(item);
        // Hide "soft" deleted attachments
        if (parseInt(item.deleted) === 1) {
          continue;
        }
        attachmentsRows.push(
          <>
            <div key={key + '_first'} className='row'>
              <hr/>
              <div className='col-md-3'>
                <div className='col-md-5'><b>Date of attachment: </b></div>
                <div className='col-md-7'>{item.date_added}</div>
              </div>
              <div className='col-md-8'>
                <div className='col-md-1'><b>File: </b></div>
                <div className='col-md-11'><i>{item.file_name}</i></div>
              </div>
            </div>
            <div key={key + '_second'} className='row'>
              <div className='col-md-3'>
                <div className='col-md-5'><b>User: </b></div>
                <div className='col-md-7'>{item.user}</div>
              </div>
              <div className='col-md-8'>
                {item.description ? (
                  <>
                    <div className='col-md-2'><b>Description: </b></div>
                    <div className='col-md-10'>{item.description}</div>
                  </>
                ) : null}
              </div>
            </div>
            <div key={key + '_third'} className='row'>
              <div className='col-md-12'>
                <div className='col-md-2'><b>Attachment options: </b></div>
                <div className='col-md-10'>
                  <a onClick={this.openModalAttachmentDelete}
                     value={deleteData}
                     style={{cursor: 'pointer'}}>
                    Delete
                  </a>&nbsp;&nbsp;|&nbsp;&nbsp;
                  <a href={window.location.origin +
                     '/issue_tracker/ajax/Attachment.php' +
                     '?action=download' +
                     '&uuid=' + item.file_uuid +
                     '&issue=' + this.props.issue +
                     '&filename=' + item.file_name +
                     '&mime_type=' + item.mime_type
                     }
                     download={true}
                     style={{cursor: 'pointer'}}>
                    Download
                  </a>
                </div>
              </div>
            </div>
          </>
        );
      }
    }
    const issueAttachments = attachmentsRows.length > 0 ? (
      <>
        <h3>Attachment History</h3>
          {attachmentsRows}
      </>
    ) : null;
    return (
      <div id='file-collection'>
        {modalConfirmationDeleteAttachment}
        {issueAttachments}
      </div>
    );
  }
}
AttachmentsList.propTypes = {
  issue: PropTypes.string.isRequired,
  attachments: PropTypes.array,
};
AttachmentsList.defaultProps = {
  attachments: [],
};

export default AttachmentsList;
