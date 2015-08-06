DELETE cu FROM conflicts_unresolved cu LEFT JOIN flag f ON (cu.CommentID1=f.CommentID) LEFT JOIN session s ON (f.SessionID=s.ID) WHERE s.Current_stage='Recycling Bin';
