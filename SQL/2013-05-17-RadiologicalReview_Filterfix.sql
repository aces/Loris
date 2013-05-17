ALTER TABLE final_radiological_review ADD COLUMN Finalized_val enum ('yes','no','not_answered');
UPDATE final_radiological_review SET Finalized_val = 'no' WHERE Finalized = 0;
UPDATE final_radiological_review SET Finalized_val = 'yes' WHERE Finalized = 1;
ALTER TABLE final_radiological_review ADD COLUMN Review_Done_val enum ('yes','no','not_answered');
UPDATE final_radiological_review SET Review_Done_val = 'no' WHERE Review_Done = 0;
UPDATE final_radiological_review SET Review_Done_val = 'yes' WHERE Review_Done = 1;
