import React, {useState} from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';
import Modal from 'jsx/Modal';
import '../css/issue_card.css';

const IssueCard = React.memo(function IssueCard({
  issue,
  onUpdate,
  statuses,
  priorities,
  categories,
  sites,
  assignees,
  otherWatchers,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedIssue, setEditedIssue] = useState({...issue});
  const [tempEditedIssue, setTempEditedIssue] = useState({...issue});

  // State variables for adding comments
  const [showAddCommentModal, setShowAddCommentModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [newAssignee, setNewAssignee] = useState(issue.assignee || '');
  const [newWatchers, setNewWatchers] = useState(issue.othersWatching || []);

  const handleInputChange = (field, value) => {
    setTempEditedIssue((prev) => ({
      ...prev,
      [field]: value === '' ? null : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!tempEditedIssue.title.trim()) {
      showAlertMessage('error', 'Title cannot be empty');
      return;
    }

    const formData = new FormData();

    Object.entries(tempEditedIssue).forEach(([key, value]) => {
      formData.append(key, value === null ? 'null' : value);
    });

    const hasChanges = Object.entries(tempEditedIssue).some(([key, value]) =>
      value !== issue[key]
    );

    if (!hasChanges) {
      showAlertMessage('info', 'No changes were made');
      return;
    }

    fetch(`${loris.BaseURL}/issue_tracker/Edit/`, {
      method: 'POST',
      body: formData,
    }).then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.error || 'Network response was not ok');
        });
      }
      return response.json();
    }).then((data) => {
      showAlertMessage('success', 'Issue updated successfully');
      setEditedIssue(tempEditedIssue);
      onUpdate();
      setIsEditing(false);
    }).catch((error) => {
      console.error('Error:', error);
      showAlertMessage('error', error.message || 'Failed to update issue');
      setTempEditedIssue({...editedIssue});
    });
  };

  const showAlertMessage = (msgType, message) => {
    let type = 'success';
    let title = 'Issue updated!';
    let text = message || '';
    let timer = null;
    let confirmation = true;

    if (msgType === 'error') {
      type = 'error';
      title = 'Error!';
    } else if (msgType === 'info') {
      type = 'info';
      title = 'Information';
    }

    swal.fire({
      title: title,
      type: type,
      text: text,
      timer: timer,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: confirmation,
    });
  };

  const handleOpenAddCommentModal = () => {
    setNewAssignee(issue.assignee || '');
    setNewWatchers(issue.othersWatching || []);
    setShowAddCommentModal(true);
  };

  const handleCloseAddCommentModal = () => {
    setShowAddCommentModal(false);
    setNewComment('');
    setNewAssignee(issue.assignee || '');
    setNewWatchers(issue.othersWatching || []);
  };

  const handleAddCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleNewAssigneeChange = (e) => {
    setNewAssignee(e.target.value);
  };

  const handleNewWatchersChange = (e) => {
    const options = e.target.options;
    const selectedWatchers = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedWatchers.push(options[i].value);
      }
    }
    setNewWatchers(selectedWatchers);
  };

  const handleAddCommentSubmit = (e) => {
    e.preventDefault();

    const trimmedComment = newComment.trim();
    const hasAssigneeChanged = newAssignee !== issue.assignee;
    const hasWatchersChanged = JSON.stringify(newWatchers) !==
      JSON.stringify(issue.othersWatching);
    if (!trimmedComment && !hasAssigneeChanged && !hasWatchersChanged) {
      showAlertMessage('info', 'Please add a comment or make changes');
      return;
    }

    setIsSubmittingComment(true);

    const formData = new FormData();

    // Prefill all existing issue fields to prevent NULL updates
    Object.entries(tempEditedIssue).forEach(([key, value]) => {
      formData.append(key, value === null ? 'null' : value);
    });

    // Only append comment if it's not empty
    if (trimmedComment) {
      formData.append('comment', newComment.trim());
    }

    formData.append('assignee', newAssignee || 'null');
    formData.append(
      'othersWatching',
      newWatchers.length > 0 ? newWatchers.join(',') : ''
    );

    fetch(`${loris.BaseURL}/issue_tracker/Edit/`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        setIsSubmittingComment(false);
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || 'Network response was not ok');
          });
        }
        return response.json();
      })
      .then((data) => {
        showAlertMessage('success', 'Issue updated successfully');
        handleCloseAddCommentModal();
        onUpdate();
      })
      .catch((error) => {
        console.error('Error:', error);
        showAlertMessage('error', error.message || 'Failed to add comment');
      });
  };

  const description = editedIssue.description || '';

  return (
    <div className="issue-card">
      <Modal
        title="Add New Comment"
        onClose={handleCloseAddCommentModal}
        show={showAddCommentModal}
      >
        <form onSubmit={handleAddCommentSubmit} className="add-comment-form">
          <div className="form-group">
            <label htmlFor="newComment" className="small">
              Comment
            </label>
            <textarea
              id="newComment"
              value={newComment}
              onChange={handleAddCommentChange}
              className="textarea"
              disabled={isSubmittingComment}
            />
          </div>
          <div className="form-group">
            <label htmlFor="newAssignee" className="small">
              Assignee
            </label>
            <select
              id="newAssignee"
              value={newAssignee}
              onChange={handleNewAssigneeChange}
              className="form-control"
              disabled={isSubmittingComment}
            >
              <option value="">Unassigned</option>
              {Object.entries(assignees).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="newWatchers" className="small">
              Watchers
            </label>
            <select
              id="newWatchers"
              value={newWatchers}
              onChange={handleNewWatchersChange}
              className="form-control"
              multiple
              disabled={isSubmittingComment}
            >
              {Object.entries(otherWatchers).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmittingComment}
            >
              {isSubmittingComment ? 'Submitting...' : 'Submit Comment'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseAddCommentModal}
              disabled={isSubmittingComment}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
      <div className="issue-header">
        <div className="issue-title-section">
          <h3>
            <span className="issue-id">#{issue.issueID}</span>
            {isEditing ? (
              <input
                type="text"
                value={tempEditedIssue.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="title-input"
              />
            ) : (
              <a href={`${loris.BaseURL}/issue_tracker/issue/${issue.issueID}`}>
                {editedIssue.title}
              </a>
            )}
          </h3>
        </div>
        <div className="issue-dates">
          <span>Created: {issue.dateCreated}</span>
          <span>Last Updated: {issue.lastUpdate}</span>
          <span>Assignee: {issue.assignee || 'None'}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="issue-form">
        <div className="issue-controls">
          {isEditing ? (
            <>
              <div className="control-group">
                <label htmlFor="status">
                  Status:&nbsp;
                </label>
                <select
                  id="status"
                  value={tempEditedIssue.status}
                  onChange={(e) =>
                    handleInputChange('status', e.target.value)
                  }
                >
                  {Object.entries(statuses).map(([value, label]) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="control-group">
                <label htmlFor="priority">
                  Priority:&nbsp;
                </label>
                <select
                  id="priority"
                  value={tempEditedIssue.priority}
                  onChange={(e) =>
                    handleInputChange('priority', e.target.value)
                  }
                >
                  {Object.entries(priorities).map(([value, label]) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="control-group">
                <label htmlFor="category">
                  Category:&nbsp;
                </label>
                <select
                  id="category"
                  value={tempEditedIssue.category}
                  onChange={(e) =>
                    handleInputChange('category', e.target.value)
                  }
                >
                  <option value="">
                    Uncategorized
                  </option>
                  {Object.entries(categories).map(([value, label]) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="control-group">
                <label htmlFor="centerID">
                  Site:&nbsp;
                </label>
                <select
                  id="centerID"
                  value={tempEditedIssue.centerID || ''}
                  onChange={(e) =>
                    handleInputChange('centerID', e.target.value)
                  }
                >
                  <option value="">All Sites</option>
                  {Object.entries(sites).map(([id, name]) => (
                    <option
                      key={id}
                      value={id}
                    >
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="control-group">
                <label>Status:&nbsp;</label>
                <span>
                  {statuses[tempEditedIssue.status] ||
                    tempEditedIssue.status}
                </span>
              </div>
              <div className="control-group">
                <label>Priority:&nbsp;</label>
                <span>
                  {priorities[tempEditedIssue.priority] ||
                    tempEditedIssue.priority}
                </span>
              </div>
              <div className="control-group">
                <label>Category:&nbsp;</label>
                <span>
                  {categories[tempEditedIssue.category] ||
                    'Uncategorized'}
                </span>
              </div>
              <div className="control-group">
                <label>Site:&nbsp;</label>
                <span>
                  {sites[String(tempEditedIssue.centerID)] ||
                    'All Sites'}
                </span>
              </div>
            </>
          )}
        </div>
        <div className="issue-content">
          <div className="description-section">
            <label htmlFor="description" className="small">Description</label>
            {isEditing ? (
              <textarea
                value={tempEditedIssue.description || ''}
                onChange={
                  (e) => handleInputChange('description', e.target.value)
                }
                className="textarea"
              />
            ) : (
              <div className="description-container">
                <p className="description-text">{description}</p>
              </div>
            )}
          </div>
          <div className="comments-section">
            <label className="small">Last 3 Comments</label>
            <div className="comments-container">
              {issue.topComments.length > 0 ? (
                issue.topComments.map((comment, index) => (
                  <div key={index} className="comment">
                    <p className="comment-text">{comment.issueComment}</p>
                    <span className="comment-meta">
                      {comment.addedBy} on {comment.dateAdded}
                    </span>
                  </div>
                ))
              ) : (
                <p className="no-comments">No comments available.</p>
              )}
            </div>
          </div>
        </div>
        <br />
        {!isEditing && (
          <div className="issue-actions">
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Issue
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleOpenAddCommentModal}
            >
              Add Comment
            </button>
          </div>
        )}
        {isEditing && (
          <div className="issue-actions">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Update Issue
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsEditing(false);
                setTempEditedIssue({...editedIssue});
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
});

IssueCard.propTypes = {
  issue: PropTypes.shape({
    issueID: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    reporter: PropTypes.string.isRequired,
    assignee: PropTypes.string,
    othersWatching: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    module: PropTypes.number,
    dateCreated: PropTypes.string.isRequired,
    lastUpdate: PropTypes.string,
    lastUpdatedBy: PropTypes.string,
    sessionID: PropTypes.number,
    centerID: PropTypes.number,
    candID: PropTypes.number,
    category: PropTypes.string,
    instrument: PropTypes.string,
    description: PropTypes.string,
    PSCID: PropTypes.string,
    visitLabel: PropTypes.string,
    topComments: PropTypes.arrayOf(
      PropTypes.shape({
        issueComment: PropTypes.string.isRequired,
        dateAdded: PropTypes.string.isRequired,
        addedBy: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  statuses: PropTypes.object.isRequired,
  priorities: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,
  sites: PropTypes.object.isRequired,
  assignees: PropTypes.object.isRequired,
  otherWatchers: PropTypes.object.isRequired,
};

export default IssueCard;
