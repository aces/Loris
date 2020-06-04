--
-- Updates all rows of the document_repository table:
--
-- if column data_dir has a value the starts with the string '../document_respository', this 
-- part is removed from the value. If it does not start with the target string, it is left 
-- untouched.
--

UPDATE document_repository
SET Data_dir =  if (
                    locate('../document_repository/', data_dir) = 1, 
                    substr(data_dir,length('../document_repository/')+1),
                    data_dir
                );

