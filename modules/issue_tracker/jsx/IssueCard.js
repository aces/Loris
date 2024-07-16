import React, { useState } from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';

const IssueCard = React.memo(function IssueCard({
  issue,
  onUpdate,
  statuses,
  priorities,
  categories,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedIssue, setEditedIssue] = useState({
    title: issue[1],
    status: issue[6],
    priority: issue[7],
    category: issue[3] || ''
  });

  const handleInputChange = (field, value) => {
    setEditedIssue(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editedIssue.title.trim()) {
      swal.fire({
        title: 'Error!',
        text: 'Title cannot be empty',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    const formData = new FormData();

    formData.append('issueID', issue[0]);
    formData.append('title', editedIssue.title);
    formData.append('status', editedIssue.status);
    formData.append('priority', editedIssue.priority);
    // formData.append('category', editedIssue.category);

    fetch(`${loris.BaseURL}/issue_tracker/Edit/?issueID=${issue[0]}`, {
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
      swal.fire({
        title: 'Success!',
        text: 'Issue updated successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      onUpdate(issue[0], editedIssue);
      setIsEditing(false);
    }).catch((error) => {
      console.error('Error:', error);
      swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to update issue',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  };

  return (
    <div className="issue-card">
      <div className="issue-header">
        <h3>
          <a href={`/issue/${issue[0]}`}>Issue ID: {issue[0]}</a>
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
            <h4>{issue[1]}</h4>
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
          <p>{issue[2]}</p>
        </div>
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
  issue: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
  statuses: PropTypes.object.isRequired,
  priorities: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,
};

export default IssueCard;