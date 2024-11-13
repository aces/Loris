import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import IssueCard from './IssueCard';
import Loader from 'Loader';
import PaginationLinks from 'jsx/PaginationLinks';
import Panel from 'jsx/Panel';
import {Tabs, TabPane} from 'jsx/Tabs';
import '../css/issue_tracker_batchmode.css';

/**
 * IssueTrackerBatchMode component
 *
 * @param {object} props - The component props
 * @param {object} props.options - The options for the IssueTrackerBatchMode
 */
function IssueTrackerBatchMode({options}) {
  const [issues, setIssues] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [page, setPage] = useState({
    number: 1,
    rows: 10,
  });

  const priorities = options.priorities || {};
  const statuses = options.statuses || {};
  const categories = options.categories || {};
  const sites = options.sites || {};

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    filterIssues();
  }, [
    selectedCategories,
    selectedPriorities,
    selectedStatuses,
    selectedSites,
    issues,
  ]);

  /**
   * Fetches issues from the server
   */
  async function fetchIssues() {
    try {
      const response = await fetch(
        `${loris.BaseURL}/issue_tracker/Edit/?batch=true`,
        {
          credentials: 'include', // This ensures cookies are sent with the request
        }
      );
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

  /**
   * Filters issues based on selected categories, priorities, and statuses
   */
  function filterIssues() {
    setFilteredIssues(issues.filter((issue) =>
      (selectedCategories.length === 0 ||
        selectedCategories.includes(issue.category)) &&
      (selectedPriorities.length === 0 ||
        selectedPriorities.includes(issue.priority)) &&
      (selectedStatuses.length === 0 ||
        selectedStatuses.includes(issue.status)) &&
      (selectedSites.length === 0 ||
        selectedSites.includes(String(issue.centerID)))
    ));
  }

  /**
   * Toggles a filter item in the given array
   *
   * @param {Array} array - The current array of selected items
   * @param {Function} setArray - The state setter function for the array
   * @param {*} item - The item to toggle in the array
   */
  function toggleFilter(array, setArray, item) {
    setArray((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  }

  /**
   * Resets all selected filters
   */
  function resetFilters() {
    setSelectedCategories([]);
    setSelectedPriorities([]);
    setSelectedStatuses([]);
    setSelectedSites([]);
  }

  /**
   * Handles updating an issue
   */
  function handleIssueUpdate() {
    fetchIssues();
  }

  // Pagination functions
  /**
   *
   * @param pageNumber
   */
  function changePage(pageNumber) {
    setPage((prevPage) => ({...prevPage, number: pageNumber}));
  }

  /**
   *
   * @param e
   */
  function updatePageRows(e) {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setPage({number: 1, rows: newRowsPerPage});
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Calculate pagination
  const startIndex = (page.number - 1) * page.rows;
  const endIndex = startIndex + page.rows;
  const paginatedIssues = filteredIssues.slice(startIndex, endIndex);

  const tabList = [
    {
      id: 'category',
      label: (
        <span>
          Category{' '}
          <span className="badge bg-primary">{selectedCategories.length}</span>
        </span>
      ),
    },
    {
      id: 'priority',
      label: (
        <span>
          Priority{' '}
          <span className="badge bg-primary">{selectedPriorities.length}</span>
        </span>
      ),
    },
    {
      id: 'status',
      label: (
        <span>
          Status{' '}
          <span className="badge bg-primary">{selectedStatuses.length}</span>
        </span>
      ),
    },
    {
      id: 'site', // Added site tab
      label: (
        <span>
          Site{' '}
          <span className="badge bg-primary">{selectedSites.length}</span>
        </span>
      ),
    },
  ];

  const panelTitle = (
    <div className="panel-title-container">
      <span>Filters</span>
      <button
        type="button"
        className="btn btn-primary btn-sm filter-reset-button"
        onClick={resetFilters}
      >
        Reset
      </button>
    </div>
  );

  return (
    <div className="issue-tracker-batch-mode">
      <Panel
        id="filter-panel"
        title={panelTitle}
        collapsing={true}
        panelSize="auto"
        className="panel-default"
      >
        <Tabs
          tabs={tabList}
          defaultTab="category"
          onTabChange={() => {}}
          updateURL={false}
        >
          <TabPane TabId="category">
            <div className="filter-list">
              {Object.entries(categories).map(([value, label]) => (
                <label key={value} className="d-block">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(value)}
                    onChange={() =>
                      toggleFilter(
                        selectedCategories,
                        setSelectedCategories,
                        value,
                      )
                    }
                    className="checkbox me-2"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </TabPane>
          <TabPane TabId="priority">
            <div className="filter-list">
              {Object.entries(priorities).map(([value, label]) => (
                <label key={value} className="d-block">
                  <input
                    type="checkbox"
                    checked={selectedPriorities.includes(value)}
                    onChange={() =>
                      toggleFilter(
                        selectedPriorities,
                        setSelectedPriorities,
                        value
                      )
                    }
                    className="checkbox me-2"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </TabPane>
          <TabPane TabId="status">
            <div className="filter-list">
              {Object.entries(statuses).map(([value, label]) => (
                <label key={value} className="d-block">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(value)}
                    onChange={() =>
                      toggleFilter(
                        selectedStatuses,
                        setSelectedStatuses,
                        value
                      )
                    }
                    className="checkbox me-2"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </TabPane>
          <TabPane TabId="site">
            <div className="filter-list">
              {Object.entries(sites).map(([value, label]) => (
                <label key={value} className="d-block">
                  <input
                    type="checkbox"
                    checked={selectedSites.includes(value)}
                    onChange={() =>
                      toggleFilter(selectedSites, setSelectedSites, value)
                    }
                    className="checkbox me-2"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </TabPane>
        </Tabs>
      </Panel>
      <br/>
      <div className="pagination-container">
        <div>
          {paginatedIssues.length} issues displayed of {filteredIssues.length}.
          (Maximum issues per page:
          <select
            className="input-sm perPage"
            onChange={updatePageRows}
            value={page.rows}
          >
            <option>10</option>
            <option>50</option>
            <option>100</option>
          </select>
          )
        </div>
        <div className="pagination-controls">
          <PaginationLinks
            Total={filteredIssues.length}
            onChangePage={changePage}
            RowsPerPage={page.rows}
            Active={page.number}
          />
        </div>
      </div>
      <div className="issues-list">
        {paginatedIssues.length > 0 ? (
          paginatedIssues.map((issue) => (
            <IssueCard
              key={issue.issueID}
              issue={issue}
              onUpdate={handleIssueUpdate}
              statuses={statuses}
              priorities={priorities}
              categories={categories}
              sites={sites}
            />
          ))
        ) : (
          <div className="no-results-message">
            No issues match the selected filters.
          </div>
        )}
      </div>
      <div className="pagination-container">
        <div>
          {paginatedIssues.length} issues displayed of {filteredIssues.length}.
          (Maximum issues per page:
          <select
            className="input-sm perPage"
            onChange={updatePageRows}
            value={page.rows}
          >
            <option>10</option>
            <option>50</option>
            <option>100</option>
          </select>
          )
        </div>
        <div className="pagination-controls">
          <PaginationLinks
            Total={filteredIssues.length}
            onChangePage={changePage}
            RowsPerPage={page.rows}
            Active={page.number}
          />
        </div>
      </div>
    </div>
  );
}

IssueTrackerBatchMode.propTypes = {
  options: PropTypes.shape({
    priorities: PropTypes.object,
    statuses: PropTypes.object,
    categories: PropTypes.object,
    sites: PropTypes.object,
  }).isRequired,
};

export default IssueTrackerBatchMode;
