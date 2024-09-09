import React, { useState } from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';

const IssueCard = React.memo(function IssueCard({
  issue,
  onUpdate,
  statuses,
  priorities,
  categories,
  baseURL,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedIssue, setEditedIssue] = useState({...issue});

  const handleInputChange = (field, value) => {
    setEditedIssue(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editedIssue.title.trim()) {
      showAlertMessage('error', 'Title cannot be empty');
      return;
    }

    const formData = new FormData();

    Object.entries(editedIssue).forEach(([key, value]) => {
      formData.append(key, value === null ? "null" : value);
    });

    const hasChanges = Object.entries(editedIssue).some(([key, value]) => 
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
        return response.json().then(data => {
          throw new Error(data.error || 'Network response was not ok');
        });
      }
      return response.json();
    }).then((data) => {
      showAlertMessage('success', 'Issue updated successfully');
      onUpdate(issue.issueID, editedIssue);
      setIsEditing(false);
    }).catch((error) => {
      console.error('Error:', error);
      showAlertMessage('error', error.message || 'Failed to update issue');
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

  return (
    <div className="issue-card">
      <div className="issue-header">
        <div className="issue-title-section">
          <h3>
            <span className="issue-id">#{issue.issueID}</span>
            {isEditing ? (
              <input
                type="text"
                value={editedIssue.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="title-input"
              />
            ) : (
              <a href={`${loris.BaseURL}/issue_tracker/issue/${issue.issueID}`}>
                {issue.title}
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
      <form onSubmit={handleSubmit}>
        <div className="issue-controls">
          <select
            value={editedIssue.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            disabled={!isEditing}
          >
            {Object.entries(statuses).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select
            value={editedIssue.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            disabled={!isEditing}
          >
            {Object.entries(priorities).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select
            value={editedIssue.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            disabled={!isEditing}
          >
            <option value="">Uncategorized</option>
            {Object.entries(categories).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="issue-description">
        <label htmlFor="description" className="small">Description</label>
          {isEditing ? (
            <textarea
              value={editedIssue.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          ) : (
            <p>{issue.description}</p>
          )}
        </div>
        <br/>
        {!isEditing && (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Issue</button>
        )}
        {isEditing && (
          <div className="issue-actions">
            <button type="submit" className="btn btn-primary">Update Issue</button>
            <button type="button" className="btn btn-primary" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        )}
      </form>
    </div>
  );
});

IssueCard.propTypes = {
  issue: PropTypes.shape({
    issueID: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    reporter: PropTypes.string.isRequired,
    assignee: PropTypes.string,
    status: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    module: PropTypes.string,
    dateCreated: PropTypes.string.isRequired,
    lastUpdate: PropTypes.string,
    lastUpdatedBy: PropTypes.string,
    sessionID: PropTypes.string,
    centerID: PropTypes.string,
    candID: PropTypes.string,
    category: PropTypes.string,
    instrument: PropTypes.string,
    description: PropTypes.string,
    PSCID: PropTypes.string,
    visitLabel: PropTypes.string
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  statuses: PropTypes.object.isRequired,
  priorities: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,
  baseURL: PropTypes.string.isRequired,
};

export default IssueCard;