/**
 * React component used to display
 * issue_tracker attachments list.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

class FileCollectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attachments: this.props.attachments,
    };
    this.deleteAttachment = this.deleteAttachment.bind(this);
  }

  deleteAttachment(event) {
    const uuid = event.target.getAttribute('value');
    const url = window.location.origin +
      '/issue_tracker/ajax/Attachment.php' +
      '?action=delete' +
      '&uuid=' + uuid;
    $.ajax(url, {
      dataType: 'json',
      success: function(data) {
        console.log('data is:');
        console.log(data);
      },
      error: function(err) {
        this.setState({
          error: 'An error occurred when deleting attachment!\n Error: ' +
            err.status + ' (' + err.statusText + ')',
        });
      }.bind(this),
    });
  }

  render() {
    let attachmentsRows = [];
    for (const key in this.state.attachments) {
      if (this.state.attachments.hasOwnProperty(key)) {
        const item = this.state.attachments[key];
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
                  <a onClick={this.deleteAttachment}
                     value={item.file_uuid}
                     style={{cursor: 'pointer'}}>
                    Delete
                  </a>&nbsp;&nbsp;|&nbsp;&nbsp;
                  <a href={window.location.origin +
                     '/issue_tracker/ajax/Attachment.php' +
                     '?action=download' +
                     '&uuid=' + item.file_uuid +
                     '&issue=' + this.props.issue +
                     '&filename=' + item.file_name
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
        {issueAttachments}
      </div>
    );
  }
}
FileCollectionList.propTypes = {
  issue: PropTypes.string.isRequired,
  attachments: PropTypes.array,
};
FileCollectionList.defaultProps = {
  attachments: [],
};

export default FileCollectionList;
