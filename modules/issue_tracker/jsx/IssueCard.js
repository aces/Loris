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

    // Append all fields to the form data
    Object.entries(editedIssue).forEach(([key, value]) => {
      formData.append(key, value === null ? "null" : value);
    });

    // Check if there are any changes
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

  const showAlertMessage = (type, message) => {
    swal.fire({
      title: type === 'success' ? 'Success!' : 'Error!',
      text: message,
      icon: type,
      confirmButtonText: 'OK'
    });
  };

  return (
    <div className="issue-card">
      <div className="issue-header">
        <h3>
          <a href={`${loris.BaseURL}/issue_tracker/issue/${issue.issueID}`}>Issue ID: {issue.issueID}</a>
        </h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="issue-title">
          {isEditing ? (
            <input
              type="text"
              value={editedIssue.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          ) : (
            <h4>{issue.title}</h4>
          )}
        </div>
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
          {isEditing ? (
            <textarea
              value={editedIssue.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          ) : (
            <p>{issue.description}</p>
          )}
        </div>
        {/* <div className="issue-assignee">
          <p>Assignee: {issue.assignee}</p>
        </div>
        <div className="issue-dates">
          <p>Created: {issue.dateCreated}</p>
          <p>Last Updated: {issue.lastUpdate}</p>
        </div> */}
        {isEditing ? (
          <>
            <button type="submit">Update Issue</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <button type="button" onClick={() => setIsEditing(true)}>Edit Issue</button>
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