import React, {useState} from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';
import '../css/issue_card.css';

const IssueCard = React.memo(function IssueCard({
  issue,
  onUpdate,
  statuses,
  priorities,
  categories,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedIssue, setEditedIssue] = useState({...issue});
  const [tempEditedIssue, setTempEditedIssue] = useState({...issue});

  const handleInputChange = (field, value) => {
    setTempEditedIssue((prev) => ({
      ...prev,
      [field]: value,
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
      onUpdate(issue.issueID, tempEditedIssue);
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

  const description = editedIssue.description || '';

  return (
    <div className="issue-card">
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
          <span>Assignee: {issue.assignee}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="issue-form">
        <div className="issue-controls">
          <select
            value={tempEditedIssue.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            disabled={!isEditing}
          >
            {Object.entries(statuses).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select
            value={tempEditedIssue.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            disabled={!isEditing}
          >
            {Object.entries(priorities).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select
            value={tempEditedIssue.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            disabled={!isEditing}
          >
            <option value="">Uncategorized</option>
            {Object.entries(categories).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
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
          <button
          className="btn btn-primary"
          onClick={() => setIsEditing(true)}
        >
          Edit Issue
        </button>
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
              className="btn btn-primary"
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
};

export default IssueCard;
