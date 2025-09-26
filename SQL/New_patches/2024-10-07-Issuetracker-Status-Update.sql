ALTER TABLE issues
    MODIFY COLUMN status enum('new','acknowledged','feedback','assigned','resolved','closed','rejected') DEFAULT NULL;