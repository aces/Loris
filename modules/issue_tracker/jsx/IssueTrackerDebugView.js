import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import IssueCard from './IssueCard';
import Loader from 'Loader';
import '../css/issue_tracker_debug.css';

function IssueTrackerDebugView({ options }) {
  const [issues, setIssues] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [activeTab, setActiveTab] = useState('category');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const priorities = options.priorities || {};
  const statuses = options.statuses || {};
  const categories = options.categories || {};

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    filterIssues();
  }, [selectedCategories, selectedPriorities, selectedStatuses, issues]);

  async function fetchIssues() {
    try {
      const response = await fetch(`${loris.BaseURL}/issue_tracker/Edit/?debug=true`, {
        credentials: 'include', // This ensures cookies are sent with the request
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setIssues(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching issues:', error);
      setError('Failed to fetch issues. Please try again later.');
      setIsLoading(false);
    }
  }

  function filterIssues() {
    setFilteredIssues(issues.filter(issue => 
      (selectedCategories.length === 0 || selectedCategories.includes(issue.category)) &&
      (selectedPriorities.length === 0 || selectedPriorities.includes(issue.priority)) &&
      (selectedStatuses.length === 0 || selectedStatuses.includes(issue.status))
    ));
  }

  function toggleFilter(array, setArray, item) {
    setArray(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  }

  function handleIssueUpdate(issueId, updatedIssue) {
    const updatedIssues = issues.map(issue => {
      if (issue.issueID === issueId) {
        return { ...issue, ...updatedIssue };
      }
      return issue;
    });

    setIssues(updatedIssues);
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="issue-tracker-debug-view">
      <div className="filter-tabs">
        <button onClick={() => setActiveTab('category')} className={activeTab === 'category' ? 'active' : ''}>Category</button>
        <button onClick={() => setActiveTab('priority')} className={activeTab === 'priority' ? 'active' : ''}>Priority</button>
        <button onClick={() => setActiveTab('status')} className={activeTab === 'status' ? 'active' : ''}>Status</button>
      </div>
      <div className="filter-section">
        <h2>Selected {activeTab}</h2>
        <div className="filter-list">
          {activeTab === 'category' && Object.entries(categories).map(([value, label]) => (
            <label key={value}>
              <input 
                type="checkbox" 
                checked={selectedCategories.includes(value)}
                onChange={() => toggleFilter(selectedCategories, setSelectedCategories, value)}
                className="checkbox"
              />
              <span>{label}</span>
            </label>
          ))}
          {activeTab === 'priority' && Object.entries(priorities).map(([value, label]) => (
            <label key={value}>
              <input 
                type="checkbox" 
                checked={selectedPriorities.includes(value)}
                onChange={() => toggleFilter(selectedPriorities, setSelectedPriorities, value)}
                className="checkbox"
              />
              <span>{label}</span>
            </label>
          ))}
          {activeTab === 'status' && Object.entries(statuses).map(([value, label]) => (
            <label key={value}>
              <input 
                type="checkbox" 
                checked={selectedStatuses.includes(value)}
                onChange={() => toggleFilter(selectedStatuses, setSelectedStatuses, value)}
                className="checkbox"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
      <br/>
      <div className="issues-list">
        {filteredIssues.length > 0 ? (
          filteredIssues.map(issue => (
            <IssueCard
              key={issue.issueID}
              issue={issue}
              onUpdate={handleIssueUpdate}
              statuses={statuses}
              priorities={priorities}
              categories={categories}
            />
          ))
        ) : (
          <div className="no-results-message">No issues match the selected filters.</div>
        )}
      </div>
    </div>
  );
}

IssueTrackerDebugView.propTypes = {
  options: PropTypes.shape({
    priorities: PropTypes.object,
    statuses: PropTypes.object,
    categories: PropTypes.object,
  }).isRequired,
};

export default IssueTrackerDebugView;