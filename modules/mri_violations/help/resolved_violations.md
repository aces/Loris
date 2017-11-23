# MRI Protocol Violations

The MRI Violations Module has a Selection Filter function to allow users to search for a particular scan that violates MRI protocol. By clicking the button Show Data after selecting certain search options, a box will appear containing all the search results, which are organized by Patient Name, Project, Subproject, Site, Time Run, MincFile name, MincFile Violated, Series Description Or Scan Type, Problem, and Resolution Status. 
 Clicking on a link under the MincFileViolated column will open a pop-up window of the scan on Brainbrowser. 
 Clicking on a link under the Problem column will allow the user to see the issues for that particular patient and visit label. The issues are organized by Patient Name, CandID, Visit Label, Scan Type, Severity, Header, Value, ValidRange, ValidRegex, and SeriesUID. 
 Once a particular MRI Protocol Violation has been resolved, the Resolution Status can be updated using the drop-down menu to select one of the following options: Reran, Emailed site/pending, Inserted, Rejected, Inserted with flag, Other. Otherwise, the drop-down menu is left as "Unresolved", serving as a message to other users that an issue still exists.
