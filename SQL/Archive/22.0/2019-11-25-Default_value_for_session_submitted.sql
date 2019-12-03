UPDATE session SET Submitted='N' WHERE Submitted IS NULL;
ALTER TABLE session CHANGE Submitted Submitted ENUM('Y','N') DEFAULT 'N' NOT NULL;

