ALTER TABLE ConfigSettings
MODIFY COLUMN DataType enum('text','boolean','email','instrument','textarea','scan_type','date_format','lookup_center','path','web_path','log_level', 'password_algo') DEFAULT NULL;

INSERT INTO `ConfigSettings` (`Name`, `Description`, `Visible`, `AllowMultiple`, `DataType`, `Parent`, `Label`, `OrderNumber`)
VALUES ('passwordAlgorithm','Which PHP password algorithm to use for hashing the passwords',1,0,'password_algo',1,'Password Algorithm',28);

INSERT INTO Config (`ConfigID`, `Value`) VALUES (LAST_INSERT_ID(), 'PASSWORD_DEFAULT');