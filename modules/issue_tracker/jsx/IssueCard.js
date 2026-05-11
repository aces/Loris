import React, {useState} from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';
import Modal from 'jsx/Modal';
import {withTranslation, Trans} from 'react-i18next';
import '../css/issue_card.css';

const IssueCard = React.memo(function IssueCard(props) {
  const {t} = props;

  const {
    issue,
    onUpdate,
    statuses,
    priorities,
    categories,
    sites,
    assignees,
    otherWatchers,
  } = props;

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

    if (!tempEditedIssue.title || !tempEditedIssue.title.trim()) {
      showAlertMessage('error', t('Title cannot be empty',
        {ns: 'issue_tracker'}));
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
      showAlertMessage('info', t('No changes were made',
        {ns: 'issue_tracker'}));
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
      showAlertMessage('success', t('Issue updated successfully',
        {ns: 'issue_tracker'}));
      setEditedIssue(tempEditedIssue);
      onUpdate();
      setIsEditing(false);
    }).catch((error) => {
      console.error('Error:', error);
      showAlertMessage('error', error.message || t('Failed to update issue',
        {ns: 'issue_tracker'}));
      setTempEditedIssue({...editedIssue});
    });
  };

  const showAlertMessage = (msgType, message) => {
    let type = 'success';
    let title = t('Issue updated!', {ns: 'issue_tracker'});
    let text = message || '';
    let timer = null;
    let confirmation = true;

    if (msgType === 'error') {
      type = 'error';
      title = t('Error!', {ns: 'loris'});
    } else if (msgType === 'info') {
      type = 'info';
      title = t('Information', {ns: 'issue_tracker'});
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
      showAlertMessage('info', t('Please add a comment or make changes',
        {ns: 'issue_tracker'}));
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
        showAlertMessage('success', t('Issue updated successfully',
          {ns: 'issue_tracker'}));
        handleCloseAddCommentModal();
        onUpdate();
      })
      .catch((error) => {
        console.error('Error:', error);
        showAlertMessage('error', error.message ||
          t('Failed to add comment', {ns: 'issue_tracker'}));
      });
  };

  const description = editedIssue.description || '';

  return (
    <div className="issue-card">
      <Modal
        title={t('Add New Comment', {ns: 'issue_tracker'})}
        onClose={handleCloseAddCommentModal}
        show={showAddCommentModal}
      >
        <form onSubmit={handleAddCommentSubmit} className="add-comment-form">
          <div className="form-group">
            <label htmlFor="newComment" className="small">
              {t('Comment', {ns: 'issue_tracker'})}
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
              {t('Assignee', {ns: 'issue_tracker'})}
            </label>
            <select
              id="newAssignee"
              value={newAssignee}
              onChange={handleNewAssigneeChange}
              className="form-control"
              disabled={isSubmittingComment}
            >
              <option value="">{t('Unassigned', {ns: 'issue_tracker'})}</option>
              {Object.entries(assignees).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="newWatchers" className="small">
              {t('Watchers', {ns: 'issue_tracker'})}
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
              {isSubmittingComment ? t('Submitting...', {ns: 'issue_tracker'}) :
                t('Submit Comment', {ns: 'issue_tracker'})}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseAddCommentModal}
              disabled={isSubmittingComment}
            >
              {t('Cancel', {ns: 'loris'})}
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
          <span>{t('Created', {ns: 'issue_tracker'})}:
            {issue.dateCreated}</span>
          <span>{t('Last Updated', {ns: 'issue_tracker'})}:
            {issue.lastUpdate}</span>
          <span>{t('Assignee', {ns: 'issue_tracker'})}:
            {issue.assignee || t('None',
              {ns: 'loris'})}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="issue-form">
        <div className="issue-controls">
          {isEditing ? (
            <>
              <div className="control-group">
                <label htmlFor="status">
                  {t('Status', {ns: 'loris'})}:&nbsp;
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
                  {t('Priority', {ns: 'issue_tracker'})}:&nbsp;
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
                  {t('Category', {ns: 'issue_tracker'})}:&nbsp;
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
                  {t('Site', {ns: 'loris', count: 1})}:&nbsp;
                </label>
                <select
                  id="centerID"
                  value={tempEditedIssue.centerID || ''}
                  onChange={(e) =>
                    handleInputChange('centerID',
                      e.target.value)
                  }
                >
                  <option value="">
                    All Sites
                  </option>
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
                <label>{t('Status', {ns: 'loris'})}:&nbsp;</label>
                <span>
                  {statuses[tempEditedIssue.status] ||
                    tempEditedIssue.status}
                </span>
              </div>
              <div className="control-group">
                <label>{t('Priority', {ns: 'issue_tracker'})}:&nbsp;</label>
                <span>
                  {priorities[tempEditedIssue.priority] ||
                    tempEditedIssue.priority}
                </span>
              </div>
              <div className="control-group">
                <label>{t('Category', {ns: 'issue_tracker'})}:&nbsp;</label>
                <span>
                  {categories[tempEditedIssue.category] ||
                    'Uncategorized'}
                </span>
              </div>
              <div className="control-group">
                <label>{t('Site', {ns: 'loris', count: 1})}:&nbsp;</label>
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
            <label htmlFor="description" className="small">{t('Description',
              {ns: 'issue_tracker'})}</label>
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
                <p className="description-text">
                  {description}</p>
              </div>
            )}
          </div>
          <div className="comments-section">
            <label className="small">{t('Last 3 Comments',
              {ns: 'issue_tracker'})}</label>
            <div className="comments-container">
              {issue.topComments.length > 0 ? (
                issue.topComments.map((comment, index) => (
                  <div key={index} className="comment">
                    <p className="comment-text">
                      {comment.issueComment}</p>
                    <span className="comment-meta">
                      <Trans
                        ns="issue_tracker"
                        defaults="Updated by <0>{{user}}</0> on {{date}}"
                        components={[<span />]}
                        values={{
                          user: comment.addedBy,
                          date: comment.dateAdded,
                        }}
                      />
                    </span>
                  </div>
                ))
              ) : (
                <p className="no-comments">{t('No comments available.',
                  {ns: 'issue_tracker'})}</p>
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
              {t('Edit Issue', {ns: 'issue_tracker'})}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleOpenAddCommentModal}
            >
              {t('Add Comment', {ns: 'issue_tracker'})}
            </button>
          </div>
        )}
        {isEditing && (
          <div className="issue-actions">
            <button
              type="submit"
              className="btn btn-primary"
            >
              {t('Update Issue', {ns: 'issue_tracker'})}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsEditing(false);
                setTempEditedIssue({...editedIssue});
              }}
            >
              {t('Cancel', {ns: 'loris'})}
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
  t: PropTypes.func,
};

export default withTranslation(['issue_tracker', 'loris'])(IssueCard);
