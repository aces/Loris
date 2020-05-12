--Changes survey accounts emails to person[1...]@example.com
--Change the '-3' if you wish to change the numbering
UPDATE participant_accounts SET Email=(CONCAT ('person',(participant_accounts.ID - 3),'@example.com'));

