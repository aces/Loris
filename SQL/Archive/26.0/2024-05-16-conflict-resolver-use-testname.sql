ALTER TABLE conflicts_resolved
	CHANGE `TableName` `TestName` varchar(255) NOT NULL;

ALTER TABLE conflicts_unresolved
	CHANGE `TableName` `TestName` varchar(255) NOT NULL;
