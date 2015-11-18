DELETE cu FROM conflicts_unresolved cu LEFT JOIN flag f ON (cu.CommentId1=f.CommentID) WHERE f.Data_entry='In Progress';
DELETE cu FROM conflicts_unresolved cu LEFT JOIN flag f ON (cu.CommentId2=f.CommentID) WHERE f.Data_entry='In Progress';
