ALTER TABLE final_radiological_review ADD COLUMN Review_Done2_val enum ('yes','no','not_answered');
UPDATE final_radiological_review SET Review_Done2_val = 'no' WHERE Review_Done2 = 0;
UPDATE final_radiological_review SET Review_Done2_val = 'yes' WHERE Review_Done2 = 1;
ALTER TABLE final_radiological_review DROP Review_Done2;
ALTER TABLE final_radiological_review ADD COLUMN Review_Done2 enum ('yes','no','not_answered');
UPDATE final_radiological_review SET Review_Done2 = 'yes' WHERE Review_Done2_val = 'yes';
UPDATE final_radiological_review SET Review_Done2 = 'no' WHERE Review_Done2_val = 'no';
ALTER TABLE final_radiological_review DROP Review_Done2_val;
