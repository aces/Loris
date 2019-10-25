/**
 * React component used to display a button and a collapsible list
 * with attachments.
 */
import React, {Component} from 'react';

class FileCollectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attachments: this.props.attachments,
    };
  }

  render() {
    let attachmentsRows = [];
    // eslint-disable-next-line guard-for-in
    for (const key in this.state.attachments) {
      if (this.state.attachments.hasOwnProperty(key)) {
        const item = this.state.attachments[key];
        console.log(item);
        attachmentsRows.push(
          <>
            <div key={key} className='row'>
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
                <a href={window.location.origin +
                    '/issue_tracker/ajax/EditIssue.php?action=' +
                    'deleteAttachment&uuid=' +
                    item.file_uuid
                  } style={{paddingLeft: '20px'}}>
                  Delete attachment
                </a> |&nbsp;
                <a href={window.location.origin +
                    '/issue_tracker/ajax/EditIssue.php?action=' +
                    'downloadAttachment&uuid=' +
                    item.file_uuid
                  }>
                  Download file
                </a>
              </div>
            </div>
          </>
        );
      }
    }
    const issueAttachments = (
      <div>
        {attachmentsRows}
      </div>
    );

    return (
      <div id='file-collection'>
        <h3>Attachment History</h3>
        {issueAttachments}
      </div>
    );
  }
}

export default FileCollectionList;
