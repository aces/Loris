import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import IssueCard from './IssueCard';
import '../css/issue_card.css';

function IssueTrackerDetailView({ issues, options, baseURL }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [activeTab, setActiveTab] = useState('category');

  const priorities = options.priorities || {};
  const statuses = options.statuses || {};
  const categories = options.categories || {}; // Use categories from options

  useEffect(() => {
    filterIssues();
  }, [selectedCategories, selectedPriorities, selectedStatuses, issues]);

  function filterIssues() {
    setFilteredIssues(issues.filter(issue => 
      (selectedCategories.length === 0 || selectedCategories.includes(issue[3])) && // Update index to 3 for category
      (selectedPriorities.length === 0 || selectedPriorities.includes(issue[7])) &&
      (selectedStatuses.length === 0 || selectedStatuses.includes(issue[6]))
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
      if (issue[0] === issueId) {
        return [
          issue[0],
          updatedIssue.title,
          issue[2], // module remains unchanged
          updatedIssue.category,
          issue[4], // reporter remains unchanged
          issue[5], // assignee remains unchanged
          updatedIssue.status,
          updatedIssue.priority,
          ...issue.slice(8)
        ];
      }
      return issue;
    });

    setFilteredIssues(updatedIssues);
  }

  
  return (
    <div className="issue-tracker-detail-view">
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
              />
              {label}
            </label>
          ))}
          {activeTab === 'priority' && Object.entries(priorities).map(([value, label]) => (
            <label key={value}>
              <input 
                type="checkbox" 
                checked={selectedPriorities.includes(value)}
                onChange={() => toggleFilter(selectedPriorities, setSelectedPriorities, value)}
              />
              {label}
            </label>
          ))}
          {activeTab === 'status' && Object.entries(statuses).map(([value, label]) => (
            <label key={value}>
              <input 
                type="checkbox" 
                checked={selectedStatuses.includes(value)}
                onChange={() => toggleFilter(selectedStatuses, setSelectedStatuses, value)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>
      <div className="issues-list">
        {filteredIssues.map(issue => (
          <IssueCard 
            key={issue[0]} 
            issue={issue} 
            onUpdate={handleIssueUpdate}
            statuses={statuses}
            priorities={priorities}
            categories={categories}
          />
        ))}
      </div>
    </div>
  );
}

IssueTrackerDetailView.propTypes = {
  issues: PropTypes.arrayOf(PropTypes.array).isRequired,
  options: PropTypes.shape({
    priorities: PropTypes.object,
    statuses: PropTypes.object,
    categories: PropTypes.object,
  }).isRequired,
};

export default IssueTrackerDetailView;