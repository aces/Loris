import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import IssueCard from './IssueCard';
import Loader from 'Loader';
import PaginationLinks from 'jsx/PaginationLinks';
import Panel from 'jsx/Panel';
import {Tabs, TabPane} from 'jsx/Tabs';
import swal from 'sweetalert2';
import '../css/issue_tracker_batchmode.css';
import {withTranslation} from 'react-i18next';

const NO_CHANGE = '__no_change__';

/**
 * IssueTrackerBatchMode component
 *
 * @param {object} props - The component props
 * @param {object} props.options - The options for the IssueTrackerBatchMode
 * @param {boolean} props.canCloseIssues - Whether issues can be closed
 * @param {function} props.t - Translation function
 */
function IssueTrackerBatchMode({options = {}, canCloseIssues, t}) {
  const [issues, setIssues] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignees, setAssignees] = useState({});
  const [otherWatchers, setOtherWatchers] = useState({});
  const [selectedIssueIDs, setSelectedIssueIDs] = useState([]);
  const [batchUpdates, setBatchUpdates] = useState({
    status: NO_CHANGE,
    priority: NO_CHANGE,
    category: NO_CHANGE,
    assignee: NO_CHANGE,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    selectedAssignees,
    issues,
  ]);

  /**
   * Fetches issues from the server
   */
  async function fetchIssues() {
    try {
      const response = await fetch(
        `${loris.BaseURL}/issue_tracker/BatchEdit/`,
        {
          credentials: 'include', // This ensures cookies are sent with the request
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      // ordering watchers
      const watchers = data.otherWatchers || {};
      const orderedWatchers = Object.keys(watchers)
        .sort()
        .reduce((obj, key) => {
          obj[key] = watchers[key];
          return obj;
        }, {}
        );

      // set data
      setIssues((data.issues || []).map((issue) => ({
        ...issue,
        issueID: Number(issue.issueID),
      })));
      setAssignees(data.assignees || {});
      setOtherWatchers(orderedWatchers || {});
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching issues:', error);
      setError(t('Failed to fetch issues. Please try again later.',
        {ns: 'issue_tracker'}));
      setIsLoading(false);
    }
  }

  /**
   * Filters issues based on selected categories, priorities, statuses, and sites
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
        selectedSites.includes(String(issue.centerID))) &&
      (selectedAssignees.length === 0 ||
        selectedAssignees.includes(String(issue.assignee)))
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
    setSelectedAssignees([]);
  }

  /**
   * Handles updating an issue
   */
  function handleIssueUpdate() {
    fetchIssues();
  }

  /**
   * Toggles whether an issue is selected for the batch update.
   *
   * @param {number} issueID - The issue ID to toggle
   */
  function toggleIssueSelection(issueID) {
    setSelectedIssueIDs((current) => current.includes(issueID) ?
      current.filter((id) => id !== issueID) :
      [...current, issueID]
    );
  }

  /**
   * Selects or clears every issue matching the current filters.
   */
  function toggleAllFilteredIssues() {
    const filteredIssueIDs = filteredIssues.map((issue) => issue.issueID);
    const allFilteredSelected = filteredIssueIDs.length > 0 &&
      filteredIssueIDs.every((issueID) => selectedIssueIDs.includes(issueID));

    setSelectedIssueIDs((current) => allFilteredSelected ?
      current.filter((issueID) => !filteredIssueIDs.includes(issueID)) :
      [...new Set([...current, ...filteredIssueIDs])]
    );
  }

  /**
   * Updates one field in the pending batch changes.
   *
   * @param {string} field - The issue field to update
   * @param {string} value - The selected value
   */
  function updateBatchField(field, value) {
    setBatchUpdates((current) => ({...current, [field]: value}));
  }

  /**
   * Submits the selected batch changes.
   */
  async function submitBatchEdit() {
    if (selectedIssueIDs.length === 0) {
      await swal.fire({
        type: 'info',
        text: t('Select at least one issue.', {ns: 'issue_tracker'}),
      });
      return;
    }

    const updates = Object.entries(batchUpdates).reduce(
      (result, [field, value]) => {
        if (value !== NO_CHANGE) {
          result[field] = value === '' ? null : value;
        }
        return result;
      },
      {}
    );

    if (Object.keys(updates).length === 0) {
      await swal.fire({
        type: 'info',
        text: t('Choose at least one field to update.',
          {ns: 'issue_tracker'}),
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${loris.BaseURL}/issue_tracker/BatchEdit/`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({issueIDs: selectedIssueIDs, updates}),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Network response was not ok');
      }

      setSelectedIssueIDs([]);
      setBatchUpdates({
        status: NO_CHANGE,
        priority: NO_CHANGE,
        category: NO_CHANGE,
        assignee: NO_CHANGE,
      });
      await fetchIssues();
      await swal.fire({
        type: 'success',
        text: t('{{count}} issue updated successfully', {
          ns: 'issue_tracker',
          count: data.updated,
        }),
      });
    } catch (error) {
      console.error('Error updating issues:', error);
      await swal.fire({
        type: 'error',
        text: error.message || t(
          'Failed to update issues. Please try again later.',
          {ns: 'issue_tracker'}
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Pagination functions
  /**
   *
   * @param {number} pageNumber - The page number to navigate to
   */
  function changePage(pageNumber) {
    setPage((prevPage) => ({...prevPage, number: pageNumber}));
  }

  /**
   *
   * @param {object} e - The event object
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
  const filteredIssueIDs = filteredIssues.map((issue) => issue.issueID);
  const allFilteredSelected = filteredIssueIDs.length > 0 &&
    filteredIssueIDs.every((issueID) => selectedIssueIDs.includes(issueID));
  const hasBatchUpdates = Object.values(batchUpdates)
    .some((value) => value !== NO_CHANGE);

  const tabList = [
    {
      id: 'category',
      label: (
        <span>
          {t('Category', {ns: 'issue_tracker'})}{' '}
          <span className="badge bg-primary">{selectedCategories.length}</span>
        </span>
      ),
    },
    {
      id: 'priority',
      label: (
        <span>
          {t('Priority', {ns: 'issue_tracker'})}{' '}
          <span className="badge bg-primary">{selectedPriorities.length}</span>
        </span>
      ),
    },
    {
      id: 'status',
      label: (
        <span>
          {t('Status', {ns: 'loris'})}{' '}
          <span className="badge bg-primary">{selectedStatuses.length}</span>
        </span>
      ),
    },
    {
      id: 'site', // Added site tab
      label: (
        <span>
          {t('Site', {ns: 'loris', count: 1})}{' '}
          <span className="badge bg-primary">{selectedSites.length}</span>
        </span>
      ),
    },
    {
      id: 'assignee', // Added assignee tab
      label: (
        <span>
          Assignee{' '}
          <span className="badge bg-primary">{selectedAssignees.length}</span>
        </span>
      ),
    },
  ];

  const panelTitle = (
    <div className="panel-title-container">
      <span>{t('Filters', {ns: 'loris'})}</span>
      <button
        type="button"
        className="btn btn-primary btn-sm filter-reset-button"
        onClick={resetFilters}
      >
        {t('Reset', {ns: 'loris'})}
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
          <TabPane TabId="assignee">
            <div className="filter-list">
              {Object.entries(assignees).map(([value, label]) => (
                <label key={value} className="d-block">
                  <input
                    type="checkbox"
                    checked={selectedAssignees.includes(value)}
                    onChange={() =>
                      toggleFilter(
                        selectedAssignees,
                        setSelectedAssignees,
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
        </Tabs>
      </Panel>
      <br/>
      <Panel
        id="batch-edit-panel"
        title={t('Batch changes', {ns: 'issue_tracker'})}
        collapsing={true}
        panelSize="auto"
        className="panel-default"
      >
        <div className="batch-selection-controls">
          <label>
            <input
              type="checkbox"
              checked={allFilteredSelected}
              disabled={filteredIssueIDs.length === 0}
              onChange={toggleAllFilteredIssues}
              className="checkbox"
            />
            {t('Select all filtered issues', {ns: 'issue_tracker'})}
          </label>
          <span>
            {t('{{count}} issue selected', {
              ns: 'issue_tracker',
              count: selectedIssueIDs.length,
            })}
          </span>
          <button
            type="button"
            className="btn btn-default btn-sm"
            disabled={selectedIssueIDs.length === 0 || isSubmitting}
            onClick={() => setSelectedIssueIDs([])}
          >
            {t('Clear selection', {ns: 'issue_tracker'})}
          </button>
        </div>
        <div className="batch-edit-controls">
          <label>
            {t('Status', {ns: 'loris'})}
            <select
              className="form-control input-sm"
              value={batchUpdates.status}
              disabled={isSubmitting}
              onChange={(event) =>
                updateBatchField('status', event.target.value)
              }
            >
              <option value={NO_CHANGE}>
                {t('No change', {ns: 'issue_tracker'})}
              </option>
              {Object.entries(statuses)
                .filter(([value]) => canCloseIssues ||
                  !['closed', 'rejected'].includes(value))
                .map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
            </select>
          </label>
          <label>
            {t('Priority', {ns: 'issue_tracker'})}
            <select
              className="form-control input-sm"
              value={batchUpdates.priority}
              disabled={isSubmitting}
              onChange={(event) =>
                updateBatchField('priority', event.target.value)
              }
            >
              <option value={NO_CHANGE}>
                {t('No change', {ns: 'issue_tracker'})}
              </option>
              {Object.entries(priorities).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            {t('Category', {ns: 'issue_tracker'})}
            <select
              className="form-control input-sm"
              value={batchUpdates.category}
              disabled={isSubmitting}
              onChange={(event) =>
                updateBatchField('category', event.target.value)
              }
            >
              <option value={NO_CHANGE}>
                {t('No change', {ns: 'issue_tracker'})}
              </option>
              <option value="">
                {t('Uncategorized', {ns: 'issue_tracker'})}
              </option>
              {Object.entries(categories).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            {t('Assignee', {ns: 'issue_tracker'})}
            <select
              className="form-control input-sm"
              value={batchUpdates.assignee}
              disabled={isSubmitting}
              onChange={(event) =>
                updateBatchField('assignee', event.target.value)
              }
            >
              <option value={NO_CHANGE}>
                {t('No change', {ns: 'issue_tracker'})}
              </option>
              <option value="">
                {t('Unassigned', {ns: 'issue_tracker'})}
              </option>
              {Object.entries(assignees).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="btn btn-primary batch-update-button"
            disabled={selectedIssueIDs.length === 0 ||
              !hasBatchUpdates || isSubmitting}
            onClick={submitBatchEdit}
          >
            {isSubmitting ?
              t('Updating...', {ns: 'issue_tracker'}) :
              t('Apply changes', {ns: 'issue_tracker'})}
          </button>
        </div>
      </Panel>
      <br/>
      <div className="pagination-container">
        <div>
          {t('{{count}} issues displayed of {{total}}', {
            ns: 'issue_tracker',
            count: paginatedIssues.length,
            total: filteredIssues.length,
          })}
          {' ('}
          {t('Maximum issues per page: {{total}}', {
            ns: 'issue_tracker',
            total: paginatedIssues.length,
          })}
          <select
            className="input-sm perPage"
            onChange={updatePageRows}
            value={page.rows}
          >
            <option>10</option>
            <option>50</option>
            <option>100</option>
          </select>
          {')'}
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
            <div
              key={issue.issueID}
              className={'issue-selection-card' +
                (selectedIssueIDs.includes(issue.issueID) ? ' selected' : '')}
            >
              <label className="issue-selection-control">
                <input
                  type="checkbox"
                  checked={selectedIssueIDs.includes(issue.issueID)}
                  onChange={() => toggleIssueSelection(issue.issueID)}
                  className="checkbox"
                />
                {t('Select issue', {ns: 'issue_tracker'})} #{issue.issueID}
              </label>
              <IssueCard
                issue={issue}
                assignees={assignees}
                otherWatchers={otherWatchers}
                onUpdate={handleIssueUpdate}
                statuses={statuses}
                priorities={priorities}
                categories={categories}
                sites={sites}
              />
            </div>
          ))
        ) : (
          <div className="no-results-message">
            {t('No issues match the selected filters.',
              {ns: 'issue_tracker'})}
          </div>
        )}
      </div>
      <div className="pagination-container">
        <div>
          {t('{{count}} issues displayed of {{total}}', {
            ns: 'issue_tracker',
            count: paginatedIssues.length,
            total: filteredIssues.length,
          })}.
          {' ('}
          {t('Maximum issues per page: {{total}}', {
            ns: 'issue_tracker',
            count: paginatedIssues.length,
          })}
          <select
            className="input-sm perPage"
            onChange={updatePageRows}
            value={page.rows}
          >
            <option>10</option>
            <option>50</option>
            <option>100</option>
          </select>
          {')'}
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
    assignees: PropTypes.object,
  }).isRequired,
  canCloseIssues: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation(
  ['issue_tracker', 'loris'])(IssueTrackerBatchMode);
