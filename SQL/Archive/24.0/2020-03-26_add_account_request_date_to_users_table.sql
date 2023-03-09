-- add a new column to the users table to store the date at which
-- the user requested an account
ALTER TABLE users
  ADD COLUMN account_request_date DATE DEFAULT NULL;

-- determine the account_request_date based on what is present in the history
-- table for when the user was inserted the first time in the history table
UPDATE users u, history h 
  SET u.account_request_date=h.changeDate 
  WHERE 
    h.tbl='users'  AND 
    h.col='UserID' AND
    h.old IS NULL  AND
    u.UserID=h.new;
