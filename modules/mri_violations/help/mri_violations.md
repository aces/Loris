# MRI Violated Scans

The MRI Violations module displays scans that have been flagged for significant variance from the study protocol.
Use the Selection Filters to specify or search by Patient Name, MincFile, Scan Type, Project, Site, then click Show Data
to apply the selection filters in the data table below. 

The data results table contains two tabs: "Not Resolved" (displayed by default) and "Resolved". The "Resolution Status"
column is used to display and update the scan status: Reran, Emailed Site/Pending, Inserted, etc. When a scan is updated
to any status other than "Unresolved", it will move to the "Resolved" tab data table. Users with appropriate privileges
must manually update the status of each "Unresolved" scan, when relevant. 

Visualize the scan in a new BrainBrowser window by clicking in the "MincFile" column. To view details of the protocol
violations issue, click in the "Problem" column, on any "Protocol Violation" link to load a new page listing the 
MRI Protocol Violations, organized by Patient Name, CandID, Visit Label, Scan Type, Severity, Header, Value, ValidRange,
ValidRegex, and SeriesUID. 
