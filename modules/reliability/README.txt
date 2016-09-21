***THIS README SHOULD BE TRANSFERED TO THE LORIS WIKI WHEN PULL REQUEST IS MERGED***

I. Populating the database directly
    The following SQL snippet should serve as a template to populate the reliability_instruments table in the database
        INSERT INTO reliability_instruments
        (TestID, Visit_label, Target_scope, Target_siteID, Threshold, Reliability_ratio, ProjectID)
        VALUES	(3, NULL, 'Within', NULL, 89.5, 0.1, 1),
        		(3, 'V06', 'Cross', 6, 89.5, 0.15, NULL);

    TestID refers to the ID from test_names table associated with the test on which reliability checks should be done.
    Visit_label is optional. When left as NULL, the reliability will be selected randomly across all visit labels present in the database for a specific test. By defining a specific Visit_label, the ratio indicated for this entry will be selected from that visit label specifically.
    Target_scope determines if the site where the reliability check will be done is the same as the data-entry site "within" or another site from the 'psc' table in the database "cross".
        NOTE: only study sites are considered for Cross site reliability selection. If a non-study site is desired, please refer to Target_siteID.
    Target_siteID is used to override if desired the site at which reliability should be done. the ID refers to the ID of the 'psc' table in the database.
        NOTE: this field accepts non-study sites are targets.
    Threshold represents the score required for an instrument to be considered reliable. This entry should be between 0 and 100.
    Reliability_ratio is the portion of candidates flagged for reliability at the specified visit label and for the specified project and instrument.
    ProjectID can be used to specifically target one project for reliability. If left NULL, all projects will be considered for the defined ratio.

    The combination of (TestID, Visit_label, Target_scope, Target_siteID, ProjectID) should be unique in the table

II. Starting with config.xml
    Loris releases prior to 17.0 use the config.xml file in the project folder to define some fields of the reliability_instruments table. In order to transfer those fields to the database, A script was created in the loris/tools/ folder under the name "populate_reliability_instruments.php". The former script uses Test_name and threshold from the config.xml and fills the remianing fields with default 0.1 ratio and "Within" Target_scope.
    Further editing of the table should be done from the Database directly.

