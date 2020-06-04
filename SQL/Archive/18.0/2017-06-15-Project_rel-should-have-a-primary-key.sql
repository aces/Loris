CREATE TEMPORARY TABLE
    project_rel_tmp
AS
    SELECT DISTINCT
        ProjectID, SubprojectID
    FROM
        project_rel;

DELETE FROM project_rel;

INSERT INTO
    project_rel (ProjectID, SubprojectID)
SELECT
    ProjectID, SubprojectID
FROM
    project_rel_tmp;

ALTER TABLE `project_rel` ADD PRIMARY KEY( `ProjectID`, `SubprojectID`);
