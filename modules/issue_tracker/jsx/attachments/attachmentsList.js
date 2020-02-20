/**
 *  The following file handles displaying attachments
 *  for the issue being viewed in issue_tracker.
 *
 *  @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://github.com/aces/Loris
 */

import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import Modal from 'jsx/Modal';

/**
 * React component used to display
 * issue_tracker attachments list.
 */
class AttachmentsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attachments: this.props.attachments,
      showModalAttachmentDelete: false,
      deleteItem: {
        ID: '',
        file_name: '',
        file_hash: '',
      },
    };
    this.deleteAttachment = this.deleteAttachment.bind(this);
    this.openModalAttachmentDelete = this.openModalAttachmentDelete.bind(this);
    this.closeModalAttachmentDelete = this.closeModalAttachmentDelete.bind(this);
    this.displayAttachmentOptions = this.displayAttachmentOptions.bind(this);
  }

  /**
   * Sends DELETE request to "soft" delete
   * the attachment selected from the user.
   */
  deleteAttachment() {
    const state = Object.assign({}, this.state);
    const url = window.location.origin +
      '/issue_tracker/Attachment' +
      '?ID=' + state.deleteItem.ID;
    fetch(url,
      {
        credentials: 'same-origin',
        method: 'DELETE',
      }).then((resp) => {
      if (resp.headers.get('Content-Type').match(/application\/json/) == null) {
        throw resp.statusText;
      }
      return resp.json();
    })
      .then((data) => {
        if (data.success) {
          window.location.href = window.location.origin
            + '/issue_tracker/issue/'
            + this.props.issue;
        } else {
          swal('Permission denied', '', 'error');
        }
      }).catch((error) => {
        console.error(error);
      }
    );
  }

  /**
   * Confirm with the user about deleting the file.
   * @param {object} event - name of the form element
   */
  openModalAttachmentDelete(event) {
    event.preventDefault();
    const json = JSON.parse(event.target.getAttribute('value'));
    this.setState({
      showModalAttachmentDelete: true,
      deleteItem: json,
    });
  }

  /**
   * Used to signal closing the attachment
   * delete confirmation Modal.
   */
  closeModalAttachmentDelete() {
    this.setState({
      showModalAttachmentDelete: false,
    });
  }

  /**
   * Populates the attachment options.
   * @param {string} deleteData - name of the element if deleted.
   * @param {object} item - info of attachment.
   * @return {DOMRect} row - to display.
   */
  displayAttachmentOptions(deleteData, item) {
    if (loris.userHasPermission('issue_tracker_developer')
      || this.state.attachments.whoami === item.user) {
      return (
        <div className='row'>
          <div className='col-md-12'>
            <div className='col-md-2'><b>Attachment options: </b></div>
            <div className='col-md-10'>
              <a onClick={this.openModalAttachmentDelete}
                 value={deleteData}
                 style={{cursor: 'pointer'}}>
                Delete
              </a>&nbsp;&nbsp;|&nbsp;&nbsp;
              <a href={window.location.origin +
              '/issue_tracker/Attachment' +
              '?ID=' + item.ID +
              '&file_hash=' + item.file_hash +
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
      );
    }
    return (
      <div className='row'>
        <div className='col-md-12'>
          <div className='col-md-2'><b>Attachment options: </b></div>
          <div className='col-md-10'>
            <a href={window.location.origin +
            '/issue_tracker/Attachment' +
            '?ID=' + item.ID +
            '&file_hash=' + item.file_hash +
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
    );
  }

  render() {
    const footerCSS = {
      float: 'right',
      paddingRight: '100px',
    };
    const overflowCSS = {
      fontSize: '15pt',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    };
    const modalConfirmationDeleteAttachment = (
      <Modal
        title='Confirmation'
        onClose={this.closeModalAttachmentDelete}
        show={this.state.showModalAttachmentDelete}
      >
        <p style={overflowCSS}>
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
        attachmentsRows.unshift(
          <Fragment key={key}>
            <div className='row'>
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
            <div className='row'>
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
            {this.displayAttachmentOptions(deleteData, item)}
          </Fragment>
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
